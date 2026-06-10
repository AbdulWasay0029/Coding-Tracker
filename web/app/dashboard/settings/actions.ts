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
            reminderTime: data.reminderTime || "22:00",
        },
        create: {
            guildId,
            contestChannelId: data.contestChannelId || null,
            contestRoleId: data.contestRoleId || null,
            reminderChannelId: data.reminderChannelId || null,
            reminderTime: data.reminderTime || "22:00",
        }
    });

    return { success: true };
}

export async function forceSyncServer(guildId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error('Unauthorized');

    // 1. Check Rate Limit (1 per day per guild)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSync = await prisma.analyticsEvent.findFirst({
        where: {
            command: 'server_force_sync',
            metadata: guildId,
            createdAt: { gte: twentyFourHoursAgo }
        }
    });

    if (recentSync) {
        throw new Error('This server has already been force-synced in the last 24 hours. Please wait until tomorrow.');
    }

    // 2. Fetch Guild Members from Discord REST API
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch server members. Please ensure the bot has the Server Members Intent enabled.');
    }

    const members = await res.json();
    const memberIds = members.map((m: any) => m.user.id);

    // 3. Find Tracked Users in this Guild
    const trackedUsers = await prisma.userProfile.findMany({
        where: { discordUserId: { in: memberIds } },
        select: { discordUserId: true },
        distinct: ['discordUserId']
    });

    if (trackedUsers.length === 0) {
        throw new Error('No tracked users found in this server.');
    }

    // 4. Record the Sync Event to enforce rate limit
    await prisma.analyticsEvent.create({
        data: {
            discordUserId: session.user.id,
            command: 'server_force_sync',
            metadata: guildId
        }
    });

    // 5. Fire and Forget: Import runTrackerForUser and sync in the background so we don't timeout the Next.js request
    const { runTrackerForUser, getTimestampsForDate } = require('../../../../src/jobs/tracker');
    const { startTimestamp, endTimestamp } = getTimestampsForDate('today');
    const fetchStartTimestamp = startTimestamp - (86400 * 2); // Pull last 3 days to heal data

    // Execute background sync without awaiting
    (async () => {
        try {
            for (const { discordUserId } of trackedUsers) {
                await runTrackerForUser(discordUserId, startTimestamp, endTimestamp, fetchStartTimestamp);
                await new Promise(r => setTimeout(r, 600)); // Rate limit buffer
            }
            console.log(`[Web Sync] Successfully completed background force sync for guild ${guildId}`);
        } catch (err) {
            console.error(`[Web Sync] Background sync failed for guild ${guildId}:`, err);
        }
    })();

    return { success: true, count: trackedUsers.length };
}
