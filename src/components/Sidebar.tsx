import { NavigationContext } from '@/lib/NavigationProvider';
import { useRouter } from 'next/navigation'
import React, { use } from 'react'
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import ChatRow from './ChatRow';

const Sidebar = () => {
    const router = useRouter();
    const {closeMobileNav, isMobileNavOpen} = use(NavigationContext)
    const chats = useQuery(api.chats.listChats);
    const createChat = useMutation(api.chats.createChat);
    const deleteChat = useMutation(api.chats.deleteChat);
    const handleClick = ()=>{
        //Route To Chat id page
        closeMobileNav();
        // router.push('/dashboard/chat')
    }

    const handleNewChat = async()=>{
         const chatId = await createChat({title: "New Chat"})
         router.push(`/dashboard/chat/${chatId}`);
         closeMobileNav();
    }

    const handleDeleteChat = async (id: Id<"chats">)=>{
        await deleteChat({id});
        if(window.location.pathname.includes(id)){
            router.push("/dashboard")
        }
    }

  return (
   <>
    {/* backgorund overlay when on the mobile */}
    {isMobileNavOpen && (
        <div className='fixed inset-0 bg-black/20 z-40 md:hidden' onClick={closeMobileNav}></div>
    )}
     <div
        className={cn(
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 w-72 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex flex-col",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
       <div className="p-6 border-b border-gray-200/50 bg-gradient-to-b from-white to-gray-50">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">AI Chat Assistant</h2>
      <Button
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold tracking-wide border-none shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden relative"
        onClick={handleNewChat}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
        <span className="absolute inset-0 w-full h-full flex items-center justify-center">
          <PlusIcon className="mr-2 h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10">New Chat</span>
        </span>
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </Button>
    </div>

        <div className="flex-1 overflow-y-hidden space-y-2.5 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {chats?.map((chat) => (
            <ChatRow key={chat._id} chat={chat} onDelete={handleDeleteChat} />
          ))}
        </div>
      </div>
   </>
  )
}

export default Sidebar