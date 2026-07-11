'use client';

import Link from 'next/link';
import { ArrowRight, Bot, Code2, Globe, Terminal, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    return (
        <main className="min-h-screen flex flex-col bg-[#05070A] overflow-x-hidden font-sans">
            
            {/* Background Orbs (Glassmorphism Base) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-[#3B82F6] opacity-[0.08] blur-[150px] rounded-full" />
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[#10B981] opacity-[0.06] blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[50%] bg-[#A78BFA] opacity-[0.05] blur-[100px] rounded-full" />
            </div>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px] w-full mx-auto pt-16 md:pt-24 pb-16 relative z-10 gap-16 lg:gap-8">
                
                {/* Hero Text */}
                <div className="space-y-8 lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 text-sm font-medium text-[#60A5FA] mb-2 shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-reveal stagger-1">
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse shadow-[0_0_8px_#3B82F6]" />
                        CodeSync v2.0 Live
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.05] animate-reveal stagger-2">
                        <span className="text-white">Your Unified </span>
                        <br className="hidden lg:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]">Coding Profile.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/70 max-w-xl font-normal animate-reveal stagger-3">
                        Track, sync, and showcase your problem-solving progress across LeetCode, Codeforces, HackerRank, and more in one premium, gamified dashboard.
                    </p>
                    
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 animate-reveal stagger-4 w-full sm:w-auto">
                        {!session ? (
                            <button 
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                            >
                                Login with Discord <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <Link 
                                href="/dashboard" 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                            >
                                Go to Dashboard <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                        <a 
                            href="https://discord.com/oauth2/authorize?client_id=1478104744391344359&permissions=8&integration_type=0&scope=bot+applications.commands" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 hover:border-[#60A5FA]/30 hover:shadow-[0_4px_16px_-4px_rgba(96,165,250,0.2)] transition-all duration-300 text-[#D1D5DB] font-medium text-lg"
                        >
                            <Bot className="w-5 h-5" />
                            Add Bot
                        </a>
                    </div>
                </div>

                {/* Floating Mockup (Right Side) */}
                <div className="lg:w-1/2 relative w-full aspect-[4/3] flex items-center justify-center animate-reveal stagger-5 z-10" style={{ perspective: '3000px' }}>
                    <div 
                        className="relative w-full max-w-[700px] h-full rounded-2xl overflow-hidden border border-white/10 bg-[#0B0E14]/80 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(59,130,246,0.3)] transition-all duration-700 ease-out hover:rotate-0 hover:scale-[1.01]"
                        style={{ transform: 'rotateY(-6deg) rotateX(3deg) rotateZ(0deg)' }}
                    >
                        {/* Fake Browser Bar */}
                        <div className="h-10 w-full bg-[#1A1D24]/80 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                            </div>
                            <div className="mx-auto bg-black/30 w-1/2 h-6 rounded-md border border-white/5 flex items-center px-3">
                                <span className="text-[10px] text-white/30 font-mono">codesync.app/dashboard</span>
                            </div>
                        </div>
                        <div className="relative w-full h-[calc(100%-40px)] overflow-hidden bg-[#05070A]">
                            <Image 
                                src="/hero-mockup.png" 
                                alt="CodeSync Dashboard Mockup" 
                                fill
                                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform & Social Proof Strip */}
            <div className="border-y border-white/5 bg-[#0B0E14]/50 backdrop-blur-md relative z-10">
                <div className="max-w-[1440px] mx-auto px-4 py-8 flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-3">
                        <Code2 className="w-8 h-8" /> <span className="text-xl font-bold font-mono">LeetCode</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Terminal className="w-8 h-8" /> <span className="text-xl font-bold font-mono">Codeforces</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe className="w-8 h-8" /> <span className="text-xl font-bold font-mono">HackerRank</span>
                    </div>
                </div>
            </div>

            <div className="py-12 relative z-10 bg-[#05070A]/80 backdrop-blur-sm border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">5+</span>
                        <span className="text-xs font-mono text-[#60A5FA] uppercase tracking-widest">Platforms Synced</span>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-white/10"></div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">100%</span>
                        <span className="text-xs font-mono text-[#10B981] uppercase tracking-widest">Automated Tracking</span>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-white/10"></div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">24/7</span>
                        <span className="text-xs font-mono text-[#A78BFA] uppercase tracking-widest">Real-time Updates</span>
                    </div>
                </div>
            </div>

            {/* Core Features Grid */}
            <div id="features" className="py-32 relative z-10 bg-[#05070A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 animate-reveal stagger-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-white/95">Built for the Community</h2>
                        <p className="mt-6 text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">Everything a computer science club, bootcamp, or friend group needs to keep each other motivated and accountable.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="glass-subtle p-8 rounded-2xl hover:border-[#60A5FA]/30 hover:shadow-[0_8px_32px_-8px_rgba(96,165,250,0.2)] transition-all duration-300 group animate-reveal stagger-3 flex flex-col items-start text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#60A5FA] opacity-0 group-hover:opacity-10 blur-[50px] rounded-full transition-opacity duration-500" />
                            <div className="p-4 bg-[#1A1D24] border border-white/5 rounded-xl mb-6 group-hover:border-[#60A5FA]/30 transition-colors shadow-lg">
                                <Terminal className="w-7 h-7 text-[#60A5FA]" />
                            </div>
                            <h3 className="text-xl font-bold text-white/95 mb-4 tracking-tight group-hover:text-[#60A5FA] transition-colors">Zero-Friction Tracking</h3>
                            <p className="text-white/50 leading-relaxed text-sm md:text-base">
                                Link your accounts once and you're done. CodeSync runs silently in the background, automatically fetching your solved problems every single day.
                            </p>
                        </div>
                        
                        <div className="glass-subtle p-8 rounded-2xl hover:border-[#10B981]/30 hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.2)] transition-all duration-300 group animate-reveal stagger-4 flex flex-col items-start text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-0 group-hover:opacity-10 blur-[50px] rounded-full transition-opacity duration-500" />
                            <div className="p-4 bg-[#1A1D24] border border-white/5 rounded-xl mb-6 group-hover:border-[#10B981]/30 transition-colors shadow-lg">
                                <Code2 className="w-7 h-7 text-[#10B981]" />
                            </div>
                            <h3 className="text-xl font-bold text-white/95 mb-4 tracking-tight group-hover:text-[#10B981] transition-colors">Server Leaderboards</h3>
                            <p className="text-white/50 leading-relaxed text-sm md:text-base">
                                Turn coding into a healthy competition. The leaderboard ranks members in your Discord server based on how many problems they solved this week.
                            </p>
                        </div>
                        
                        <div className="glass-subtle p-8 rounded-2xl hover:border-[#A78BFA]/30 hover:shadow-[0_8px_32px_-8px_rgba(167,139,250,0.2)] transition-all duration-300 group animate-reveal stagger-5 flex flex-col items-start text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A78BFA] opacity-0 group-hover:opacity-10 blur-[50px] rounded-full transition-opacity duration-500" />
                            <div className="p-4 bg-[#1A1D24] border border-white/5 rounded-xl mb-6 group-hover:border-[#A78BFA]/30 transition-colors shadow-lg">
                                <Globe className="w-7 h-7 text-[#A78BFA]" />
                            </div>
                            <h3 className="text-xl font-bold text-white/95 mb-4 tracking-tight group-hover:text-[#A78BFA] transition-colors">Multi-Platform Sync</h3>
                            <p className="text-white/50 leading-relaxed text-sm md:text-base">
                                Why choose one platform? We natively support LeetCode, Codeforces, HackerRank, CodeChef, and SmartInterviews, aggregating them into a single profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* FAQ Section */}
            <div id="community" className="bg-[#05070A] py-32 border-t border-white/5 relative z-10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16 animate-reveal stagger-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white/95">Community FAQ</h2>
                    </div>
                    <div className="divide-y divide-white/10 border-y border-white/10 animate-reveal stagger-3">
                        <div className="py-8 flex flex-col gap-3 group">
                            <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">Do I need to manually update my stats?</h3>
                            <p className="text-white/50 leading-relaxed">No. Once your accounts are linked via the dashboard or bot commands, CodeSync automatically scrapes your progress multiple times a day.</p>
                        </div>
                        <div className="py-8 flex flex-col gap-3 group">
                            <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">Is it free to use?</h3>
                            <p className="text-white/50 leading-relaxed">Absolutely. CodeSync is built to support developer communities without any paywalls or hidden limits.</p>
                        </div>
                        <div className="py-8 flex flex-col gap-3 group">
                            <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">How do I add it to my server?</h3>
                            <p className="text-white/50 leading-relaxed">Simply click the "Add Bot" button at the top, select your server, and authorize the bot. You can then use the <code className="text-[#60A5FA] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded font-mono text-sm">/set-channel</code> command to specify where daily leaderboards should be posted.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-32 relative z-10 bg-[#0B0E14] border-t border-white/5 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-[#3B82F6] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />
                
                <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center animate-reveal relative z-10">
                    <div className="glass-strong border border-white/10 rounded-3xl p-10 md:p-14 w-full flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to boost your <span className="text-[#8B5CF6]">coding journey?</span>
                        </h2>
                        <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                            Join the competitive programming revolution and keep your server motivated.
                        </p>
                        
                        <button 
                            onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-bold text-[15px] mb-8 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                        >
                            Get Started for Free <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-white/50">
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Free forever</div>
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> No limits</div>
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Setup in 2 minutes</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </main>
    );
}
