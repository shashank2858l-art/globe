'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-white font-bold text-xl">DevHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-zinc-400 hover:text-white transition-colors">
              Explore
            </Link>
            {session?.user && (
              <Link href="/chat" className="text-zinc-400 hover:text-white transition-colors">
                Chat
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Link
                  href="/create"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  <span>+</span>
                  <span>New Post</span>
                </Link>
                {session.user.isPremium && (
                  <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-medium text-white">
                    PRO
                  </span>
                )}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ""}
                        className="w-8 h-8 rounded-full border border-zinc-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {session.user.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-zinc-800">
                      <Link
                        href={`/profile/${(session.user as any).username}`}
                        className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      {(session.user as any).isVerified && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <hr className="my-2 border-zinc-800" />
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
