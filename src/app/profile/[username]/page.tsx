import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileHeader from '@/components/ProfileHeader'
import PostCard from '@/components/PostCard'

async function getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              isVerified: true,
              isPremium: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      }
    }
  })
  return user
}

export default async function ProfilePage({
  params
}: {
  params: { username: string }
}) {
  const user = await getUser(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <ProfileHeader user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-white mb-6">Posts</h2>
        
        {user.posts.length > 0 ? (
          <div className="space-y-6">
            {user.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
            <p className="text-zinc-400">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
