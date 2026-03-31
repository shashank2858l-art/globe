'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ProfileHeaderProps {
  user: {
    id: string
    name: string | null
    username: string
    email: string
    image: string | null
    bio: string | null
    isVerified: boolean
    isPremium: boolean
    createdAt: Date
    _count: {
      followers: number
      following: number
      posts: number
    }
  }
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const isOwnProfile = session?.user?.id === user.id

  const handleFollow = async () => {
    if (!session?.user) {
      toast.error('Please sign in to follow')
      return
    }

    try {
      const res = await fetch(`/api/users/${user.id}/follow`, {
        method: 'POST'
      })
      if (res.ok) {
        setIsFollowing(!isFollowing)
        toast.success(isFollowing ? 'Unfollowed' : 'Following')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="bg-gradient-to-b from-zinc-900/50 to-transparent border-b border-zinc-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ''}
              className="w-32 h-32 rounded-full border-4 border-zinc-800"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-zinc-800">
              <span className="text-white text-4xl font-bold">
                {user.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              {user.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  Verified
                </span>
              )}
              {user.isPremium && (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium">
                  PRO
                </span>
              )}
            </div>
            <p className="text-zinc-500 mt-1">@{user.username}</p>
            
            {user.bio && (
              <p className="mt-4 text-zinc-300 max-w-lg">{user.bio}</p>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-6">
              <div className="text-center">
                <span className="block text-xl font-bold text-white">{user._count.posts}</span>
                <span className="text-zinc-500 text-sm">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-white">{user._count.followers}</span>
                <span className="text-zinc-500 text-sm">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-white">{user._count.following}</span>
                <span className="text-zinc-500 text-sm">Following</span>
              </div>
            </div>

            {!isOwnProfile && session?.user && (
              <button
                onClick={handleFollow}
                className={`mt-6 px-6 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
