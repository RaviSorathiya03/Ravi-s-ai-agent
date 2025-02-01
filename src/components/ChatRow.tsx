'use client'

import { useRouter } from "next/navigation";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { use } from "react";
import { NavigationContext } from "@/lib/NavigationProvider";
import { Button } from "./ui/button";
import { MessageCircle, Trash } from 'lucide-react';
import { motion } from "framer-motion";

function ChatRow({
  chat,
  onDelete
}: {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
}) {
  const router = useRouter();
  const { closeMobileNav } = use(NavigationContext);

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  return (
    <motion.div
      className="group overflow-y-hidden rounded-xl border border-gray-200/30 bg-gradient-to-r from-white/50 to-gray-50/50 backdrop-blur-sm hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md overflow-hidden"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-lg">
              <MessageCircle size={16} className="text-white" />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
              {chat.title || "New Chat"}
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(chat._id);
              }}
            >
              <Trash size={16} />
            </Button>
          </motion.div>
        </div>
        {/* Uncomment and adjust when you have lastMessage functionality
        {lastMessage && (
          <p className="text-xs text-gray-400 mt-2 font-medium truncate">
            <TimeAgo date={lastMessage.createdAt}/>
          </p>
        )}
        */}
      </div>
    </motion.div>
  );
}

export default ChatRow;
