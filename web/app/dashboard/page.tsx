import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import Image from 'next/image';
import { ProfileManager } from './ProfileManager';
import { ContributionGraph } from '../../components/ContributionGraph';
import { Trophy, Zap } from 'lucide-react';

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
        <main className="max-w-[1000px] mx-auto px-6 py-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-reveal">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-20 animate-pulse" />
                    {discordUser.avatar ? (
                        <Image src={discordUser.avatar} alt="Avatar" width={120} height={120} className="rounded-full relative z-10 border-4 border-surface shadow-[0_0_30px_rgba(var(--primary),0.3)]" />
                    ) : (
                        <div className="w-[120px] h-[120px] rounded-full relative z-10 border-4 border-surface shadow-[0_0_30px_rgba(var(--primary),0.3)] bg-background flex items-center justify-center text-4xl font-bold text-text-secondary">
                            {discordUser.username.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">{discordUser.username}</h1>
                    <p className="text-text-secondary text-lg">Unified Developer Identity</p>
                    <div className="flex gap-4 mt-4">
                        <div className="bg-surface border border-border px-4 py-2 rounded-lg flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-warning" />
                            <span className="font-bold text-white">{history.length}</span>
                            <span className="text-xs text-text-secondary uppercase tracking-wider">Total Solves</span>
                        </div>
                        <div className="bg-surface border border-border px-4 py-2 rounded-lg flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="font-bold text-white">Top 5%</span>
                            <span className="text-xs text-text-secondary uppercase tracking-wider">Global Rank</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Heatmap (Self-contained card, NO WRAPPER) */}
            <div className="mb-10 w-full flex justify-center">
                <ContributionGraph history={history} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                    <ProfileManager initialProfiles={profiles} />
                </div>

                <div className="md:col-span-8">
                    <div className="bg-surface border border-border rounded-md shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="px-5 py-4 border-b border-border bg-background">
                            <h2 className="text-sm font-medium text-text-primary">Recent Submissions</h2>
                        </div>
                        
                        {history.length > 0 ? (
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {history.slice(0, 100).map((problem: any) => (
                                    <div key={problem.id} className="flex items-center justify-between px-5 py-3 border-b border-border hover:bg-background transition-colors leaderboard-row">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-text-primary truncate max-w-[300px]">{problem.title}</span>
                                            <span className="text-xs text-text-tertiary mt-0.5">{problem.platform}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-text-secondary font-mono">{new Date(problem.solvedAt).toISOString().split('T')[0]}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-8 text-center">
                                <p className="text-sm text-text-secondary">No recorded submissions. Run `/check` in Discord to sync your profiles.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Badges Section */}
            <BadgesSection userId={session.user.id} />
        </main>
    );
}
