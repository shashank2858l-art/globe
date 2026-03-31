export default function AdminStats({
  users,
  posts,
  comments
}: {
  users: number
  posts: number
  comments: number
}) {
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50">
        <p className="text-zinc-400 text-sm">Total Users</p>
        <p className="text-3xl font-bold text-white mt-2">{users}</p>
      </div>
      <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50">
        <p className="text-zinc-400 text-sm">Total Posts</p>
        <p className="text-3xl font-bold text-white mt-2">{posts}</p>
      </div>
      <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 border border-zinc-800/50">
        <p className="text-zinc-400 text-sm">Total Comments</p>
        <p className="text-3xl font-bold text-white mt-2">{comments}</p>
      </div>
    </div>
  )
}
