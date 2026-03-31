'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: '1', content: 'Welcome to DevHub Chat!', senderName: 'System', isSystem: true },
    { id: '2', content: 'Hey everyone! Just joined DevHub.', senderName: 'NewDev', isSystem: false },
    { id: '3', content: 'Anyone working on a React project?', senderName: 'Sarah', isSystem: false },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    if (!username) {
      toast.error('Please enter a username first')
      return
    }

    setMessages([...messages, {
      id: Date.now().toString(),
      content: newMessage,
      senderName: username,
      isSystem: false
    }])
    setNewMessage('')
  }

  const handleSetUsername = () => {
    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }
    toast.success(`Welcome, ${username}!`)
  }

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Global Chat</h1>
        
        {!username && (
          <div className="mb-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <p className="text-zinc-400 mb-3">Enter a username to join the chat:</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username..."
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSetUsername}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Join
              </button>
            </div>
          </div>
        )}
        
        <div className="h-[calc(100vh-200px)] rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isSystem ? 'justify-center' : username === msg.senderName ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    msg.isSystem 
                      ? 'bg-zinc-800 text-zinc-400 text-center text-sm'
                      : username === msg.senderName
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {!msg.isSystem && username !== msg.senderName && (
                    <p className="text-xs text-blue-400 font-medium mb-1">@{msg.senderName}</p>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={username ? "Type a message..." : "Join chat first..."}
                disabled={!username}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!username || !newMessage.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
