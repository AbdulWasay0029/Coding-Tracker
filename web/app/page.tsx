'use client';

import Link from 'next/link';
import { ArrowRight, Bot, RefreshCw, BarChart2, Trophy, CheckCircle2, ChevronRight, ChevronLeft, Github, Twitter, Disc } from 'lucide-react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    return (
        <main className="min-h-screen flex flex-col bg-[#05070A] overflow-x-hidden font-sans">
            
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-[1440px] w-full mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                    
                    {/* Hero Text (Left) */}
                    <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1D24] border border-[#2A2E37] text-xs font-medium text-[#8B9BB4] mb-8 animate-reveal">
                            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                            CodeSync v2.0 is live
                        </div>
                        
                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.1] mb-6 animate-reveal stagger-1">
                            <span className="text-white">Your Unified </span>
                            <br className="hidden lg:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A78BFA] to-[#60A5FA]">Coding Profile.</span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-[#8B9BB4] text-lg max-w-[500px] leading-relaxed mb-10 animate-reveal stagger-2">
                            Track, sync, and showcase your problem solving progress across LeetCode, Codeforces, HackerRank, and more in one premium, gamified dashboard.
                        </p>
                        
                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-reveal stagger-3 w-full sm:w-auto">
                            {!session ? (
                                <button 
                                    onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium text-[15px]"
                                >
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <Link 
                                    href="/dashboard" 
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium text-[15px]"
                                >
                                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                            <a 
                                href="https://discord.com/oauth2/authorize?client_id=1478104744391344359&permissions=8&integration_type=0&scope=bot+applications.commands" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-[#2A2E37] hover:bg-[#1A1D24] hover:border-[#3A3F4A] transition-colors text-[#D1D5DB] font-medium text-[15px]"
                            >
                                <Bot className="w-4 h-4" />
                                Add Bot
                            </a>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-12 gap-y-6 animate-reveal stagger-4">
                            <div className="flex items-center gap-3">
                                <div className="text-[#60A5FA]">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-white font-bold text-lg leading-none mb-1">150K+</span>
                                    <span className="text-[#8B9BB4] text-xs">Developers</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[#60A5FA]">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-white font-bold text-lg leading-none mb-1">10+</span>
                                    <span className="text-[#8B9BB4] text-xs">Platforms</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[#F59E0B]">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-white font-bold text-lg leading-none mb-1">1M+</span>
                                    <span className="text-[#8B9BB4] text-xs">Problems Solved</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[#60A5FA]">
                                    <RefreshCw className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-white font-bold text-lg leading-none mb-1">Real-time</span>
                                    <span className="text-[#8B9BB4] text-xs">Sync</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Mockup (Right) */}
                    <div className="flex-1 relative w-full lg:w-1/2 flex justify-center lg:justify-end animate-reveal stagger-5">
                        <div className="relative w-full max-w-[800px] aspect-[4/3] transform transition-transform duration-700 hover:scale-[1.02]">
                            {/* Decorative Background Lines */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none rounded-2xl z-0"></div>
                            
                            <Image 
                                src="/hero-mockup.png" 
                                alt="CodeSync Dashboard" 
                                fill
                                className="object-cover rounded-2xl shadow-2xl z-10"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By Section */}
            <div className="border-t border-[#1A1D24] py-12 bg-[#05070A]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[11px] font-bold tracking-[0.2em] text-[#8B9BB4] uppercase mb-8">Trusted By Developers From</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60">
                        {/* Text logos substituting for SVGs to match the aesthetic */}
                        <div className="text-xl font-bold font-sans tracking-tight text-white">Google</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white grid grid-cols-2 gap-[1px] p-[1px]"><div className="bg-[#05070A]"></div><div className="bg-[#05070A]"></div><div className="bg-[#05070A]"></div><div className="bg-[#05070A]"></div></div><span className="text-xl font-semibold font-sans text-white">Microsoft</span></div>
                        <div className="text-xl font-bold font-sans tracking-tight text-white">amazon</div>
                        <div className="text-xl font-bold font-sans text-white flex items-center gap-1"><span className="text-red-500 font-serif font-black">A</span> Adobe</div>
                        <div className="text-xl font-black font-sans tracking-tighter text-red-600">NETFLIX</div>
                        <div className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-1"><div className="w-5 h-5 rounded-full bg-[#1DB954]"></div>Spotify</div>
                        <div className="text-xl font-bold font-sans tracking-tight text-[#FF5A5F]">airbnb</div>
                    </div>
                </div>
            </div>

            {/* Powerful Features Section */}
            <div className="py-24 bg-[#0B0E14]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16 animate-reveal">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1A1D24] border border-[#2A2E37] text-[11px] font-bold tracking-[0.1em] text-[#60A5FA] uppercase mb-6">
                            Powerful Features
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to level up</h2>
                        <p className="text-[#8B9BB4] text-lg">All-in-one platform to track, analyze, and improve your coding journey.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-reveal stagger-2">
                        {/* Feature 1 */}
                        <div className="bg-[#111318] border border-[#1A1D24] p-8 rounded-2xl hover:border-[#2A2E37] transition-colors flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-6">
                                <RefreshCw className="w-6 h-6 text-[#60A5FA]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Real-time Sync</h3>
                            <p className="text-[#8B9BB4] leading-relaxed mb-6 flex-1">
                                Automatically sync your progress from multiple platforms in real-time.
                            </p>
                            <Link href="/features" className="text-[#60A5FA] font-medium text-sm flex items-center gap-1 hover:text-[#93C5FD] transition-colors">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-[#111318] border border-[#1A1D24] p-8 rounded-2xl hover:border-[#2A2E37] transition-colors flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-6">
                                <BarChart2 className="w-6 h-6 text-[#A78BFA]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Advanced Analytics</h3>
                            <p className="text-[#8B9BB4] leading-relaxed mb-6 flex-1">
                                Deep insights into your performance, trends, and problem-solving skills.
                            </p>
                            <Link href="/features" className="text-[#A78BFA] font-medium text-sm flex items-center gap-1 hover:text-[#C4B5FD] transition-colors">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-[#111318] border border-[#1A1D24] p-8 rounded-2xl hover:border-[#2A2E37] transition-colors flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-6">
                                <Trophy className="w-6 h-6 text-[#34D399]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Leaderboards</h3>
                            <p className="text-[#8B9BB4] leading-relaxed mb-6 flex-1">
                                Compete with developers worldwide and climb the global rankings.
                            </p>
                            <Link href="/features" className="text-[#34D399] font-medium text-sm flex items-center gap-1 hover:text-[#6EE7B7] transition-colors">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-[#111318] border border-[#1A1D24] p-8 rounded-2xl hover:border-[#2A2E37] transition-colors flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mb-6">
                                <Bot className="w-6 h-6 text-[#FBBF24]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Smart Bots</h3>
                            <p className="text-[#8B9BB4] leading-relaxed mb-6 flex-1">
                                Add our bot to your server and get instant updates and notifications.
                            </p>
                            <Link href="/features" className="text-[#FBBF24] font-medium text-sm flex items-center gap-1 hover:text-[#FCD34D] transition-colors">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA & Testimonial Section */}
            <div className="py-24 bg-[#05070A] border-t border-[#1A1D24]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-reveal">
                        
                        {/* Testimonial Card */}
                        <div className="bg-[#111318] border border-[#1A1D24] rounded-2xl p-10 flex flex-col justify-between">
                            <div>
                                <span className="text-[#2563EB] text-6xl font-serif leading-none">"</span>
                                <p className="text-xl text-white font-medium leading-relaxed mt-2">
                                    CodeSync <span className="italic text-[#8B9BB4]">changed the way I track my progress.</span> The analytics and insights help me focus on what matters most.
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#2A2E37] rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                                        {/* Fallback to generic avatar if image fails */}
                                        AS
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Arjun Sharma</h4>
                                        <p className="text-[#8B9BB4] text-sm">SDE at Google</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-[#1A1D24] border border-[#2A2E37] flex items-center justify-center text-[#8B9BB4] hover:text-white transition-colors">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-[#1A1D24] border border-[#2A2E37] flex items-center justify-center text-[#8B9BB4] hover:text-white transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-[#111318] border border-[#1A1D24] rounded-2xl p-10 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Ready to boost <br />
                                your <span className="text-[#8B5CF6]">coding journey?</span>
                            </h2>
                            <p className="text-[#8B9BB4] mb-8">
                                Join thousands of developers who are already leveling up with CodeSync.
                            </p>
                            
                            <button 
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium text-[15px] w-full sm:w-max mb-6"
                            >
                                Get Started for Free <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#8B9BB4]">
                                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Free forever</div>
                                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> No credit card required</div>
                                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Setup in 2 minutes</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-[#1A1D24] bg-[#05070A] pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                        
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                {/* Use Logo if available, otherwise Text */}
                                <div className="w-8 h-8 rounded bg-[#2563EB] flex items-center justify-center">
                                    <Terminal className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">CodeSync</span>
                            </div>
                            <p className="text-[#8B9BB4] text-sm max-w-xs mb-6 leading-relaxed">
                                Your unified coding profile and analytics dashboard.
                            </p>
                            <div className="flex items-center gap-4 text-[#8B9BB4]">
                                <a href="https://github.com/AbdulWasay0029/Coding-Tracker" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                                <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="https://discord.gg/qfhKfnJCau" className="hover:text-white transition-colors"><Disc className="w-5 h-5" /></a>
                            </div>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 className="text-white text-[11px] font-bold tracking-widest uppercase mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><Link href="#features" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Features</Link></li>
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Integrations</Link></li>
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Changelog</Link></li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h4 className="text-white text-[11px] font-bold tracking-widest uppercase mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><Link href="/docs" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Documentation</Link></li>
                                <li><Link href="/docs" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">API Reference</Link></li>
                                <li><Link href="/docs" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Guides</Link></li>
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 className="text-white text-[11px] font-bold tracking-widest uppercase mb-6">Company</h4>
                            <ul className="space-y-4 mb-8">
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">About</Link></li>
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Contact</Link></li>
                                <li><Link href="/legal/privacy" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/legal/terms" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                            </ul>
                            
                            <h4 className="text-white text-[11px] font-bold tracking-widest uppercase mb-4">Newsletter</h4>
                            <p className="text-[#8B9BB4] text-xs mb-3">Stay updated with the latest features and coding insights.</p>
                            <div className="flex bg-[#111318] border border-[#2A2E37] rounded-lg overflow-hidden focus-within:border-[#60A5FA] transition-colors">
                                <input type="email" placeholder="Enter your email" className="bg-transparent text-sm text-white px-3 py-2 outline-none w-full placeholder:text-[#4B5563]" />
                                <button className="px-3 flex items-center justify-center text-[#8B9BB4] hover:text-white bg-[#1A1D24] border-l border-[#2A2E37] transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="border-t border-[#1A1D24] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[#4B5563] text-sm">© 2026 CodeSync. All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </main>
    );
}
