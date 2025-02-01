"use client"

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ArrowRight, Zap, Sparkles, Brain } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 filter blur-3xl opacity-50" />
      </div>

      <section className="w-full px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-16 text-center relative">
        {/* Hero content */}
        <motion.header
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            AI Agent Assistant
          </h1>
          <p className="max-w-[600px] text-lg text-gray-600 md:text-xl/relaxed xl:text-2xl/relaxed">
            Meet your new AI chat companion that goes beyond conversation - it can actually get things done!
          </p>
          <p className="text-gray-400 text-sm animate-pulse">
            Powered by IBM&apos;s WxTools & your favourite LLM&apos;s.
          </p>
        </motion.header>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SignedIn>
            <Link href="/dashboard">
              <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl={"/dashboard"} forceRedirectUrl={"/dashboard"}>
              <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </SignInButton>
          </SignedOut>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-12 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { title: "Lightning Fast", description: "Real-time streamed responses", icon: Zap },
            { title: "Cutting-Edge Tech", description: "Next.js 15, Tailwind CSS, Convex, Clerk", icon: Sparkles },
            { title: "AI-Powered", description: "Leveraging state-of-the-art LLMs", icon: Brain },
          ].map(({ title, description, icon: Icon }) => (
            <motion.div
              key={title}
              className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial */}
        <motion.div
          className="mt-16 bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-gray-700 italic">
            "This AI assistant has revolutionized the way I work. It's not just a chatbot, it's a productivity
            powerhouse!"
          </p>
          <p className="mt-4 font-semibold text-gray-900">- Sarah Johnson, Tech Entrepreneur</p>
        </motion.div>
      </section>
    </main>
  )
}

