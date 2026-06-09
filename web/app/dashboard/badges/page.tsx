import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { Award, Flame, Zap, CheckCircle2, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BadgesPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        redirect('/api/auth/signin');
    }

    const userId = session.user.id;

    // Fetch user stats to compute badges dynamically
    const solves = await prisma.solvedProblem.findMany({
        where: { discordUserId: userId },
        orderBy: { solvedAt: 'desc' }
    });

    const totalSolves = solves.length;
    
    // Check platforms used
    const platforms = new Set(solves.map(s => {
        if (s.problemId.includes('LC_')) return 'LeetCode';
        if (s.problemId.includes('CF_')) return 'Codeforces';
        if (s.problemId.includes('CC_')) return 'CodeChef';
        if (s.problemId.includes('HR_')) return 'HackerRank';
        return 'Other';
    }));

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
        <main className="max-w-6xl mx-auto px-4 py-16">
            <div className="mb-12 animate-reveal stagger-1">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                    <Flame className="w-8 h-8 text-primary" /> Trick or Treat
                </h1>
                <p className="text-text-secondary text-lg">Earn exclusive badges as you level up your unified developer identity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-reveal stagger-2">
                {badges.map(badge => (
                    <div 
                        key={badge.id}
                        className={`relative rounded-xl p-6 overflow-hidden transition-all duration-300 ${
                            badge.unlocked 
                                ? `bg-surface border border-white/10 ${badge.glow} hover:-translate-y-2` 
                                : 'bg-[#05070A] border border-border opacity-50 grayscale hover:grayscale-0'
                        }`}
                    >
                        {badge.unlocked && (
                            <div className="absolute top-3 right-3">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                        )}
                        
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-6 shadow-lg`}>
                            {badge.icon}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
                        <p className="text-text-secondary text-sm">{badge.description}</p>
                        
                        {!badge.unlocked && (
                            <div className="mt-6 text-xs font-mono text-text-secondary bg-black/50 py-1 px-2 rounded w-fit">
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
