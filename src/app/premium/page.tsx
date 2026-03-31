'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function PremiumPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Welcome to DevHub Pro! 🎉')
    }
    if (searchParams.get('canceled') === 'true') {
      toast.error('Payment was canceled')
    }
  }, [searchParams])

  const handleUpgrade = async () => {
    if (!session?.user) {
      toast.error('Please sign in first')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe', { method: 'POST' })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Payment setup not configured')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto text-center">
        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium">
          PRO MEMBERSHIP
        </span>

        <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
          Unlock Your Full Potential
        </h1>
        <p className="mt-4 text-xl text-zinc-400 max-w-2xl mx-auto">
          Get verified, priority posting, exclusive content access, and more
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Verified Badge',
              desc: 'Get a verified checkmark on your profile',
              icon: '✓'
            },
            {
              title: 'Priority Posting',
              desc: 'Your posts get featured at the top',
              icon: '↑'
            },
            {
              title: 'Exclusive Content',
              desc: 'Access premium tutorials and resources',
              icon: '★'
            },
            {
              title: 'No Ads',
              desc: 'Enjoy an ad-free experience',
              icon: '✕'
            },
            {
              title: 'Advanced Analytics',
              desc: 'Track your post performance',
              icon: '📊'
            },
            {
              title: 'Early Access',
              desc: 'Try new features before anyone else',
              icon: '🚀'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <p className="text-4xl font-bold text-white">$9.99<span className="text-xl text-zinc-400">/month</span></p>
          
          {!session?.user ? (
            <div className="mt-6 space-y-4">
              <Link
                href="/register"
                className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Sign Up to Upgrade
              </Link>
              <p className="text-sm text-zinc-500">Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Sign in</Link></p>
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
