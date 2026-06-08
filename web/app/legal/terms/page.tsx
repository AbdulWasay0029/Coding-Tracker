import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | CodeSync',
    description: 'Terms and conditions for using the CodeSync platform.',
};

export default function TermsOfServicePage() {
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8 tracking-tight">Terms of Service</h1>
            
            <div className="prose prose-invert max-w-none text-text-secondary">
                <p className="text-lg mb-8">Last updated: June 2026</p>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">By inviting the CodeSync Discord Bot to your server, logging into the Web Dashboard, or utilizing our services in any way, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access the service.</p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                    <p className="mb-4">CodeSync is an autonomous tracking engine designed to aggregate public competitive programming data (from platforms such as LeetCode, Codeforces, HackerRank, etc.) and present it within Discord communities and via a unified web dashboard. CodeSync is not affiliated with, endorsed by, or officially connected to any of these third-party platforms.</p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">3. User Obligations</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>You must provide accurate usernames for the platforms you wish to track.</li>
                        <li>You agree not to abuse the `/check` or `/refresh` endpoints to intentionally spam external APIs or our database architecture.</li>
                        <li>You are responsible for the activity that occurs under your Discord account.</li>
                        <li>Server Administrators are responsible for managing the permissions of the CodeSync bot within their own Discord servers.</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">4. Fair Use & Rate Limiting</h2>
                    <p className="mb-4">To ensure the stability of CodeSync and respect the APIs of external platforms, we employ strict rate limiting and automated scraping delays. We reserve the right to temporarily suspend or permanently ban accounts or servers that engage in malicious traffic patterns, automated scraping of our dashboard, or attempts to circumvent API limits.</p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
                    <p className="mb-4">CodeSync is provided "as is" and "as available" without any warranties of any kind. Because our service relies heavily on the undocumented APIs of third-party platforms, we cannot guarantee 100% uptime or uninterrupted data syncing. If LeetCode changes their website structure, CodeSync may experience temporary outages while our scraping engines are updated.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Changes to Terms</h2>
                    <p>We reserve the right to modify or replace these Terms at any time. Significant changes will be announced in our official Discord community.</p>
                </section>
            </div>
        </main>
    );
}
