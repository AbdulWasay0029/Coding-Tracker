import { Terminal, Code2, Users, Settings } from 'lucide-react';

export default function DocsPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-16">
            <div className="mb-12 border-b border-border pb-8 animate-reveal stagger-1">
                <h1 className="text-4xl font-bold text-white tracking-tight">Documentation & Commands</h1>
                <p className="text-lg text-text-secondary mt-3">Learn how to use CodeSync to track and automate your community's coding progress.</p>
            </div>

            <div className="space-y-12 animate-reveal stagger-2">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-primary" /> Core Commands
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-primary font-mono mb-2">/check</h3>
                            <p className="text-text-secondary mb-4">Trigger an instant background sync of your linked accounts to pull the latest solved problems.</p>
                        </div>

                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-primary font-mono mb-2">/leaderboard</h3>
                            <p className="text-text-secondary mb-4">Display the top 10 developers in the current Discord server based on problems solved in the last 7 days.</p>
                        </div>

                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-primary font-mono mb-2">/list-profiles</h3>
                            <p className="text-text-secondary mb-4">View all your currently connected coding platforms.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-warning" /> Profile Management
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-warning font-mono mb-2">/add-profile</h3>
                            <p className="text-text-secondary mb-4">Link a new platform to your CodeSync account directly through Discord.</p>
                        </div>

                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-warning font-mono mb-2">/update-profile</h3>
                            <p className="text-text-secondary mb-4">Update the username or token for an existing connected platform.</p>
                        </div>

                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-warning font-mono mb-2">/remove-profile</h3>
                            <p className="text-text-secondary mb-4">Disconnect a coding platform from your account.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Settings className="w-6 h-6 text-secondary" /> Admin Commands
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-secondary font-mono mb-2">/setup</h3>
                            <p className="text-text-secondary mb-4">Initialize the server configuration. Allows you to set the daily announcement channel.</p>
                        </div>

                        <div className="bg-surface border border-border p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-secondary font-mono mb-2">/export-report</h3>
                            <p className="text-text-secondary mb-4">Generate and download a CSV report containing problem-solving statistics for all users in the server over the last 7 days.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-success" /> Supported Platforms
                    </h2>
                    <div className="bg-surface border border-border p-6 rounded-xl">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <strong>LeetCode:</strong> Tracks total solved problems natively.
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <strong>Codeforces:</strong> Tracks accepted submissions.
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <strong>HackerRank:</strong> Tracks completed challenges.
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <strong>CodeChef:</strong> Tracks fully solved problems.
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <strong>SmartInterviews:</strong> Tracks syllabus progress (requires Auth Token).
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    );
}
