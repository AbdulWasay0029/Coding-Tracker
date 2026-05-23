import Link from 'next/link';
import { Terminal, Globe, Code2, Zap } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto pt-20 pb-16 relative">
                
                {/* Background glow effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary opacity-5 blur-[100px] rounded-full pointer-events-none" />

                <div className="space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-mono text-primary mb-4 shadow-[0_0_10px_rgba(0,240,255,0.1)] animate-reveal stagger-1">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        CodeSync v4.0 Online
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter animate-reveal stagger-2">
                        <span className="text-white">Track Your </span>
                        <span className="text-gradient-cyber">Grind.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto font-medium animate-reveal stagger-3">
                        The ultimate centralized dashboard for your coding progress. Sync LeetCode, Codeforces, CodeChef, and HackerRank instantly.
                    </p>
                    
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 animate-reveal stagger-4">
                        <Link 
                            href="/api/auth/signin" 
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#0B0E14] bg-primary rounded hover:bg-transparent hover:text-primary border-2 border-primary btn-interactive shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
                        >
                            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                            </svg>
                            Connect with Discord
                        </Link>
                        <Link 
                            href="/leaderboard" 
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-text-primary bg-surface rounded hover:bg-border border-2 border-border btn-interactive"
                        >
                            View Leaderboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Terminal Mockup */}
            <div className="max-w-4xl mx-auto w-full px-4 relative z-10 -mt-8 mb-24 animate-reveal stagger-5">
                <div className="rounded-xl border border-border bg-[#05070A] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center px-4 py-3 border-b border-border bg-surface">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-danger"></div>
                            <div className="w-3 h-3 rounded-full bg-warning"></div>
                            <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        </div>
                        <div className="mx-auto text-xs font-mono text-text-secondary">~/codesync/tracker</div>
                    </div>
                    <div className="p-6 font-mono text-sm leading-relaxed">
                        <div className="text-secondary">$ codesync fetch --all</div>
                        <div className="text-text-secondary mt-1">Fetching latest submissions from connected platforms...</div>
                        <div className="text-primary mt-2">✓ LeetCode: 3 new problems solved</div>
                        <div className="text-primary">✓ Codeforces: 1 new problem solved</div>
                        <div className="text-primary">✓ SmartInterviews: 2 new problems solved</div>
                        <div className="text-secondary mt-4">$ codesync rank --update</div>
                        <div className="text-text-primary mt-1">Global Leaderboard updated! You moved up 2 spots to Rank #4! 🏆</div>
                        <div className="mt-4 flex items-center gap-2 text-text-secondary">
                            <span className="w-2 h-5 bg-primary animate-pulse inline-block"></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-surface border-t border-border py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-reveal stagger-2">
                        <h2 className="text-3xl font-black text-white">Built for the Grind</h2>
                        <p className="mt-4 text-text-secondary">Everything you need to track your competitive programming journey.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="classic-card p-8 hover:border-primary transition-colors animate-reveal stagger-3">
                            <Globe className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Global Leaderboards</h3>
                            <p className="text-text-secondary">Compete with your peers across the entire server. Ranks are calculated instantly based on your rolling 7-day performance.</p>
                        </div>
                        
                        <div className="classic-card p-8 hover:border-secondary transition-colors animate-reveal stagger-4">
                            <Zap className="w-10 h-10 text-secondary mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">100% Automated</h3>
                            <p className="text-text-secondary">Powered by dynamic scrapers and external crons. Your stats are tracked seamlessly in the background while you focus on coding.</p>
                        </div>
                        
                        <div className="classic-card p-8 hover:border-primary transition-colors animate-reveal stagger-5">
                            <Code2 className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Multi-Platform</h3>
                            <p className="text-text-secondary">Connect LeetCode, Codeforces, HackerRank, CodeChef, and SmartInterviews. One unified dashboard for all your profiles.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="border-t border-border bg-[#05070A] py-12 text-center text-text-secondary font-mono text-sm">
                <p>Designed for developers. Synchronized seamlessly with Discord.</p>
                <p className="mt-2 text-primary">CodeSync v4.0</p>
            </footer>
        </main>
    );
}
