import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import { redirect } from 'next/navigation'
import { getConvexClient } from "@/lib/convex";
import { auth } from '@clerk/nextjs/server';
import { api } from '../../../../../convex/_generated/api';
import ChatInterface from '@/components/ChatInterface';

interface ChatPageProps{
    params: Promise<{
        chatId: Id<"chats">
    }>
}

const ChatPage = async ({params}:ChatPageProps) => {

    const {chatId} = await params;
    const {userId} =await auth();
    if(!userId){
      redirect("/")
    }
 

    try {
      const convex = getConvexClient();

      const initialMessage = await convex.query(api.messages.list, {chatId});
      return (
        <div className='flex-1 overflow-hidden'>
          <ChatInterface chatId={chatId} initialMessages={initialMessage}/>
        </div>
      );
    
    } catch (error) {
      console.log(error)
      redirect("/dashboard")
    }

    

   

  return (
    <div>ChatPage</div>
  )
}

export default ChatPage