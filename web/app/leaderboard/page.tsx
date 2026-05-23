import { prisma } from '../../lib/prisma';
import Image from 'next/image';

export const revalidate = 60; // Cache for 60 seconds

async function getDiscordUser(userId: string) {
    try {
        const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
            next: { revalidate: 3600 }, // Cache user profile for 1 hour
        });
        if (!res.ok) return { username: `User ${userId}`, avatar: null };
        const data = await res.json();
        const avatarUrl = data.avatar 
            ? `https://cdn.discordapp.com/avatars/${userId}/${data.avatar}.png` 
            : null;
        return { username: data.global_name || data.username, avatar: avatarUrl };
    } catch {
        return { username: `User ${userId}`, avatar: null };
    }
}

export default async function LeaderboardPage() {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Global aggregate query
    const leaderboardData = await prisma.solvedProblem.groupBy({
        by: ['discordUserId'],
        where: { solvedAt: { gte: lastWeek } },
        _count: { problemId: true },
        orderBy: { _count: { problemId: 'desc' } },
        take: 50,
    });

    const enrichedData = await Promise.all(
        leaderboardData.map(async (user: any, idx: number) => {
            const discordUser = await getDiscordUser(user.discordUserId);
            return {
                rank: idx + 1,
                id: user.discordUserId,
                problems: user._count.problemId,
                ...discordUser
            };
        })
    );

    return (
        <main className="max-w-5xl mx-auto px-4 py-16">
            <div className="mb-8 border-b border-border pb-6 animate-reveal stagger-1 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Global Leaderboard</h1>
                    <p className="text-text-secondary mt-2 text-sm">Real-time ranking of top developers based on problems solved in the last 7 days.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Live Ranking
                </div>
            </div>

            <div className="bg-[#05070A] border border-border rounded-xl overflow-hidden animate-reveal stagger-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface border-b-2 border-border text-text-secondary text-xs uppercase tracking-wider font-bold">
                            <th className="p-5 w-24 text-center">Rank</th>
                            <th className="p-5">Student</th>
                            <th className="p-5 text-right">Problems Solved</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {enrichedData.map((user: any) => (
                            <tr key={user.id} className="hover:bg-surface transition-colors group leaderboard-row">
                                <td className="p-5 text-center">
                                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-black text-lg ${
                                        user.rank === 1 ? 'bg-warning text-[#0B0E14] shadow-[0_0_15px_rgba(255,215,0,0.5)]' :
                                        user.rank === 2 ? 'bg-[#C0C0C0] text-[#0B0E14] shadow-[0_0_15px_rgba(192,192,192,0.5)]' :
                                        user.rank === 3 ? 'bg-[#CD7F32] text-[#0B0E14] shadow-[0_0_15px_rgba(205,127,50,0.5)]' :
                                        'bg-border text-text-secondary'
                                    }`}>
                                        #{user.rank}
                                    </span>
                                </td>
                                <td className="p-5 flex items-center gap-4">
                                    {user.avatar ? (
                                        <div className={`rounded-full p-0.5 ${
                                            user.rank === 1 ? 'bg-warning' :
                                            user.rank === 2 ? 'bg-[#C0C0C0]' :
                                            user.rank === 3 ? 'bg-[#CD7F32]' :
                                            'bg-transparent'
                                        }`}>
                                            <Image src={user.avatar} alt="Avatar" width={44} height={44} className="rounded-full bg-surface" />
                                        </div>
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-lg text-text-secondary">
                                            {user.username.charAt(0)}
                                        </div>
                                    )}
                                    <span className={`font-bold text-lg ${
                                        user.rank === 1 ? 'text-warning' :
                                        user.rank === 2 ? 'text-[#C0C0C0]' :
                                        user.rank === 3 ? 'text-[#CD7F32]' :
                                        'text-white'
                                    }`}>
                                        {user.username}
                                    </span>
                                </td>
                                <td className="p-5 text-right font-black text-2xl text-secondary group-hover:text-primary transition-colors">
                                    {user.problems}
                                </td>
                            </tr>
                        ))}
                        {enrichedData.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-12 text-center text-text-secondary font-mono">
                                    &gt; No problems solved this week yet. Initialize the grind.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
