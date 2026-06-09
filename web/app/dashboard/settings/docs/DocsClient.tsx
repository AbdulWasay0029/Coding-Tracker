import { Terminal, Code2, Users, Settings } from 'lucide-react';

export default function DocsClient() {
    return (
        <div className="space-y-6">
            <div className="glass-subtle rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Documentation & Commands</h1>
                <p className="text-sm text-white/50 mb-8">Learn how to use CodeSync to track and automate your community's coding progress.</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-[#60A5FA]" /> Core Commands
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl">
                                <h3 className="text-sm font-bold text-[#60A5FA] font-mono mb-1">/check</h3>
                                <p className="text-sm text-white/50">Trigger an instant background sync of your linked accounts to pull the latest solved problems.</p>
                            </div>

                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl">
                                <h3 className="text-sm font-bold text-[#60A5FA] font-mono mb-1">/leaderboard</h3>
                                <p className="text-sm text-white/50">Display the top 10 developers in the current Discord server based on problems solved in the last 7 days.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#10B981]" /> Admin Commands
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl">
                                <h3 className="text-sm font-bold text-[#10B981] font-mono mb-1">/setup</h3>
                                <p className="text-sm text-white/50">Initialize the server configuration. Allows you to set the daily announcement channel.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
