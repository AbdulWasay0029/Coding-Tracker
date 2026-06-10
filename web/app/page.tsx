'use client';

import Link from 'next/link';
import { ArrowRight, Bot, RefreshCw, BarChart2, Trophy, CheckCircle2, ChevronRight, ChevronLeft, Terminal } from 'lucide-react';
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
                    <div className="max-w-3xl mx-auto animate-reveal">
                        {/* CTA Card */}
                        <div className="bg-[#111318] border border-[#1A1D24] rounded-2xl p-10 md:p-14 flex flex-col items-center text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to boost your <span className="text-[#8B5CF6]">coding journey?</span>
                            </h2>
                            <p className="text-[#8B9BB4] text-lg mb-8 max-w-xl mx-auto">
                                Join thousands of developers who are already leveling up with CodeSync.
                            </p>
                            
                            <button 
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-bold text-[15px] mb-8"
                            >
                                Get Started for Free <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-[#8B9BB4]">
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
                                <a href="https://github.com/AbdulWasay0029/Coding-Tracker" className="hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://discord.gg/qfhKfnJCau" className="hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                                    </svg>
                                </a>
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
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">About</Link></li>
                                <li><Link href="#" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Contact</Link></li>
                                <li><Link href="/legal/privacy" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/legal/terms" className="text-[#8B9BB4] hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                            </ul>
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
