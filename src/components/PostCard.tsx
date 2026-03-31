'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PostProps {
  post: {
    id: string
    content: string
    codeSnippet?: string | null
    tags: string[]
    isPremium: boolean
    createdAt: Date
    author: {
      id: string
      name: string | null
      username: string
      image: string | null
      isVerified: boolean
      isPremium: boolean
    }
    _count: {
      comments: number
      likes: number
    }
  }
}

export default function PostCard({ post }: PostProps) {
  const [likes, setLikes] = useState(post._count.likes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    toast.success(isLiked ? 'Removed like' : 'Liked!')
  }

  return (
    <article className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300">
      <div className="flex items-start gap-4">
        <Link href={`/profile/${post.author.username}`}>
          {post.author.image ? (
            <img
              src={post.author.image}
              alt={post.author.name || ''}
              className="w-12 h-12 rounded-full border border-zinc-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-medium">
                {post.author.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${post.author.username}`}
              className="font-medium text-white hover:text-blue-400 transition-colors"
            >
              {post.author.name}
            </Link>
            <span className="text-zinc-500">@{post.author.username}</span>
            {post.author.isVerified && (
              <span className="text-blue-400">✓</span>
            )}
            {post.author.isPremium && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-medium text-white">
                PRO
              </span>
            )}
            {post.isPremium && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                Premium
              </span>
            )}
            <span className="text-zinc-600 text-sm">
              · {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="mt-3 text-zinc-300 whitespace-pre-wrap">{post.content}</p>
          
          {post.codeSnippet && (
            <pre className="mt-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <code className="text-sm text-zinc-300 font-mono">{post.codeSnippet}</code>
            </pre>
          )}
          
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-400' : 'text-zinc-500 hover:text-red-400'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likes}</span>
            </button>
            
            <button className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post._count.comments}</span>
            </button>
            
            <button className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
