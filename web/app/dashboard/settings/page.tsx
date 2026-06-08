import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { AdminClient } from './AdminClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.accessToken) {
        redirect('/');
    }

    if (session.error === 'RefreshAccessTokenError') {
        redirect('/api/auth/signin');
    }

    // Fetch user's guilds from Discord
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
        // We do not want to cache this heavily in case they gain/lose admin roles
        next: { revalidate: 60 }
    });

    if (!res.ok) {
        // Token might be expired, or Discord API issue
        const errText = await res.text();
        console.error(`[Admin] Failed to fetch guilds from Discord: ${res.status} ${res.statusText}`, errText);
        redirect('/dashboard');
    }

    const allGuilds = await res.json();

    // Filter for guilds where the user has ADMINISTRATOR permissions
    // Administrator permission flag is 0x8
    const adminGuildsRaw = allGuilds.filter((guild: any) => {
        try {
            const perms = BigInt(guild.permissions);
            const adminFlag = BigInt(8);
            return (perms & adminFlag) === adminFlag;
        } catch {
            return false;
        }
    });

    const { prisma } = await import('../../../lib/prisma');
    const configuredGuilds = await prisma.guildConfig.findMany({ select: { guildId: true } });
    const botGuildIds = new Set(configuredGuilds.map(g => g.guildId));

    const adminGuilds = adminGuildsRaw.filter((guild: any) => botGuildIds.has(guild.id));

    return (
        <main className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center justify-between animate-reveal stagger-1">
                <div>
                    <Link href="/dashboard" className="text-primary hover:text-primary-hover flex items-center gap-2 mb-4 transition-colors font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-text-primary">Admin Portal</h1>
                    <p className="text-text-secondary mt-2">Manage CodeSync settings for servers you administrate.</p>
                </div>
            </div>

            <div className="animate-reveal stagger-2">
                <AdminClient guilds={adminGuilds} />
            </div>
        </main>
    );
}
