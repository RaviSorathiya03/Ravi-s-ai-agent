import { ChatOpenAI } from "@langchain/openai";
import { InMemoryCache } from "@langchain/core/caches";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import wxflows from '@wxflows/sdk/langchain'
import {END, MessagesAnnotation, START, StateGraph} from '@langchain/langgraph'
import SYSTEM_MESSAGE from "../constant/SystemMessage";
import {ChatPromptTemplate, MessagesPlaceholder} from '@langchain/core/prompts'
import { AIMessage, BaseMessage, HumanMessage, SystemMessage, trimMessages } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";

const trimmer = trimMessages({
    maxTokens: 10, 
    strategy: "last", 
    tokenCounter: (msgs) => msgs.length,
    includeSystem: true,
    allowPartial: false, 
    startOn: "human"
})


// Enable caching
const cache = new InMemoryCache();

const toolClient = new wxflows({
    endpoint: process.env.WXFLOWS_ENDPOINT || "",
    apikey: process.env.WXFLOWS_API_KEY || "",

})

const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

export const initialiseModel = () => {
    const model = new ChatOpenAI({
        model: "gpt-4o",
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
        maxTokens: 4096,
        streaming: true,
        cache,
        callbacks: [
            {
                handleLLMStart: async ()=>{
                    // console.log("starting the llm")
                },
                handleLLMEnd: async (output) => {
                    // console.log("ending the llm")
                    const usage = output.llmOutput?.usage;
                    if(usage){
                        // console.log("usage", usage)
                    }
                }
            }
        ] // Attach the cache
    }, ).bindTools(tools);;

    return model;
};

function shouldContinue(state: typeof MessagesAnnotation.State){
    const messages = state.messages;
    const lastMesage = messages[messages.length-1] as AIMessage
    if(lastMesage.tool_calls?.length){
        return "tools";
    }

    if(lastMesage.content && lastMesage._getType()==="tool"){
        return "agent";
    }

    return END;
}


export const createWorkFlow = ()=>{
    const model = initialiseModel();
    const stateGraph = new StateGraph(MessagesAnnotation).addNode('agent', async (state)=>{
        const systemContent = SYSTEM_MESSAGE;
        const promptTemplate = ChatPromptTemplate.fromMessages([
            new SystemMessage(systemContent, {
                cache_control: {type: "emphemeral"}
            }),
            new MessagesPlaceholder("messages")
        ])

        const trimmedMessage = await trimmer.invoke(state.messages);
        const prompt = await promptTemplate.invoke({messages: trimmedMessage});
        const response = await model.invoke(prompt);
        return {messages: [response]};
    })
    .addEdge(START, "agent")
    .addNode('tools', toolNode)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent")

    return stateGraph;
       
}

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
    if (!messages.length) return messages;
  
    // Create a copy of messages to avoid mutating the original
    const cachedMessages = [...messages];
  
    // Helper to add cache control
    const addCache = (message: BaseMessage) => {
      message.content = [
        {
          type: "text",
          text: message.content as string,
          cache_control: { type: "ephemeral" },
        },
      ];
    };
  
    // Cache the last message
    // console.log("🤑🤑🤑 Caching last message");
    addCache(cachedMessages.at(-1)!);
  
    // Find and cache the second-to-last human message
    let humanCount = 0;
    for (let i = cachedMessages.length - 1; i >= 0; i--) {
      if (cachedMessages[i] instanceof HumanMessage) {
        humanCount++;
        if (humanCount === 2) {
          // console.log("🤑🤑🤑 Caching second-to-last human message");
          addCache(cachedMessages[i]);
          break;
        }
      }
    }
  
    return cachedMessages;
  }
  

export async function submitQuestion(messages: BaseMessage[], chatId: string){
    const cachedMessages = addCachingHeaders(messages);
    const workflow = createWorkFlow();
    const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  const stream = await app.streamEvents(
    { messages: cachedMessages },
    {
      version: "v2",
      configurable: { thread_id: chatId },
      streamMode: "messages",
      runId: chatId,
    }
  );
  return stream;
}