'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function CreatePostPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    codeSnippet: '',
    tags: '',
    isPremium: false
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const tags = formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0)

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          codeSnippet: formData.codeSnippet || undefined,
          tags,
          isPremium: formData.isPremium
        })
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to create post')
        setIsLoading(false)
        return
      }

      toast.success('Post created successfully!')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors h-40 resize-none"
              placeholder="Share your thoughts, tips, or insights..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Code Snippet (optional)
            </label>
            <textarea
              value={formData.codeSnippet}
              onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
              placeholder="// Your code here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="react, javascript, nextjs"
            />
          </div>

          {(session.user as any).isPremium && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="premium"
                checked={formData.isPremium}
                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                className="w-5 h-5 rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="premium" className="text-zinc-300">
                Mark as Premium (Pro users only)
              </label>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
