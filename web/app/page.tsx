'use client';

import Link from 'next/link';
import { Terminal, Globe, Code2, ArrowRight, Bot } from 'lucide-react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    return (
        <main className="min-h-screen flex flex-col overflow-hidden relative">
            {/* Massive Glowing Gradient Mesh Background */}
            <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-[#3B82F6] opacity-[0.08] blur-[150px] rounded-full" />
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[#10B981] opacity-[0.06] blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[50%] bg-[#A78BFA] opacity-[0.05] blur-[100px] rounded-full" />
            </div>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px] w-full mx-auto pt-20 md:pt-32 pb-16 relative z-10 gap-16 lg:gap-8">
                
                <div className="space-y-8 lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 text-sm font-medium text-[#60A5FA] mb-2 shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-reveal stagger-1">
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse shadow-[0_0_8px_#3B82F6]" />
                        CodeSync v2.0 Live
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05] animate-reveal stagger-2">
                        <span className="text-white/95">Your Unified </span>
                        <br className="hidden lg:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]">Developer Identity.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/70 max-w-xl font-normal animate-reveal stagger-3">
                        Track, sync, and showcase your problem-solving progress across LeetCode, Codeforces, HackerRank, and more in one premium, gamified dashboard.
                    </p>
                    
                    <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 animate-reveal stagger-4 w-full sm:w-auto">
                        {!session ? (
                            <button 
                                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#3B82F6]/90 backdrop-blur-md border border-white/10 hover:shadow-[0_4px_24px_-4px_rgba(96,165,250,0.4)] transition-all duration-300 text-white/95 font-medium text-lg"
                            >
                                Login with Discord <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <Link 
                                href="/dashboard" 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#3B82F6]/90 backdrop-blur-md border border-white/10 hover:shadow-[0_4px_24px_-4px_rgba(96,165,250,0.4)] transition-all duration-300 text-white/95 font-medium text-lg"
                            >
                                Go to Dashboard <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                        <a 
                            href="https://discord.com/oauth2/authorize?client_id=1478104744391344359&permissions=8&integration_type=0&scope=bot+applications.commands" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 hover:border-[#60A5FA]/30 hover:shadow-[0_4px_16px_-4px_rgba(96,165,250,0.2)] transition-all duration-300 text-white/90 font-medium text-lg"
                        >
                            <Bot className="w-5 h-5" />
                            Add Bot
                        </a>
                    </div>
                </div>

                {/* Floating Mockup (Right Side) */}
                <div className="lg:w-1/2 relative w-full aspect-[4/3] flex items-center justify-center animate-reveal stagger-5" style={{ perspective: '2000px' }}>
                    <div 
                        className="relative w-full max-w-[700px] h-full rounded-2xl overflow-hidden border border-white/10 bg-[#0B0E14]/80 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(59,130,246,0.3)] transition-transform duration-1000 ease-out hover:rotate-0"
                        style={{ transform: 'rotateY(-15deg) rotateX(10deg) rotateZ(-2deg)' }}
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
                        {/* Mockup Image - using existing bot-showcase or a placeholder for now */}
                        <div className="relative w-full h-[calc(100%-40px)] p-6 flex flex-col gap-4 overflow-hidden">
                            {/* Fake Dashboard Header */}
                            <div className="w-full h-24 rounded-xl bg-[#1A1D24]/60 border border-white/5 flex items-center px-6 gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#A78BFA] p-0.5">
                                    <div className="w-full h-full rounded-full bg-[#05070A]" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="w-1/3 h-4 bg-white/10 rounded" />
                                    <div className="w-1/4 h-3 bg-white/5 rounded" />
                                </div>
                                <div className="w-20 h-10 rounded-lg bg-[#10B981]/20 border border-[#10B981]/30" />
                            </div>
                            {/* Fake Grid */}
                            <div className="flex gap-4 h-full">
                                <div className="w-2/3 h-full rounded-xl bg-[#1A1D24]/60 border border-white/5 p-4 flex flex-col gap-3">
                                    <div className="w-1/4 h-4 bg-white/10 rounded mb-2" />
                                    <div className="grid grid-cols-7 gap-1 flex-1">
                                        {Array.from({length: 35}).map((_, i) => (
                                            <div key={i} className={`rounded-sm ${i % 7 === 0 ? 'bg-[#3B82F6]/50' : i % 5 === 0 ? 'bg-[#10B981]/50' : 'bg-white/5'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="w-1/3 h-full rounded-xl bg-[#1A1D24]/60 border border-white/5 p-4 flex flex-col gap-3">
                                    <div className="w-1/2 h-4 bg-white/10 rounded mb-2" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-full h-8 bg-white/5 rounded" />
                                        <div className="w-full h-8 bg-white/5 rounded" />
                                        <div className="w-full h-8 bg-white/5 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Strip */}
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
        </main>
    );
}
