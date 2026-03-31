'use client';

import { motion } from 'framer-motion';
import Globe from './Globe';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      <Globe />

      <div className="relative z-10 min-h-screen flex">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-sm text-blue-400 font-medium tracking-wide">
                    Global Innovation Network
                  </span>
                </span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span className="block text-white mb-2">Connecting</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Innovation
                </span>
                <span className="block text-white mt-2">Across the Globe</span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Join a worldwide community of visionaries, developers, and creators 
                building the future of technology. Experience seamless collaboration 
                across continents and time zones.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <button className="group relative px-8 py-4 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2 text-white font-semibold">
                    Get Started
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </button>

                <button className="group relative px-8 py-4 rounded-xl overflow-hidden border border-zinc-700 hover:border-blue-500/50 transition-colors duration-300">
                  <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2 text-white font-semibold">
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Watch Demo
                  </span>
                </button>
              </motion.div>

              <motion.div
                className="mt-16 flex items-center gap-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-blue-400 to-purple-500"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">50,000+</p>
                  <p className="text-sm text-zinc-500">Active Innovators</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-xs text-zinc-500 tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-zinc-600 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        </motion.div>
      </div>
    </section>
  );
}
