import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | CodeSync',
    description: 'Terms and conditions for using the CodeSync platform.',
};

export default function TermsOfServicePage() {
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-screen">
            <div className="mb-12 animate-reveal">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]">Terms of Service</h1>
                <p className="text-lg text-white/50">Last updated: June 2026</p>
            </div>
            
            <div className="space-y-6 animate-reveal stagger-1">
                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">1. Acceptance of Terms</h2>
                    <p className="text-white/70 leading-relaxed">By inviting the CodeSync Discord Bot to your server, logging into the Web Dashboard, or utilizing our services in any way, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access the service.</p>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">2. Description of Service</h2>
                    <p className="text-white/70 leading-relaxed">CodeSync is an autonomous tracking engine designed to aggregate public competitive programming data (from platforms such as LeetCode, Codeforces, HackerRank, etc.) and present it within Discord communities and via a unified web dashboard. CodeSync is not affiliated with, endorsed by, or officially connected to any of these third-party platforms.</p>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">3. User Obligations</h2>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span>You must provide accurate usernames for the platforms you wish to track.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span>You agree not to abuse the <code className="text-[#60A5FA] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">/check</code> or <code className="text-[#60A5FA] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">/refresh</code> endpoints to intentionally spam external APIs or our database architecture.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span>You are responsible for the activity that occurs under your Discord account.</span>
                        </li>
                        <li className="flex gap-3 text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 flex-shrink-0 shadow-[0_0_10px_#60A5FA]" />
                            <span>Server Administrators are responsible for managing the permissions of the CodeSync bot within their own Discord servers.</span>
                        </li>
                    </ul>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">4. Fair Use & Rate Limiting</h2>
                    <p className="text-white/70 leading-relaxed">To ensure the stability of CodeSync and respect the APIs of external platforms, we employ strict rate limiting and automated scraping delays. We reserve the right to temporarily suspend or permanently ban accounts or servers that engage in malicious traffic patterns, automated scraping of our dashboard, or attempts to circumvent API limits.</p>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">5. Disclaimer of Warranties</h2>
                    <p className="text-white/70 leading-relaxed">CodeSync is provided "as is" and "as available" without any warranties of any kind. Because our service relies heavily on the undocumented APIs of third-party platforms, we cannot guarantee 100% uptime or uninterrupted data syncing. If LeetCode changes their website structure, CodeSync may experience temporary outages while our scraping engines are updated.</p>
                </section>

                <section className="glass-subtle rounded-2xl p-8 hover:border-white/10 transition-colors">
                    <h2 className="text-2xl font-bold text-white/90 mb-4">6. Changes to Terms</h2>
                    <p className="text-white/70">We reserve the right to modify or replace these Terms at any time. Significant changes will be announced in our <a href="https://discord.gg/qfhKfnJCau" target="_blank" rel="noopener noreferrer" className="text-[#60A5FA] font-semibold hover:text-[#3B82F6] hover:underline transition-colors">official Discord community</a>.</p>
                </section>
            </div>
        </main>
    );
}
