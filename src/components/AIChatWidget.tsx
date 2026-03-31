'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const AI_RESPONSES: Record<string, string> = {
  hello: "Hi there! I'm your DevHub AI assistant. I can help you with coding questions, explain programming concepts, or give tips about web development. What would you like to know?",
  javascript: "JavaScript is a versatile programming language used for web development. It can run in browsers and on servers (with Node.js). Would you like me to explain a specific JavaScript concept?",
  react: "React is a popular JavaScript library for building user interfaces. It uses a component-based architecture and includes features like hooks for state management. Want to learn about a specific React feature?",
  nextjs: "Next.js is a React framework that enables features like server-side rendering, static site generation, and API routes. It's great for building full-stack applications. Need help with Next.js?",
  python: "Python is a beginner-friendly programming language known for its simple syntax. It's widely used in web development, data science, AI, and automation.",
  default: "That's an interesting question! While I'm a demo AI, in production I could connect to APIs like OpenAI or Groq to give you detailed answers. Is there a specific coding topic I can help you with?"
}

export default function AIChatWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 Hi! I'm your DevHub AI assistant. Ask me anything about coding, tech, or web development!" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return AI_RESPONSES.hello
    }
    if (lowerInput.includes('javascript') || lowerInput.includes('js')) {
      return AI_RESPONSES.javascript
    }
    if (lowerInput.includes('react')) {
      return AI_RESPONSES.react
    }
    if (lowerInput.includes('nextjs') || lowerInput.includes('next.js')) {
      return AI_RESPONSES.nextjs
    }
    if (lowerInput.includes('python')) {
      return AI_RESPONSES.python
    }
    
    return AI_RESPONSES.default
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    if (!session?.user) {
      toast.error('Please sign in to use AI chat')
      return
    }

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    setTimeout(() => {
      const response = getAIResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-150px)] bg-[#1a1a1a] rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">DevHub AI</h3>
                  <p className="text-xs text-white/70">Demo Mode - Ask me anything!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-zinc-200 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>
    </>
  )
}
