import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';
import { prisma } from '../../../lib/prisma';

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.accessToken) {
        redirect('/');
    }

    if (session.error === 'RefreshAccessTokenError') {
        redirect('/api/auth/signin');
    }

    // Fetch user's guilds from Discord for the Admin Panel
    let adminGuilds = [];
    try {
        const res = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: 'no-store'
        });

        if (res.ok) {
            const allGuilds = await res.json();
            
            // Filter for guilds where the user has ADMINISTRATOR permissions (0x8)
            const adminGuildsRaw = allGuilds.filter((guild: any) => {
                try {
                    const perms = BigInt(guild.permissions);
                    const adminFlag = BigInt(8);
                    return (perms & adminFlag) === adminFlag;
                } catch {
                    return false;
                }
            });

            const configuredGuilds = await prisma.guildConfig.findMany({ select: { guildId: true } });
            const botGuildIds = new Set(configuredGuilds.map(g => g.guildId));

            adminGuilds = adminGuildsRaw.filter((guild: any) => botGuildIds.has(guild.id));
        } else {
            console.error(`[Settings] Failed to fetch guilds from Discord: ${res.status} ${res.statusText}`);
        }
    } catch (e) {
        console.error('[Settings] Error fetching guilds', e);
    }

    return (
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SettingsClient session={session} adminGuilds={adminGuilds} />
        </main>
    );
}
