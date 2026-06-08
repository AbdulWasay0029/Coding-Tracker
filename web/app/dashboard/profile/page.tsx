import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import Image from 'next/image';
import { Activity, Trophy, Zap, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

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

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        redirect('/api/auth/signin');
    }

    const userId = session.user.id;
    const discordUser = await getDiscordUser(userId);

    // Fetch total solves globally
    const totalSolves = await prisma.solvedProblem.count({
        where: { discordUserId: userId }
    });

    // Fetch the last 60 days of activity to build the 3D Graph
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
    
    const recentSolves = await prisma.solvedProblem.groupBy({
        by: ['solvedAt'],
        where: { discordUserId: userId, solvedAt: { gte: sixtyDaysAgo } },
        _count: { problemId: true }
    });

    // Create a 60-day map
    const activityMap = new Map<string, number>();
    for (let i = 0; i < 60; i++) {
        const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        activityMap.set(d.toISOString().split('T')[0], 0);
    }

    recentSolves.forEach(solve => {
        const dateStr = solve.solvedAt.toISOString().split('T')[0];
        if (activityMap.has(dateStr)) {
            activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + solve._count.problemId);
        }
    });

    // Convert map to array for the isometric grid (reversed so oldest is first)
    const activityData = Array.from(activityMap.entries()).reverse().map(([date, count]) => ({ date, count }));

    return (
        <main className="max-w-6xl mx-auto px-4 py-16">
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
                            <span className="font-bold text-white">{totalSolves}</span>
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

            {/* Isometric 3D Contribution Graph */}
            <h2 className="text-2xl font-bold text-white mb-8 animate-reveal flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" /> 60-Day Unified Contributions
            </h2>
            
            <div className="bg-[#05070A] border border-border rounded-xl p-12 overflow-hidden mb-16 flex items-center justify-center animate-reveal stagger-1">
                {/* CSS Isometric Wrapper */}
                <div className="relative" style={{ transform: 'rotateX(60deg) rotateZ(-45deg)', transformStyle: 'preserve-3d' }}>
                    <div className="grid grid-cols-10 gap-2">
                        {activityData.map((day, i) => {
                            // Calculate height and color based on activity
                            const intensity = Math.min(day.count / 5, 1); // Cap at 5 solves for max intensity
                            const height = day.count === 0 ? 10 : 10 + (intensity * 40); // Base 10px, up to 50px
                            
                            let colorClass = 'bg-surface'; // 0 solves
                            let topColorClass = 'bg-border'; // Top face of 0 solves
                            
                            if (day.count > 0 && day.count <= 2) {
                                colorClass = 'bg-[#0e2a1b]';
                                topColorClass = 'bg-[#15462d]';
                            } else if (day.count > 2 && day.count <= 4) {
                                colorClass = 'bg-[#15462d]';
                                topColorClass = 'bg-[#216e39]';
                            } else if (day.count > 4) {
                                colorClass = 'bg-[#216e39]';
                                topColorClass = 'bg-[#30a14e] shadow-[0_0_15px_rgba(48,161,78,0.6)]';
                            }

                            return (
                                <div key={i} className="relative w-8 h-8 group" style={{ transformStyle: 'preserve-3d' }}>
                                    {/* The Block */}
                                    <div 
                                        className={`absolute inset-0 transition-all duration-500 hover:-translate-z-4`}
                                        style={{ transform: `translateZ(${height}px)`, transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Top Face */}
                                        <div className={`absolute inset-0 ${topColorClass} border border-black/20 group-hover:brightness-125 transition-all`} />
                                        
                                        {/* Right Face */}
                                        <div className={`absolute top-0 right-0 w-[${height}px] h-full ${colorClass} brightness-75 origin-right`} style={{ transform: `rotateY(90deg) translateZ(${height}px)`, width: height }} />
                                        
                                        {/* Front Face */}
                                        <div className={`absolute bottom-0 left-0 w-full h-[${height}px] ${colorClass} brightness-50 origin-bottom`} style={{ transform: `rotateX(-90deg) translateZ(${height}px)`, height: height }} />
                                    </div>
                                    
                                    {/* Tooltip on hover (invisible hit box) */}
                                    <div className="absolute inset-0 -translate-z-10 z-50 group-hover:block hidden">
                                        <div className="fixed -top-12 -left-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)' }}>
                                            {day.count} solves on {day.date}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </main>
    );
}
