import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import Link from 'next/link';
import { Award, Flame, Zap, CheckCircle2, Shield, Moon, Sun, CalendarDays, Code2, Terminal, Brain, Target, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BadgesPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        redirect('/api/auth/signin');
    }

    const userId = session.user.id;

    const [solves, profiles] = await Promise.all([
        prisma.solvedProblem.findMany({
            where: { discordUserId: userId },
            orderBy: { solvedAt: 'desc' }
        }),
        prisma.userProfile.findMany({
            where: { discordUserId: userId }
        })
    ]);

    const totalSolves = solves.length;
    const connectedPlatforms = new Set(profiles.map(p => p.platform));

    let maxSolvesInOneDay = 0;
    const solvesPerDay: Record<string, number> = {};
    let hasNightOwl = false;
    let hasEarlyBird = false;
    let hasWeekendWarrior = false;
    
    let hasCodeChef = connectedPlatforms.has('CODECHEF');
    let hasCodeforces = connectedPlatforms.has('CODEFORCES');
    let hasLeetCode = connectedPlatforms.has('LEETCODE');
    let hasSmartInterviews = connectedPlatforms.has('SMARTINTERVIEWS');

    for (const s of solves) {
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
            unlocked: connectedPlatforms.size >= 3
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

    const unlockedCount = badges.filter(b => b.unlocked).length;

    return (
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
            <Link href="/dashboard" className="inline-flex items-center text-[#60A5FA] hover:text-white transition-colors mb-8 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <div className="mb-12 animate-reveal">
                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                    <Flame className="w-10 h-10 text-[#EF4444] drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" /> Achievements
                </h1>
                <p className="text-lg text-white/50 mt-3 max-w-2xl">
                    Collect rare badges by hitting milestones and pushing your limits. You have unlocked {unlockedCount} out of {badges.length} badges.
                </p>
                <div className="w-full bg-white/5 rounded-full h-2 mt-6 max-w-xl overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-[#60A5FA] to-[#A78BFA] h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-reveal stagger-2">
                {badges.map(badge => (
                    <div 
                        key={badge.id}
                        className={`relative rounded-2xl p-6 overflow-hidden transition-all duration-300 ${
                            badge.unlocked 
                                ? `glass-subtle border border-white/10 ${badge.glow} hover:-translate-y-1` 
                                : 'bg-[#0B0E14] border border-white/5 opacity-50 grayscale hover:grayscale-0'
                        }`}
                    >
                        {badge.unlocked && (
                            <div className="absolute top-4 right-4 bg-[#10B981]/20 rounded-full p-1">
                                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            </div>
                        )}
                        
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-5 shadow-lg`}>
                            {badge.icon}
                        </div>
                        
                        <h3 className="text-lg font-bold text-white/90 mb-2">{badge.name}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">{badge.description}</p>
                        
                        {!badge.unlocked && (
                            <div className="mt-6 text-[10px] font-mono uppercase tracking-wider text-white/30 bg-black/50 py-1.5 px-3 rounded-lg w-fit border border-white/5">
                                🔒 Locked
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
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
