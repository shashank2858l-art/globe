import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';
import { prisma } from '@/lib/prisma';

async function getPosts() {
  const posts = await prisma.post.findMany({
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
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Latest Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                <p className="text-zinc-400">No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50">
              <h3 className="text-lg font-semibold text-white mb-4">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['react', 'nextjs', 'typescript', 'javascript', 'python', 'ai', 'css', 'api'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50">
              <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Posts</span>
                  <span className="text-white font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Active Users</span>
                  <span className="text-white font-medium">1,234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500">
          <p>DevHub - Connecting Developers Worldwide</p>
        </div>
      </footer>
    </main>
  );
}
