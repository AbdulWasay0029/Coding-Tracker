'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';

interface LeaderboardHeaderProps {
    guilds: { id: string; name: string }[];
    currentGuildId?: string;
    guildName: string;
    isLoggedIn: boolean;
}

export function LeaderboardHeader({ guilds, currentGuildId, guildName, isLoggedIn }: LeaderboardHeaderProps) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'global') {
            window.location.href = '/leaderboard';
        } else {
            window.location.href = `/leaderboard?guildId=${val}`;
        }
    };

    return (
        <div className="mb-8 border-b border-border pb-6 animate-reveal stagger-1 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    {guildName} Leaderboard
                </h1>
                <p className="text-text-secondary mt-2 text-sm">Real-time ranking of top developers based on problems solved this week.</p>
            </div>
            
            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <div className="relative">
                        <select 
                            className="appearance-none bg-[#0B0E14] border border-white/10 text-white text-sm rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-[#60A5FA] cursor-pointer transition-colors"
                            value={currentGuildId || 'global'}
                            onChange={handleChange}
                        >
                            <option value="global" className="bg-[#0B0E14] text-white">🌍 Global Leaderboard</option>
                            <optgroup label="Your CodeSync Servers" className="bg-[#0B0E14] text-white/50">
                                {guilds.map(g => (
                                    <option key={g.id} value={g.id} className="bg-[#0B0E14] text-white">🏢 {g.name}</option>
                                ))}
                            </optgroup>
                        </select>
                        <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                ) : (
                    <button 
                        onClick={() => router.push('/api/auth/signin')}
                        className="text-xs font-medium bg-white/5 border border-white/10 text-white/70 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
                    >
                        Login to view Server Leaderboards
                    </button>
                )}

                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-xs font-medium text-[#10B981]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Live Ranking
                </div>
            </div>
        </div>
    );
}
