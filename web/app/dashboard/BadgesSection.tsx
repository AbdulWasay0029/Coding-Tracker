import { prisma } from '../../lib/prisma';
import { Award, Flame, Zap, CheckCircle2, Shield, Moon, Brain, Target, Sun, CalendarDays, Code2, Terminal } from 'lucide-react';

export async function BadgesSection({ userId }: { userId: string }) {
    // Fetch user stats to compute badges dynamically
    const solves = await prisma.solvedProblem.findMany({
        where: { discordUserId: userId },
        orderBy: { solvedAt: 'desc' }
    });

    const totalSolves = solves.length;
    
    // Check platforms used
    const platforms = new Set(solves.map(s => s.platform));

    // Calculate advanced stats
    const solvesPerDay: Record<string, number> = {};
    let maxSolvesInOneDay = 0;
    let hasNightOwl = false;
    let hasCodeChef = false;
    let hasEarlyBird = false;
    let hasWeekendWarrior = false;
    let hasCodeforces = false;
    let hasLeetCode = false;
    let hasSmartInterviews = false;

    for (const s of solves) {
        // Convert UTC to IST
        const istDate = new Date(s.solvedAt.getTime() + 5.5 * 60 * 60 * 1000);
        const dateStr = istDate.toISOString().split('T')[0];
        
        solvesPerDay[dateStr] = (solvesPerDay[dateStr] || 0) + 1;
        if (solvesPerDay[dateStr] > maxSolvesInOneDay) {
            maxSolvesInOneDay = solvesPerDay[dateStr];
        }

        const hour = istDate.getUTCHours();
        const day = istDate.getUTCDay();

        if (hour >= 0 && hour < 4) hasNightOwl = true;
        if (hour >= 5 && hour < 9) hasEarlyBird = true;

        if ((day === 0 || day === 6) && solvesPerDay[dateStr] >= 5) {
            hasWeekendWarrior = true;
        }

        if (s.platform === 'CODECHEF') hasCodeChef = true;
        if (s.platform === 'CODEFORCES') hasCodeforces = true;
        if (s.platform === 'LEETCODE') hasLeetCode = true;
        if (s.platform === 'SMARTINTERVIEWS') hasSmartInterviews = true;
    }

    // Badges definitions
    const badges = [
        {
            id: 'first_blood',
            name: 'First Blood',
            description: 'Solve your very first problem on any platform.',
            icon: <Zap className="w-8 h-8 text-white" />,
            color: 'from-blue-500 to-cyan-400',
            glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
            unlocked: totalSolves > 0
        },
        {
            id: 'night_owl',
            name: 'Night Owl',
            description: 'Solve a problem between Midnight and 4 AM (IST).',
            icon: <Moon className="w-8 h-8 text-white" />,
            color: 'from-indigo-600 to-purple-800',
            glow: 'shadow-[0_0_20px_rgba(79,70,229,0.5)]',
            unlocked: hasNightOwl
        },
        {
            id: 'early_bird',
            name: 'Early Bird',
            description: 'Solve a problem between 5 AM and 9 AM (IST).',
            icon: <Sun className="w-8 h-8 text-white" />,
            color: 'from-yellow-400 to-orange-500',
            glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]',
            unlocked: hasEarlyBird
        },
        {
            id: 'weekend_warrior',
            name: 'Weekend Warrior',
            description: 'Solve 5 or more problems on a Saturday or Sunday.',
            icon: <CalendarDays className="w-8 h-8 text-white" />,
            color: 'from-blue-600 to-indigo-800',
            glow: 'shadow-[0_0_20px_rgba(37,99,235,0.5)]',
            unlocked: hasWeekendWarrior
        },
        {
            id: 'leetcode_legend',
            name: 'LeetCode Legend',
            description: 'Connect and solve a problem on LeetCode.',
            icon: <Code2 className="w-8 h-8 text-white" />,
            color: 'from-yellow-500 to-yellow-600',
            glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
            unlocked: hasLeetCode
        },
        {
            id: 'codeforces_specialist',
            name: 'CF Specialist',
            description: 'Connect and solve a problem on Codeforces.',
            icon: <Terminal className="w-8 h-8 text-white" />,
            color: 'from-blue-500 to-red-500',
            glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
            unlocked: hasCodeforces
        },
        {
            id: 'smart_cookie',
            name: 'Smart Cookie',
            description: 'Connect and solve a problem on SmartInterviews.',
            icon: <Brain className="w-8 h-8 text-white" />,
            color: 'from-pink-500 to-rose-400',
            glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]',
            unlocked: hasSmartInterviews
        },
        {
            id: 'daily_grind',
            name: 'The Daily Grind',
            description: 'Solve 10 or more problems in a single day.',
            icon: <Target className="w-8 h-8 text-white" />,
            color: 'from-emerald-500 to-teal-400',
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
            unlocked: maxSolvesInOneDay >= 10
        },
        {
            id: 'master_chef',
            name: 'Master Chef',
            description: 'Connect and solve a problem on CodeChef.',
            icon: <Brain className="w-8 h-8 text-white" />,
            color: 'from-amber-600 to-orange-800',
            glow: 'shadow-[0_0_20px_rgba(217,119,6,0.5)]',
            unlocked: hasCodeChef
        },
        {
            id: 'century',
            name: 'The Century Club',
            description: 'Grind out 100 total problem solves across all platforms.',
            icon: <Award className="w-8 h-8 text-white" />,
            color: 'from-amber-500 to-orange-400',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
            unlocked: totalSolves >= 100
        },
        {
            id: 'polyglot',
            name: 'The Polyglot',
            description: 'Solve problems on at least 3 different coding platforms.',
            icon: '🌐',
            color: 'from-purple-500 to-pink-500',
            glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
            unlocked: platforms.size >= 3
        },
        {
            id: 'veteran',
            name: 'Veteran Solver',
            description: 'Surpass 500 total problems solved.',
            icon: '🛡️',
            unlocked: totalSolves >= 500
        }
    ];

    const earnedBadges = badges.filter(b => b.unlocked);

    return (
        <section className="glass-subtle rounded-2xl p-6 md:p-8 flex flex-col h-full animate-reveal stagger-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white/95 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#A78BFA]" /> Achievements
                </h2>
                <span className="px-3 py-1 bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-mono rounded-lg border border-[#A78BFA]/20">
                    {earnedBadges.length} Earned
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-2">
                    {badges.map(badge => {
                        const isEarned = earnedBadges.some(b => b.id === badge.id);
                        return (
                            <div 
                                key={badge.id}
                                className={`relative group rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 ${
                                    isEarned 
                                    ? 'bg-[#1A1D24] border border-[#A78BFA]/30 hover:border-[#A78BFA]/60 shadow-[0_0_15px_rgba(167,139,250,0.1)] hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] hover:-translate-y-1' 
                                    : 'bg-[#0B0E14] border border-white/5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                                }`}
                            >
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    {isEarned && <div className="absolute inset-0 bg-[#A78BFA] opacity-20 blur-md rounded-full" />}
                                    <span className="text-3xl relative z-10 filter drop-shadow-md">{badge.icon}</span>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <span className="text-xs font-bold text-white/90 truncate">{badge.name}</span>
                                    <span className="text-[10px] text-white/50 leading-tight line-clamp-2">{badge.description}</span>
                                </div>
                                {!isEarned && (
                                    <div className="absolute inset-0 bg-[#0B0E14]/80 backdrop-blur-[1px] rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-semibold text-[#A78BFA]">Locked</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function GlobeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
    );
}
