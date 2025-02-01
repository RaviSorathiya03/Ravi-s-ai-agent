"use client"
import React, { useState } from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel'

interface ChatInterfaceProps{
    chatId: Id<"chats">;
    initialMessages: Doc<"messages">[];
}

const ChatInterface = ({chatId, initialMessages}: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<Doc<"messages">[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setLoading] = useState(false);

  return (
    <div>ChatInterface for {chatId}</div>
  )
}

export default ChatInterface