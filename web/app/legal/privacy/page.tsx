import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | CodeSync',
    description: 'How CodeSync handles your data and protects your privacy.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-screen">
            <div className="mb-12 animate-reveal">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]">Privacy Policy</h1>
                <p className="text-lg text-white/50">Last updated: June 2026</p>
            </div>
            
            <div className="space-y-6 animate-reveal stagger-1">
                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">1. What Data We Collect</h2>
                    <p className="text-white/70 mb-4 leading-relaxed">CodeSync is built to be as minimally invasive as possible. When you authorize our Discord application or sign into the dashboard, we collect:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span><strong className="text-white/90">Discord User ID and Username:</strong> To uniquely identify you and associate your coding profiles.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span><strong className="text-white/90">Guilds (Servers):</strong> We briefly read your servers during login to verify Admin permissions, but we do not permanently store your social graph.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span><strong className="text-white/90">Coding Usernames:</strong> Any LeetCode, Codeforces, CodeChef, or HackerRank usernames you manually provide to us.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span><strong className="text-white/90">Authentication Tokens:</strong> For internal platforms (like SmartInterviews), we store tokens utilizing AES-256 military-grade encryption.</span>
                        </li>
                    </ul>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">2. How We Use Your Data</h2>
                    <p className="text-white/70 mb-4 leading-relaxed">The core function of CodeSync is data aggregation. We use your data exclusively to:</p>
                    <ul className="space-y-3 mb-6">
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span>Scrape public problem-solving data from your registered platforms.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span>Generate leaderboards and statistics within the Discord servers you share with the bot.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span>Display your personal progress on the Web Dashboard.</span>
                        </li>
                    </ul>
                    <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 inline-block">
                        <p className="font-bold text-[#10B981] tracking-wide">We will never sell your data to third parties, recruiters, or data brokers.</p>
                    </div>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">3. Data Retention and Deletion</h2>
                    <p className="text-white/70 mb-4 leading-relaxed">You own your data. If you wish to leave the platform, you can delete your profile via the Web Dashboard. Upon deletion:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-2 flex-shrink-0 shadow-[0_0_10px_#EF4444]" />
                            <span>Your Discord link and platform usernames are instantly removed from our active databases.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-2 flex-shrink-0 shadow-[0_0_10px_#EF4444]" />
                            <span>Your historical solved problems are permanently purged.</span>
                        </li>
                    </ul>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">4. Third-Party APIs</h2>
                    <p className="text-white/70 leading-relaxed">CodeSync interacts with external platforms (LeetCode, Codeforces, etc.). By using CodeSync, you acknowledge that your public data from these platforms is being accessed and aggregated in accordance with their respective public API policies.</p>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-white/90 mb-4">Contact Us</h2>
                    <p className="text-white/70">If you have any questions about this Privacy Policy, please contact us via our <a href="https://discord.gg/qfhKfnJCau" target="_blank" rel="noopener noreferrer" className="text-[#60A5FA] font-semibold hover:text-[#3B82F6] hover:underline transition-colors">official Discord community</a>.</p>
                </section>
            </div>
        </main>
    );
}
