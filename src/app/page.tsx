import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';

const mockPosts = [
  {
    id: '1',
    content: 'Just released my new React library for handling forms! It supports validation, error handling, and async submissions out of the box. Check it out on GitHub!',
    codeSnippet: 'npm install @yourlib/react-form',
    tags: ['react', 'javascript', 'opensource'],
    isPremium: false,
    createdAt: new Date(Date.now() - 3600000),
    author: {
      id: '1',
      name: 'Sarah Chen',
      username: 'sarahchen',
      image: null,
      isVerified: true,
      isPremium: true
    },
    _count: {
      comments: 24,
      likes: 156
    }
  },
  {
    id: '2',
    content: 'Pro tip: Use React.memo() wisely. It only helps when your component re-renders frequently with the same props. Premature optimization is the root of all evil!',
    codeSnippet: null,
    tags: ['react', 'performance'],
    isPremium: false,
    createdAt: new Date(Date.now() - 7200000),
    author: {
      id: '2',
      name: 'Alex Developer',
      username: 'alexdev',
      image: null,
      isVerified: false,
      isPremium: false
    },
    _count: {
      comments: 12,
      likes: 89
    }
  },
  {
    id: '3',
    content: 'Built a real-time chat app using Next.js and WebSockets. The key is to properly manage connection states and handle reconnection gracefully.',
    codeSnippet: 'const socket = new WebSocket(url);\nsocket.onmessage = (event) => setMessages(prev => [...prev, JSON.parse(event.data)]);',
    tags: ['nextjs', 'websocket', 'realtime'],
    isPremium: true,
    createdAt: new Date(Date.now() - 10800000),
    author: {
      id: '3',
      name: 'Mike Johnson',
      username: 'mikejohnson',
      image: null,
      isVerified: true,
      isPremium: true
    },
    _count: {
      comments: 45,
      likes: 234
    }
  }
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Latest Posts</h2>
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
                  <span className="text-white font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Active Users</span>
                  <span className="text-white font-medium">5,678</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <h3 className="text-lg font-semibold text-white mb-2">Go Pro</h3>
              <p className="text-zinc-400 text-sm mb-4">Get verified badge, priority posting, and exclusive content!</p>
              <a href="/premium" className="block text-center py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity">
                Upgrade Now
              </a>
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
