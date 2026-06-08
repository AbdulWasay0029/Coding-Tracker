'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';

export async function getGuildChannels(guildId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('Unauthorized');

    // Fetch channels using the BOT token
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch channels. Is the bot invited to this server?');
    }

    const channels = await res.json();
    // Filter for text channels (type 0)
    return channels.filter((c: any) => c.type === 0).map((c: any) => ({
        id: c.id,
        name: c.name
    }));
}

export async function getGuildRoles(guildId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) throw new Error('Unauthorized');

    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch roles. Is the bot invited to this server?');
    }

    const roles = await res.json();
    // Filter out the @everyone role and sort
    return roles.filter((r: any) => r.name !== '@everyone').map((r: any) => ({
        id: r.id,
        name: r.name
    }));
}

export async function getGuildConfig(guildId: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    return await prisma.guildConfig.findUnique({
        where: { guildId }
    });
}

export async function updateGuildConfig(guildId: string, data: { welcomeChannelId?: string | null, contestChannelId?: string | null, contestRoleId?: string | null, reminderChannelId?: string | null, reminderTime?: string | null }) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    await prisma.guildConfig.upsert({
        where: { guildId },
        update: {
            contestChannelId: data.contestChannelId || null,
            contestRoleId: data.contestRoleId || null,
            reminderChannelId: data.reminderChannelId || null,
            reminderTime: data.reminderTime || null,
        },
        create: {
            guildId,
            contestChannelId: data.contestChannelId || null,
            contestRoleId: data.contestRoleId || null,
            reminderChannelId: data.reminderChannelId || null,
            reminderTime: data.reminderTime || null,
        }
    });

    return { success: true };
}
