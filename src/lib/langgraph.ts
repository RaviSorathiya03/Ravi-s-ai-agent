import { ChatAnthropic } from "@langchain/anthropic";
import { InMemoryCache } from "@langchain/core/caches";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import wxflows from "@wxflows/sdk/langchain";
import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import SYSTEM_MESSAGE from "../constant/SystemMessage";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

// Trimmer to keep message size small
const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

// Enable caching
const cache = new InMemoryCache();

// Initialize wxflows client
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_API_KEY || "",
});

const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

// 👇 Added: Unified model initializer (OpenAI or Anthropic)
export const initialiseModel = (provider: "openai" | "anthropic" = "openai") => {
  let model;

  if (provider === "anthropic") {
    // ✅ Anthropic model
    model = new ChatAnthropic({
      model: "claude-3-5-sonnet-20241022", // or any supported Claude model
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      temperature: 0.7,
      maxTokens: 4096,
      cache,
      streaming: true,
      callbacks: [
        {
          handleLLMStart: async () => {
            // console.log("Starting Anthropic LLM...");
          },
          handleLLMEnd: async (output) => {
            const usage = output.llmOutput?.usage;
            if (usage) {
              // console.log("Anthropic usage:", usage);
            }
          },
        },
      ],
    }).bindTools(tools);
  } else {
    // ✅ OpenAI model (default)
    model = new ChatOpenAI({
      model: "gpt-4o",
      openAIApiKey: process.env.OPENAI_API_KEY!,
      temperature: 0.7,
      maxTokens: 4096,
      streaming: true,
      cache,
      callbacks: [
        {
          handleLLMStart: async () => {
            // console.log("Starting OpenAI LLM...");
          },
          handleLLMEnd: async (output) => {
            const usage = output.llmOutput?.usage;
            if (usage) {
              // console.log("OpenAI usage:", usage);
            }
          },
        },
      ],
    }).bindTools(tools);
  }

  return model;
};

// Conditional edge logic
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  if (lastMessage.content && lastMessage._getType() === "tool") {
    return "agent";
  }

  return END;
}

// Main workflow creation
export const createWorkFlow = (provider: "openai" | "anthropic" = "openai") => {
  const model = initialiseModel(provider);

  const stateGraph = new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      const systemContent = SYSTEM_MESSAGE;
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemContent, {
          cache_control: { type: "ephemeral" },
        }),
        new MessagesPlaceholder("messages"),
      ]);

      const trimmedMessage = await trimmer.invoke(state.messages);
      const prompt = await promptTemplate.invoke({ messages: trimmedMessage });
      const response = await model.invoke(prompt);
      return { messages: [response] };
    })
    .addEdge(START, "agent")
    .addNode("tools", toolNode)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  return stateGraph;
};

// Utility to add cache headers
function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
  if (!messages.length) return messages;

  const cachedMessages = [...messages];

  const addCache = (message: BaseMessage) => {
    message.content = [
      {
        type: "text",
        text: message.content as string,
        cache_control: { type: "ephemeral" },
      },
    ];
  };

  addCache(cachedMessages.at(-1)!);

  let humanCount = 0;
  for (let i = cachedMessages.length - 1; i >= 0; i--) {
    if (cachedMessages[i] instanceof HumanMessage) {
      humanCount++;
      if (humanCount === 2) {
        addCache(cachedMessages[i]);
        break;
      }
    }
  }

  return cachedMessages;
}

// Submit a question and stream the response
export async function submitQuestion(
  messages: BaseMessage[],
  chatId: string,
  provider: "openai" | "anthropic" = "openai"
) {
  const cachedMessages = addCachingHeaders(messages);
  const workflow = createWorkFlow(provider);
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
