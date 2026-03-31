import PostCard from '@/components/PostCard';

const mockPosts = [
  {
    id: '4',
    content: 'Building a REST API with Next.js 14 is incredibly powerful. The new server actions make form handling so much easier! Here is a quick example of how to handle form submissions.',
    codeSnippet: 'async function submitForm(formData: FormData) {\n  "use server"\n  const data = Object.fromEntries(formData)\n  await db.insert(posts).values(data)\n}',
    tags: ['nextjs', 'api', 'typescript'],
    isPremium: false,
    createdAt: new Date(Date.now() - 1800000),
    author: {
      id: '4',
      name: 'Emma Wilson',
      username: 'emmawilson',
      image: null,
      isVerified: true,
      isPremium: false
    },
    _count: {
      comments: 18,
      likes: 112
    }
  },
  {
    id: '5',
    content: 'CSS Grid is amazing for complex layouts. I created a responsive dashboard using only CSS Grid and it works perfectly on all screen sizes!',
    codeSnippet: '.dashboard {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n}',
    tags: ['css', 'frontend', 'responsive'],
    isPremium: false,
    createdAt: new Date(Date.now() - 5400000),
    author: {
      id: '5',
      name: 'David Park',
      username: 'davidpark',
      image: null,
      isVerified: false,
      isPremium: false
    },
    _count: {
      comments: 8,
      likes: 67
    }
  },
  {
    id: '6',
    content: 'Just learned about the new use() hook in React. It allows you to read promises and context values directly in render. Game changer for data fetching!',
    codeSnippet: 'function Comments({ commentsPromise }) {\n  const comments = use(commentsPromise);\n  return comments.map(c => <Comment key={c.id} {...c} />);\n}',
    tags: ['react', 'hooks', 'javascript'],
    isPremium: true,
    createdAt: new Date(Date.now() - 9000000),
    author: {
      id: '6',
      name: 'Lisa Anderson',
      username: 'lisaand',
      image: null,
      isVerified: true,
      isPremium: true
    },
    _count: {
      comments: 32,
      likes: 198
    }
  },
  {
    id: '7',
    content: 'TypeScript 5.0 brought us const type parameters. Now you can enforce literal types in generic functions without extra type assertions!',
    codeSnippet: 'function asConst<T extends string>(value: T): T {\n  return value as const;\n}',
    tags: ['typescript', 'programming'],
    isPremium: false,
    createdAt: new Date(Date.now() - 14400000),
    author: {
      id: '7',
      name: 'Chris Taylor',
      username: 'christaylor',
      image: null,
      isVerified: false,
      isPremium: false
    },
    _count: {
      comments: 15,
      likes: 145
    }
  }
];

const trendingTags = ['react', 'nextjs', 'typescript', 'javascript', 'python', 'ai', 'css', 'api', 'nodejs', 'git'];

export default function ExplorePage() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Explore</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <a
                    key={tag}
                    href="#"
                    className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold text-white">Recent Posts</h2>
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
