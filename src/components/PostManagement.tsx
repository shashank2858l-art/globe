'use client'

import toast from 'react-hot-toast'

interface Post {
  id: string
  content: string
  createdAt: Date
  author: {
    name: string | null
    username: string
  }
}

export default function PostManagement({ posts }: { posts: Post[] }) {
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Post deleted')
      }
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="py-3 border-b border-zinc-800 last:border-0">
            <p className="text-white line-clamp-2">{post.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-zinc-500 text-sm">
                by @{post.author.username} · {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
