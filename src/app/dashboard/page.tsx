'use client'

import { BotIcon, Zap, Brain, PenToolIcon as Tool } from 'lucide-react';
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div 
        className="relative max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 rounded-3xl"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] rounded-3xl"></div>

        <div className="relative space-y-8 p-8 text-center">
          <motion.div 
            className="bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-white/50 rounded-2xl p-8 space-y-6"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full p-4 inline-flex mx-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <BotIcon className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Your AI Agent Chat
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Embark on a new conversation or revisit an existing chat from the sidebar. 
              Your AI assistant is primed and ready to tackle any task with unparalleled intelligence.
            </p>
            <motion.div 
              className="pt-4 flex justify-center gap-6 text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {[
                { icon: Zap, text: "Real-time responses", color: "bg-blue-500" },
                { icon: Brain, text: "Smart assistance", color: "bg-green-500" },
                { icon: Tool, text: "Powerful tools", color: "bg-purple-500" },
              ].map(({ icon: Icon, text, color }) => (
                <motion.div 
                  key={text}
                  className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                >
                  <div className={`w-2 h-2 rounded-full ${color}`}></div>
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-sm shadow-md rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Start Guide</h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                Select a chat from the sidebar or start a new one
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">2</div>
                Ask your AI assistant anything or request a specific task
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">3</div>
                Enjoy real-time, intelligent responses and task completion
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
