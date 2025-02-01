import { ChatOpenAI } from "@langchain/openai";
import { InMemoryCache } from "@langchain/core/caches";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import wxflows from '@wxflows/sdk/langchain'


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
