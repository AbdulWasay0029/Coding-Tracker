import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import Image from 'next/image';
import { ProfileManager } from './ProfileManager';
import { ContributionGraph } from '../../components/ContributionGraph';
import { Trophy, Zap, Globe, Terminal } from 'lucide-react';

import { BadgesSection } from './BadgesSection';

async function getDiscordUser(userId: string) {
    try {
        const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
            next: { revalidate: 3600 }
        });
        if (!res.ok) return { username: `User ${userId}`, avatar: null };
        const data = await res.json();
        return { 
            username: data.global_name || data.username, 
            avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${userId}/${data.avatar}.png` : null 
        };
    } catch {
        return { username: `User ${userId}`, avatar: null };
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/');
    }

    // Fetch user's problem solving history for the last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const history = await prisma.solvedProblem.findMany({
        where: { 
            discordUserId: session.user.id,
            solvedAt: { gte: oneYearAgo }
        },
        orderBy: { solvedAt: 'desc' }
    });

    const profiles = await prisma.userProfile.findMany({
        where: { discordUserId: session.user.id }
    });

    const discordUser = await getDiscordUser(session.user.id);

    return (
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8">
            {/* Massive Profile Header Section */}
            <div className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 border-[#3B82F6]/20 shadow-[0_12px_40px_-10px_rgba(59,130,246,0.15)] animate-reveal mb-2">
                {/* Background atmospheric glow */}
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
                    <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-[#3B82F6] opacity-10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10">
                    <div className="absolute inset-0 bg-[#3B82F6] rounded-full blur-xl opacity-30 animate-pulse" />
                    {discordUser.avatar ? (
                        <Image src={discordUser.avatar} alt="Avatar" width={140} height={140} className="rounded-full relative z-10 border-4 border-[#3B82F6]/50 shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-[#0B0E14] object-cover" />
                    ) : (
                        <div className="w-[140px] h-[140px] rounded-full relative z-10 border-4 border-[#3B82F6]/50 shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-[#1A1D24] flex items-center justify-center text-5xl font-bold text-white/80">
                            {discordUser.username.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex flex-col items-center md:items-start flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-xs font-mono text-[#60A5FA] mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6] animate-pulse" />
                        CodeSync Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white/95 tracking-tight mb-6">{discordUser.username}</h1>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="glass-subtle px-6 py-4 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-2xl font-black text-white/95">{history.length}</span>
                                <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Total Solved</span>
                            </div>
                        </div>
                        <div className="glass-subtle px-6 py-4 rounded-xl flex items-center gap-4 border-[#10B981]/20">
                            <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-2xl font-black text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Top 5%</span>
                                <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Global Rank</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="w-full glass-subtle rounded-2xl p-6 md:p-8 animate-reveal stagger-2 flex flex-col gap-4 mb-4">
                <h2 className="text-xl font-semibold text-white/95 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#60A5FA]" /> 365-Day Activity
                </h2>
                <div className="w-full overflow-x-auto custom-scrollbar pb-2">
                    <ContributionGraph history={history} />
                </div>
            </div>

            {/* Connected Platforms Widget */}
            <div className="w-full glass-subtle rounded-2xl p-6 md:p-8 flex flex-col gap-6 animate-reveal stagger-3 mb-2">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white/95 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#60A5FA]" /> Connected Platforms
                    </h2>
                    <Link href="/dashboard/settings" className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-[#60A5FA]/10">
                        Manage Platforms
                    </Link>
                </div>
                
                {profiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {profiles.map(p => (
                            <div key={p.id} className="bg-[#0B0E14] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-white/50">
                                    {p.platform.charAt(0)}
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="font-semibold text-white/90 truncate">{p.username}</span>
                                    <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">{p.platform}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-[#0B0E14] border border-white/5 rounded-xl flex flex-col items-center gap-3">
                        <Globe className="w-8 h-8 text-white/20" />
                        <p className="text-sm text-white/50">No platforms connected yet.</p>
                        <Link href="/dashboard/settings" className="mt-2 text-sm text-[#60A5FA] hover:underline">Connect your first platform</Link>
                    </div>
                )}
            </div>

            {/* Main Content Split: Recent Activity & Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-reveal stagger-4">
                {/* Left Column: Recent Activity */}
                <div className="lg:col-span-6 flex flex-col">
                    <div className="glass-subtle rounded-2xl overflow-hidden flex flex-col h-[500px]">
                        <div className="px-6 py-5 border-b border-white/5 bg-[#0B0E14]/40 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white/95">Recent Submissions</h2>
                        </div>
                        
                        {history.length > 0 ? (
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {history.slice(0, 100).map((problem: any) => (
                                    <div key={problem.id} className="flex items-center justify-between px-6 py-4 border-b border-white/5 hover:bg-[#1A1D24]/60 transition-colors group">
                                        <div className="flex flex-col gap-1 overflow-hidden pr-2">
                                            <span className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">{problem.title}</span>
                                            <span className="text-xs text-[#60A5FA]/80 uppercase tracking-wider font-mono">{problem.platform}</span>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-xs text-white/40 font-mono">{new Date(problem.solvedAt).toISOString().split('T')[0]}</span>
                                            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <Terminal className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-sm text-white/50">No recorded submissions. Run <code className="text-[#60A5FA] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">/check</code> in Discord to sync your profiles.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Badges */}
                <div className="lg:col-span-6">
                    <div className="h-[500px]">
                        <BadgesSection userId={session.user.id} />
                    </div>
                </div>
            </div>
        </main>
    );
}
