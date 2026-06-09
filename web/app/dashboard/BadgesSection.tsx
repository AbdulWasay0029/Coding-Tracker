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
            icon: <GlobeIcon />,
            color: 'from-purple-500 to-pink-500',
            glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
            unlocked: platforms.size >= 3
        },
        {
            id: 'veteran',
            name: 'CodeSync Veteran',
            description: 'Surpass 500 total problems solved.',
            icon: <Shield className="w-8 h-8 text-white" />,
            color: 'from-rose-600 to-red-500',
            glow: 'shadow-[0_0_20px_rgba(225,29,72,0.5)]',
            unlocked: totalSolves >= 500
        }
    ];

    return (
        <section className="mt-8">
            <div className="mb-6 animate-reveal stagger-1 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Flame className="w-6 h-6 text-primary" /> Profile Badges
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">Earn exclusive badges as you level up.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-reveal stagger-2">
                {badges.map(badge => (
                    <div 
                        key={badge.id}
                        className={`relative rounded-xl p-5 overflow-hidden transition-all duration-300 ${
                            badge.unlocked 
                                ? `bg-surface border border-white/10 ${badge.glow} hover:-translate-y-1` 
                                : 'bg-[#05070A] border border-border opacity-50 grayscale hover:grayscale-0'
                        }`}
                    >
                        {badge.unlocked && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 shadow-lg`}>
                            {badge.icon}
                        </div>
                        
                        <h3 className="text-sm font-bold text-white mb-1">{badge.name}</h3>
                        <p className="text-text-tertiary text-xs leading-tight">{badge.description}</p>
                        
                        {!badge.unlocked && (
                            <div className="mt-4 text-[10px] font-mono text-text-secondary bg-black/50 py-0.5 px-1.5 rounded w-fit">
                                🔒 Locked
                            </div>
                        )}
                    </div>
                ))}
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
