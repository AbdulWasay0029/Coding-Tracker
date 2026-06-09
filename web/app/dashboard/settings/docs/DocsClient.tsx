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
                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#60A5FA] font-mono mb-1">/check</h3>
                                <p className="text-sm text-white/50">Trigger an instant background sync of your linked accounts to pull the latest solved problems.</p>
                            </div>

                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#60A5FA] font-mono mb-1">/leaderboard</h3>
                                <p className="text-sm text-white/50">Display the top 10 developers in the current Discord server based on problems solved in the last 7 days.</p>
                            </div>

                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#60A5FA] font-mono mb-1">/list-profiles</h3>
                                <p className="text-sm text-white/50">Provides a secure link to the Web Dashboard to view and manage all your currently connected coding platforms.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#F59E0B]" /> Profile Management
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#F59E0B] font-mono mb-1">/add-profile</h3>
                                <p className="text-sm text-white/50">Provides a secure link to the Web Dashboard where you can link a new coding platform to your CodeSync account.</p>
                            </div>

                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#F59E0B] font-mono mb-1">/update-profile</h3>
                                <p className="text-sm text-white/50">Provides a secure link to the Web Dashboard where you can update credentials for connected platforms.</p>
                            </div>

                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#F59E0B] font-mono mb-1">/remove-profile</h3>
                                <p className="text-sm text-white/50">Provides a secure link to the Web Dashboard where you can permanently disconnect coding platforms.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#10B981]" /> Admin Commands
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#10B981] font-mono mb-1">/setup</h3>
                                <p className="text-sm text-white/50">Initialize the server configuration. Allows you to set the daily announcement channel.</p>
                            </div>

                            <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                                <h3 className="text-sm font-bold text-[#10B981] font-mono mb-1">/export-report</h3>
                                <p className="text-sm text-white/50">Generate and download a CSV report containing problem-solving statistics for all users in the server over the last 7 days.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-[#A78BFA]" /> Supported Platforms
                        </h2>
                        <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                            <ul className="space-y-3 text-white/70 text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                                    <strong>LeetCode:</strong> Tracks total solved problems natively.
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                                    <strong>Codeforces:</strong> Tracks accepted submissions.
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                                    <strong>HackerRank:</strong> Tracks completed challenges.
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                                    <strong>CodeChef:</strong> Tracks fully solved problems.
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                                    <strong>SmartInterviews:</strong> Tracks syllabus progress (requires Auth Token).
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
