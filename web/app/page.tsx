import Link from 'next/link';
import { Terminal, Globe, Code2, Zap, ArrowRight, Activity, Users, Shield, Bot } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pt-8 md:pt-12 pb-16 relative gap-12 lg:gap-8">
                
                {/* Background glow effects */}
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary opacity-5 blur-[100px] rounded-full pointer-events-none" />

                <div className="space-y-8 relative z-10 lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-mono text-primary mb-2 shadow-[0_0_10px_rgba(0,240,255,0.1)] animate-reveal stagger-1">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        CodeSync Official
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-reveal stagger-2">
                        <span className="text-white">Automate your </span>
                        <br className="hidden lg:block" />
                        <span className="text-gradient-cyber">coding grind.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-text-secondary max-w-xl font-medium animate-reveal stagger-3">
                        The ultimate Discord bot to track, sync, and rank your coding progress across multiple platforms without lifting a finger.
                    </p>
                    
                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 animate-reveal stagger-4 w-full sm:w-auto">
                        <Link 
                            href="/api/auth/signin" 
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#0B0E14] bg-primary rounded hover:bg-transparent hover:text-primary border-2 border-primary btn-interactive shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
                        >
                            <Bot className="w-5 h-5 mr-2" />
                            Add to Discord
                        </Link>
                        <Link 
                            href="/leaderboard" 
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-surface rounded hover:bg-border border-2 border-border btn-interactive transition-all"
                        >
                            View Global Ranks
                        </Link>
                    </div>
                </div>

                {/* Hero Asset Placeholder */}
                <div className="lg:w-1/2 relative w-full aspect-video lg:aspect-square flex items-center justify-center animate-reveal stagger-5" style={{ perspective: '1200px' }}>
                    {/* Placeholder for the bot showcase screenshot the user will upload */}
                    <div 
                        className="relative w-full max-w-2xl aspect-[16/9] rounded-xl overflow-hidden border border-border shadow-[-30px_20px_60px_rgba(0,0,0,0.6)] bg-[#05070A] transition-all duration-700 hover:scale-[1.02]"
                        style={{ transform: 'rotateY(-20deg) rotateX(5deg) rotateZ(-1deg)' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            <Bot className="w-16 h-16 text-primary opacity-20" />
                            <p className="font-mono text-sm text-text-secondary uppercase tracking-widest">[ Bot Showcase Image ]</p>
                            <p className="text-xs text-text-secondary px-8 text-center">Replace this placeholder with `/public/bot-showcase.png`</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Proof Strip */}
            <div className="border-y border-border bg-[#05070A] py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-black text-white">5+</span>
                        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Platforms Synced</span>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-border"></div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-black text-white">100%</span>
                        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Automated Tracking</span>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-border"></div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-black text-white">24/7</span>
                        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Real-time Updates</span>
                    </div>
                </div>
            </div>

            {/* Core Features Grid */}
            <div className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 animate-reveal stagger-2">
                        <h2 className="text-4xl md:text-5xl font-black text-white">Built for the Community</h2>
                        <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">Everything a computer science club, bootcamp, or friend group needs to keep each other motivated.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-surface border border-border p-8 hover:border-primary transition-colors group animate-reveal stagger-3 flex flex-col items-start text-left">
                            <div className="p-3 bg-[#0B0E14] border border-border rounded mb-6 group-hover:border-primary transition-colors">
                                <Activity className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Zero-Friction Tracking</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Link your accounts once and you're done. CodeSync runs silently in the background, automatically fetching your solved problems every single day.
                            </p>
                        </div>
                        
                        <div className="bg-surface border border-border p-8 hover:border-secondary transition-colors group animate-reveal stagger-4 flex flex-col items-start text-left">
                            <div className="p-3 bg-[#0B0E14] border border-border rounded mb-6 group-hover:border-secondary transition-colors">
                                <Users className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Server Leaderboards</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Turn coding into a healthy competition. The leaderboard ranks members in your Discord server based on how many problems they solved in the last 7 days.
                            </p>
                        </div>
                        
                        <div className="bg-surface border border-border p-8 hover:border-primary transition-colors group animate-reveal stagger-5 flex flex-col items-start text-left">
                            <div className="p-3 bg-[#0B0E14] border border-border rounded mb-6 group-hover:border-primary transition-colors">
                                <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Multi-Platform Sync</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Why choose one platform? We natively support LeetCode, Codeforces, HackerRank, CodeChef, and SmartInterviews, aggregating them into a single profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-surface border-t border-border py-32">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16 animate-reveal stagger-2">
                        <h2 className="text-3xl md:text-4xl font-black text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="divide-y divide-border border-y border-border animate-reveal stagger-3">
                        <div className="py-6 flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-white">Do I need to manually update my stats?</h3>
                            <p className="text-text-secondary">No. Once your accounts are linked via the dashboard or bot commands, CodeSync automatically scrapes your progress multiple times a day.</p>
                        </div>
                        <div className="py-6 flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-white">Is it free to use?</h3>
                            <p className="text-text-secondary">Absolutely. CodeSync is built to support developer communities without any paywalls or hidden limits.</p>
                        </div>
                        <div className="py-6 flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-white">How do I add it to my server?</h3>
                            <p className="text-text-secondary">Simply click the "Add to Discord" button at the top, select your server, and authorize the bot. You can then use the `/set-channel` command to specify where daily leaderboards should be posted.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
            <div className="py-32 relative z-10 bg-[#05070A] border-t border-border text-center">
                <div className="max-w-3xl mx-auto px-4 flex flex-col items-center animate-reveal stagger-2">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to start tracking?</h2>
                    <p className="text-lg text-text-secondary mb-10">Join the competitive programming revolution and keep your server motivated.</p>
                    <Link 
                        href="/api/auth/signin" 
                        className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#0B0E14] bg-primary rounded hover:bg-transparent hover:text-primary border-2 border-primary btn-interactive shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all"
                    >
                        Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
