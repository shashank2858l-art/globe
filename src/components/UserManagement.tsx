'use client'

import toast from 'react-hot-toast'

interface User {
  id: string
  name: string | null
  username: string
  email: string
  isVerified: boolean
  isPremium: boolean
  createdAt: Date
}

export default function UserManagement({ users }: { users: User[] }) {
  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !isVerified })
      })
      if (res.ok) {
        toast.success(isVerified ? 'User unverified' : 'User verified')
      }
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Users</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
            <div>
              <p className="text-white font-medium">{user.name || 'No name'}</p>
              <p className="text-zinc-500 text-sm">@{user.username}</p>
            </div>
            <div className="flex items-center gap-2">
              {user.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">Verified</span>
              )}
              {user.isPremium && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Pro</span>
              )}
              <button
                onClick={() => handleVerifyUser(user.id, user.isVerified)}
                className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
              >
                {user.isVerified ? 'Remove Verify' : 'Verify'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
