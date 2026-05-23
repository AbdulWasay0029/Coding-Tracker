import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import Image from 'next/image';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/');
    }

    // Fetch user's problem solving history
    const history = await prisma.solvedProblem.findMany({
        where: { discordUserId: session.user.id },
        orderBy: { solvedAt: 'desc' },
        take: 100
    });

    const profiles = await prisma.userProfile.findMany({
        where: { discordUserId: session.user.id }
    });

    return (
        <main className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center gap-6 mb-12 border-b border-border pb-8 animate-reveal stagger-1">
                {session.user.image ? (
                    <Image src={session.user.image} alt="Avatar" width={80} height={80} className="rounded-full bg-surface border border-border" />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center text-2xl font-bold">
                        {session.user.name?.charAt(0)}
                    </div>
                )}
                <div>
                    <h1 className="text-4xl font-bold text-primary">{session.user.name}</h1>
                    <p className="text-text-secondary mt-1">Discord ID: {session.user.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-surface border border-border p-6 rounded-lg shadow-sm animate-reveal stagger-2">
                        <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 text-text-primary">Linked Accounts</h2>
                        {profiles.length > 0 ? (
                            <ul className="space-y-3">
                                {profiles.map((p: any) => (
                                    <li key={p.id} className="flex justify-between items-center bg-[#0d1117] p-3 rounded border border-border">
                                        <span className="font-semibold text-text-secondary">{p.platform}</span>
                                        <span className="font-mono text-sm text-primary">{p.username}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-text-secondary">No linked accounts found. Use `/add-profile` in Discord to connect platforms!</p>
                        )}
                    </div>

                    <div className="bg-surface border border-border p-6 rounded-lg shadow-sm animate-reveal stagger-3">
                        <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 text-text-primary">Total Stats</h2>
                        <div className="text-4xl font-extrabold text-success">
                            {history.length} <span className="text-base font-normal text-text-secondary">problems</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-surface border border-border p-6 rounded-lg shadow-sm animate-reveal stagger-4">
                        <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 text-text-primary">Recent Solves</h2>
                        {history.length > 0 ? (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {history.map((problem: any) => (
                                    <div key={problem.id} className="flex items-center justify-between bg-[#0d1117] p-4 rounded border border-border hover:border-primary transition-colors leaderboard-row">
                                        <div>
                                            <h3 className="font-medium text-text-primary">{problem.title}</h3>
                                            <p className="text-xs text-text-secondary mt-1">{problem.platform} • {new Date(problem.solvedAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-success text-sm font-bold">Solved</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary">You haven't solved any problems yet. Start grinding and use `/check` in Discord to track them!</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
