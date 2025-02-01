import { Id } from "../../convex/_generated/dataModel";

export type MessageRole = "user" | "assistant";

export interface Message{
    role: MessageRole;
    content: string;
}

export interface ChatRequestBody{
    messages: Message[];
    newMessagge: string;
    chatId: Id<"chats">;
}