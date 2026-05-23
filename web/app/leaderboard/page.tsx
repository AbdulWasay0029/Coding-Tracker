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
        leaderboardData.map(async (user, idx) => {
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
        <main className="max-w-5xl mx-auto px-4 py-12">
            <div className="mb-8 border-b border-border pb-4">
                <h1 className="text-3xl font-bold text-primary">Global Leaderboard</h1>
                <p className="text-text-secondary mt-2">Ranking based on total problems solved in the last 7 days.</p>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#1c2128] border-b border-border text-text-secondary text-sm">
                            <th className="p-4 font-semibold w-24">Rank</th>
                            <th className="p-4 font-semibold">Student</th>
                            <th className="p-4 font-semibold text-right">Problems Solved</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {enrichedData.map((user) => (
                            <tr key={user.id} className="hover:bg-[#1c2128] transition-colors">
                                <td className="p-4">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                        user.rank === 1 ? 'bg-yellow-500/10 text-yellow-500' :
                                        user.rank === 2 ? 'bg-gray-400/10 text-gray-400' :
                                        user.rank === 3 ? 'bg-amber-600/10 text-amber-600' :
                                        'text-text-secondary'
                                    }`}>
                                        #{user.rank}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center gap-3">
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt="Avatar" width={32} height={32} className="rounded-full bg-border" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs">
                                            {user.username.charAt(0)}
                                        </div>
                                    )}
                                    <span className="font-medium text-text-primary">{user.username}</span>
                                </td>
                                <td className="p-4 text-right font-bold text-success">
                                    {user.problems}
                                </td>
                            </tr>
                        ))}
                        {enrichedData.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-text-secondary">
                                    No problems solved this week yet. Be the first!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
