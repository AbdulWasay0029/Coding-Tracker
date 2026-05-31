import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import Image from 'next/image';
import { ProfileManager } from './ProfileManager';
import { ContributionGraph } from '../../components/ContributionGraph';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/');
    }

    // Fetch user's problem solving history for the last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const history = await prisma.solvedProblem.findMany({
        where: { 
            discordUserId: session.user.id,
            solvedAt: { gte: oneYearAgo }
        },
        orderBy: { solvedAt: 'desc' }
    });

    const profiles = await prisma.userProfile.findMany({
        where: { discordUserId: session.user.id }
    });

    return (
        <main className="max-w-[1000px] mx-auto px-6 py-12">
            {/* Minimalist Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    {session.user.image ? (
                        <Image src={session.user.image} alt="Avatar" width={48} height={48} className="rounded bg-surface border border-border" />
                    ) : (
                        <div className="w-12 h-12 rounded bg-surface border border-border flex items-center justify-center text-sm font-medium text-text-secondary">
                            {session.user.name?.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">{session.user.name}</h1>
                        <p className="text-text-secondary text-sm mt-0.5 font-mono">UID_{session.user.id}</p>
                    </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <span className="text-xs font-medium text-text-tertiary uppercase tracking-widest mb-1">Total Solved</span>
                    <span className="text-2xl font-mono text-text-primary">{history.length}</span>
                </div>
            </header>

            {/* Heatmap (Self-contained card, NO WRAPPER) */}
            <div className="mb-10 w-full flex justify-center">
                <ContributionGraph history={history} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                    <ProfileManager initialProfiles={profiles} />
                </div>

                <div className="md:col-span-8">
                    <div className="bg-surface border border-border rounded-md shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="px-5 py-4 border-b border-border bg-background">
                            <h2 className="text-sm font-medium text-text-primary">Recent Submissions</h2>
                        </div>
                        
                        {history.length > 0 ? (
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {history.slice(0, 100).map((problem: any) => (
                                    <div key={problem.id} className="flex items-center justify-between px-5 py-3 border-b border-border hover:bg-background transition-colors leaderboard-row">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-text-primary truncate max-w-[300px]">{problem.title}</span>
                                            <span className="text-xs text-text-tertiary mt-0.5">{problem.platform}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-text-secondary font-mono">{new Date(problem.solvedAt).toISOString().split('T')[0]}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-8 text-center">
                                <p className="text-sm text-text-secondary">No recorded submissions. Run `/check` in Discord to sync your profiles.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
