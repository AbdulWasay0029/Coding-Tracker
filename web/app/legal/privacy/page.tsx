import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | CodeSync',
    description: 'How CodeSync handles your data and protects your privacy.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8 tracking-tight">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none text-text-secondary">
                <p className="text-lg mb-8">Last updated: June 2026</p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">1. What Data We Collect</h2>
                    <p className="mb-4">CodeSync is built to be as minimally invasive as possible. When you authorize our Discord application or sign into the dashboard, we collect:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Discord User ID and Username:</strong> To uniquely identify you and associate your coding profiles.</li>
                        <li><strong>Guilds (Servers):</strong> We briefly read your servers during login to verify Admin permissions, but we do not permanently store your social graph.</li>
                        <li><strong>Coding Usernames:</strong> Any LeetCode, Codeforces, CodeChef, or HackerRank usernames you manually provide to us.</li>
                        <li><strong>Authentication Tokens:</strong> For internal platforms (like SmartInterviews), we store tokens utilizing AES-256 military-grade encryption.</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
                    <p className="mb-4">The core function of CodeSync is data aggregation. We use your data exclusively to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Scrape public problem-solving data from your registered platforms.</li>
                        <li>Generate leaderboards and statistics within the Discord servers you share with the bot.</li>
                        <li>Display your personal progress on the Web Dashboard.</li>
                    </ul>
                    <p className="font-bold text-primary">We will never sell your data to third parties, recruiters, or data brokers.</p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">3. Data Retention and Deletion</h2>
                    <p className="mb-4">You own your data. If you wish to leave the platform, you can delete your profile via the Web Dashboard or by using the `/delete-profile` command in Discord. Upon deletion:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Your Discord link and platform usernames are instantly removed from our active databases.</li>
                        <li>Your historical solved problems are permanently purged.</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party APIs</h2>
                    <p className="mb-4">CodeSync interacts with external platforms (LeetCode, Codeforces, etc.). By using CodeSync, you acknowledge that your public data from these platforms is being accessed and aggregated in accordance with their respective public API policies.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us via our <a href="https://discord.gg/qfhKfnJCau" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">official Discord community</a>.</p>
                </section>
            </div>
        </main>
    );
}
