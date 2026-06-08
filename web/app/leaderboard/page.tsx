import { prisma } from '../../lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

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

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { LeaderboardHeader } from './LeaderboardHeader';

export default async function LeaderboardPage({ searchParams }: { searchParams: { guildId?: string } }) {
    // Calculate the start of the current week (Monday) at 00:00:00 IST
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(Date.now() + istOffset);
    const dayOfWeek = nowIST.getUTCDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const startOfWeekIST = new Date(nowIST.getTime());
    startOfWeekIST.setUTCDate(startOfWeekIST.getUTCDate() - diffToMonday);
    startOfWeekIST.setUTCHours(0, 0, 0, 0);
    
    const startOfWeekUTC = new Date(startOfWeekIST.getTime() - istOffset);

    const guildId = searchParams.guildId;
    let memberIds: string[] | null = null;
    let guildName = 'Global';

    // If a guildId is selected, fetch its members to filter the leaderboard
    if (guildId) {
        try {
            const botRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
                headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
                next: { revalidate: 3600 }
            });
            if (botRes.ok) {
                const guildData = await botRes.json();
                guildName = guildData.name;
                
                // Fetch up to 1000 members (for larger servers, we'd need pagination or a database sync, but this works for MVP)
                const membersRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
                    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
                    next: { revalidate: 300 }
                });
                
                if (membersRes.ok) {
                    const members = await membersRes.json();
                    memberIds = members.map((m: any) => m.user.id);
                }
            }
        } catch (e) {
            console.error('Failed to fetch guild members', e);
        }
    }

    // Determine query filter
    const whereClause: any = { solvedAt: { gte: startOfWeekUTC } };
    if (memberIds) {
        whereClause.discordUserId = { in: memberIds };
    }
    
    const leaderboardData = await prisma.solvedProblem.groupBy({
        by: ['discordUserId'],
        where: whereClause,
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

    // Fetch user session to determine which servers they can filter by
    const session = await getServerSession(authOptions);
    let userGuilds: { id: string, name: string }[] = [];

    if (session && session.accessToken) {
        const res = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            cache: 'no-store'
        });
        if (res.ok) {
            const allGuilds = await res.json();
            
            // Intersect with bot configs to only show servers where the bot is active
            const configuredGuilds = await prisma.guildConfig.findMany({ select: { guildId: true } });
            const botGuildIds = new Set(configuredGuilds.map(g => g.guildId));

            userGuilds = allGuilds
                .filter((g: any) => botGuildIds.has(g.id))
                .map((g: any) => ({ id: g.id, name: g.name }));
        }

        // If we have a specific guildId but it's not in userGuilds (e.g. they aren't in the server but viewing it via link), inject it
        if (guildId && !userGuilds.find(g => g.id === guildId) && guildName !== 'Global') {
            userGuilds.push({ id: guildId, name: guildName });
        }
    }

    return (
        <main className="max-w-5xl mx-auto px-4 py-16">
            <LeaderboardHeader 
                guilds={userGuilds} 
                currentGuildId={guildId} 
                guildName={guildName} 
                isLoggedIn={!!session} 
            />

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
                                    &gt; No problems solved in {guildName} this week yet. Initialize the grind.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
