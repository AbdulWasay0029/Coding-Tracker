import { prisma } from '../../lib/prisma';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { LeaderboardHeader } from './LeaderboardHeader';

export const dynamic = 'force-dynamic';

async function getDiscordUser(userId: string) {
    try {
        const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
            cache: 'no-store', // Disable cache to prevent locking in failures
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

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ guildId?: string }> }) {
    // Calculate the start of the current week (Monday) at 00:00:00 IST
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(Date.now() + istOffset);
    const dayOfWeek = nowIST.getUTCDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const startOfWeekIST = new Date(nowIST.getTime());
    startOfWeekIST.setUTCDate(startOfWeekIST.getUTCDate() - diffToMonday);
    startOfWeekIST.setUTCHours(0, 0, 0, 0);
    
    const startOfWeekUTC = new Date(startOfWeekIST.getTime() - istOffset);

    const params = await searchParams;
    const guildId = params.guildId;
    let memberIds: string[] | null = null;
    let guildName = 'Global';

    // 1. Fetch user session to determine which servers they can filter by
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
    }

    // 2. Resolve Guild Name and Fetch Members
    if (guildId) {
        // Fallback to userGuilds if Discord API fails
        const matchedGuild = userGuilds.find(g => g.id === guildId);
        if (matchedGuild) guildName = matchedGuild.name;

        // Default to empty array to PREVENT leaking global leaderboard if API fails!
        memberIds = []; 

        try {
            const botRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
                headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
                cache: 'no-store'
            });
            if (botRes.ok) {
                const guildData = await botRes.json();
                guildName = guildData.name; // Authoritative name
                
                // Fetch up to 1000 members
                const membersRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
                    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
                    cache: 'no-store'
                });
                
                if (membersRes.ok) {
                    const members = await membersRes.json();
                    memberIds = members.map((m: any) => m.user.id);
                } else {
                    const errText = await membersRes.text();
                    console.error('[Leaderboard] Failed to fetch members. Status:', membersRes.status, errText);
                }
            } else {
                const errText = await botRes.text();
                console.error('[Leaderboard] Failed to fetch guild. Status:', botRes.status, errText);
            }
        } catch (e) {
            console.error('Failed to fetch guild members', e);
        }

        // Inject into dropdown if it's somehow completely missing
        if (!userGuilds.find(g => g.id === guildId) && guildName !== 'Global') {
            userGuilds.push({ id: guildId, name: guildName });
        }
    }

    const records = await prisma.solvedProblem.groupBy({
        by: ['discordUserId'],
        where: {
            solvedAt: { gte: startOfWeekUTC },
            ...(guildId ? { discordUserId: { in: memberIds || [] } } : {})
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 100
    });

    const enrichedData = await Promise.all(records.map(async (r, i) => {
        const user = await getDiscordUser(r.discordUserId);
        return {
            id: r.discordUserId,
            rank: i + 1,
            username: user.username,
            avatar: user.avatar,
            problems: r._count.id
        };
    }));

    const top3 = enrichedData.slice(0, 3);
    const rest = enrichedData.slice(3);

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <LeaderboardHeader 
                guilds={userGuilds} 
                currentGuildId={guildId} 
                guildName={guildName} 
                isLoggedIn={!!session} 
            />

            {enrichedData.length === 0 ? (
                <div className="mt-12 glass-subtle rounded-2xl p-16 text-center animate-reveal flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <span className="text-4xl">🏆</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white/95">No Rankings Available</h2>
                    <p className="text-white/60">Be the first to compete! Connect your platforms and start solving problems in {guildName}.</p>
                </div>
            ) : (
                <div className="mt-12 animate-reveal stagger-2">
                    {/* Top 3 Podium Section */}
                    {top3.length > 0 && (
                        <div className="relative pt-20 pb-16 mb-8 flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 min-h-[400px]">
                            {/* Radial Glow Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-full bg-[#F59E0B] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
                            
                            {/* Rank 2 - Silver */}
                            {top3[1] && (
                                <div className="glass-strong rounded-2xl p-6 flex flex-col items-center w-full md:w-[260px] h-[300px] relative border-[#94A3B8]/20 order-2 md:order-1 transform transition hover:-translate-y-2">
                                    <div className="absolute -top-12">
                                        <div className="relative">
                                            <div className="absolute -inset-2 bg-[#94A3B8] opacity-20 blur-lg rounded-full" />
                                            {top3[1].avatar ? (
                                                <Image src={top3[1].avatar} alt="Avatar" width={80} height={80} className="rounded-full border-4 border-[#94A3B8] relative z-10 bg-[#0B0E14]" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full border-4 border-[#94A3B8] bg-[#1A1D24] relative z-10 flex items-center justify-center text-2xl font-bold">{top3[1].username.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#94A3B8] border-2 border-[#0B0E14] flex items-center justify-center text-[#0B0E14] font-black z-20 shadow-lg">2</div>
                                    </div>
                                    <div className="mt-12 text-center w-full">
                                        <h3 className="text-lg font-bold text-white/95 truncate">{top3[1].username}</h3>
                                        <div className="mt-4 flex flex-col items-center">
                                            <span className="text-xs text-white/50 uppercase tracking-widest font-mono mb-1">Solved</span>
                                            <span className="font-mono text-4xl font-black text-[#94A3B8]">{top3[1].problems}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rank 1 - Gold */}
                            {top3[0] && (
                                <div className="glass-strong rounded-2xl p-8 flex flex-col items-center w-full md:w-[300px] h-[360px] relative border-[#F59E0B]/30 order-1 md:order-2 transform transition hover:-translate-y-2 z-10">
                                    <div className="absolute -top-16">
                                        <div className="relative">
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce z-30">👑</div>
                                            <div className="absolute -inset-3 bg-[#F59E0B] opacity-30 blur-xl rounded-full" />
                                            {top3[0].avatar ? (
                                                <Image src={top3[0].avatar} alt="Avatar" width={100} height={100} className="rounded-full border-4 border-[#F59E0B] relative z-10 bg-[#0B0E14]" />
                                            ) : (
                                                <div className="w-[100px] h-[100px] rounded-full border-4 border-[#F59E0B] bg-[#1A1D24] relative z-10 flex items-center justify-center text-3xl font-bold">{top3[0].username.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] border-2 border-[#0B0E14] flex items-center justify-center text-[#0B0E14] font-black z-20 shadow-lg text-lg">1</div>
                                    </div>
                                    <div className="mt-16 text-center w-full">
                                        <h3 className="text-xl font-bold text-white/95 truncate">{top3[0].username}</h3>
                                        <div className="mt-6 flex flex-col items-center">
                                            <span className="text-xs text-[#F59E0B]/70 uppercase tracking-widest font-mono mb-1">Solved</span>
                                            <span className="font-mono text-5xl font-black text-[#F59E0B]">{top3[0].problems}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rank 3 - Bronze */}
                            {top3[2] && (
                                <div className="glass-strong rounded-2xl p-6 flex flex-col items-center w-full md:w-[260px] h-[280px] relative border-[#D97706]/20 order-3 transform transition hover:-translate-y-2">
                                    <div className="absolute -top-12">
                                        <div className="relative">
                                            <div className="absolute -inset-2 bg-[#D97706] opacity-20 blur-lg rounded-full" />
                                            {top3[2].avatar ? (
                                                <Image src={top3[2].avatar} alt="Avatar" width={80} height={80} className="rounded-full border-4 border-[#D97706] relative z-10 bg-[#0B0E14]" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full border-4 border-[#D97706] bg-[#1A1D24] relative z-10 flex items-center justify-center text-2xl font-bold">{top3[2].username.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D97706] border-2 border-[#0B0E14] flex items-center justify-center text-[#0B0E14] font-black z-20 shadow-lg">3</div>
                                    </div>
                                    <div className="mt-12 text-center w-full">
                                        <h3 className="text-lg font-bold text-white/95 truncate">{top3[2].username}</h3>
                                        <div className="mt-4 flex flex-col items-center">
                                            <span className="text-xs text-white/50 uppercase tracking-widest font-mono mb-1">Solved</span>
                                            <span className="font-mono text-4xl font-black text-[#D97706]">{top3[2].problems}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Ranking List (4th and below) */}
                    {rest.length > 0 && (
                        <div className="flex flex-col gap-3 animate-reveal stagger-3">
                            <div className="flex px-6 py-2 text-xs uppercase tracking-widest font-mono text-white/40 border-b border-white/5 mb-2">
                                <div className="w-16 text-center">Rank</div>
                                <div className="flex-1">Developer</div>
                                <div className="w-32 text-right">Solved (7D)</div>
                            </div>
                            
                            {rest.map((user: any) => (
                                <div 
                                    key={user.id} 
                                    className={`glass-subtle rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:bg-[#1A1D24]/80 hover:border-[#60A5FA]/30 group ${
                                        session?.user?.id === user.id ? 'border-[#3B82F6]/50 bg-[#3B82F6]/5' : ''
                                    }`}
                                >
                                    <div className="w-16 text-center font-mono text-white/50 font-bold group-hover:text-white/80">
                                        #{user.rank}
                                    </div>
                                    <div className="flex-1 flex items-center gap-4">
                                        {user.avatar ? (
                                            <Image src={user.avatar} alt="Avatar" width={40} height={40} className="rounded-full bg-[#1A1D24] border border-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#1A1D24] border border-white/10 flex items-center justify-center font-bold text-white/70">
                                                {user.username.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className={`font-semibold text-lg ${session?.user?.id === user.id ? 'text-[#60A5FA]' : 'text-white/90 group-hover:text-white'}`}>
                                                {user.username}
                                                {session?.user?.id === user.id && <span className="ml-2 text-[10px] bg-[#3B82F6]/20 text-[#60A5FA] px-2 py-0.5 rounded font-mono uppercase">You</span>}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-32 text-right">
                                        <span className="font-mono text-2xl font-black text-[#10B981] group-hover:text-[#34D399] transition-colors">
                                            {user.problems}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
