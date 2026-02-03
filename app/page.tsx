import { getDashboardData, updateWebhookUrl, addProfile, removeProfile } from './actions';
import { Trash2, ExternalLink, Activity, Settings, Plus, Save } from 'lucide-react';

export default async function Home() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CodeSync
            </h1>
            <p className="text-zinc-400 mt-2">
              Automated tracking for LeetCode, Codeforces, & CodeChef.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            <Activity size={16} />
            <span>System Active</span>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Discord Webhook Config */}
          <section className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Settings size={20} />
              </div>
              <h2 className="text-xl font-semibold">Configuration</h2>
            </div>

            <form action={updateWebhookUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Discord Webhook URL
                </label>
                <input
                  type="text"
                  name="webhookUrl"
                  defaultValue={data.webhookUrl}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save Configuration
              </button>
            </form>
          </section>

          {/* Add Profile Section */}
          <section className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                <Plus size={20} />
              </div>
              <h2 className="text-xl font-semibold">Add Profile</h2>
            </div>

            <form action={addProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Platform
                  </label>
                  <select
                    name="platform"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all appearance-none"
                  >
                    <option value="LEETCODE">LeetCode</option>
                    <option value="CODEFORCES">Codeforces</option>
                    <option value="CODECHEF">CodeChef</option>
                    <option value="SMARTINTERVIEWS">SmartInterviews</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="guper"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add to Watchlist
              </button>
            </form>
          </section>
        </div>

        {/* Profiles List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold px-2">Active Profiles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.profiles.map((profile) => (
              <div
                key={profile.id}
                className="group relative bg-zinc-900/30 border border-white/5 rounded-xl p-5 hover:border-purple-500/30 transition-all hover:bg-zinc-900/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">
                      {profile.platform}
                    </span>
                    <h3 className="text-lg font-medium text-zinc-200">
                      {profile.username}
                    </h3>
                  </div>
                  <form action={removeProfile.bind(null, profile.id)}>
                    <button className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            ))}

            {data.profiles.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                No profiles added yet. Add one above to start tracking.
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity (Optional) */}
        {data.recentSolved.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold px-2">Recent Catches</h2>
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden">
              {data.recentSolved.map((problem) => (
                <div key={problem.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium text-zinc-300">{problem.title}</p>
                      <p className="text-xs text-zinc-500 uppercase">{problem.platform}</p>
                    </div>
                  </div>
                  <span className="text-sm text-zinc-500">
                    {new Date(problem.solvedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
