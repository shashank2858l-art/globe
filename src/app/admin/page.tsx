import { redirect } from 'next/navigation'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import AdminStats from '@/components/AdminStats'
import UserManagement from '@/components/UserManagement'
import PostManagement from '@/components/PostManagement'

async function getAdminData() {
  const [users, posts, comments] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.post.findMany({
      include: {
        author: {
          select: { name: true, username: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.comment.findMany({
      include: {
        author: {
          select: { name: true, username: true }
        },
        post: {
          select: { content: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])

  return { users, posts, comments }
}

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user || !(session.user as any).isVerified) {
    redirect('/')
  }

  const { users, posts, comments } = await getAdminData()

  return (
    <div className="min-h-screen pt-24 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        <AdminStats users={users.length} posts={posts.length} comments={comments.length} />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <UserManagement users={users} />
          <PostManagement posts={posts} />
        </div>
      </div>
    </div>
  )
}
