import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      
      <section className="relative py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Global Reach', desc: 'Connect with innovators from 150+ countries', icon: '🌍' },
              { title: 'Real-time Collaboration', desc: 'Work together seamlessly across time zones', icon: '⚡' },
              { title: 'AI-Powered', desc: 'Advanced tools powered by cutting-edge AI', icon: '🤖' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-colors duration-300"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
