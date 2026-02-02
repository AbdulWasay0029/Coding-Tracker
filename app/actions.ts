'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDashboardData() {
    const config = await prisma.globalConfig.findUnique({ where: { id: 'config' } });
    const profiles = await prisma.userProfile.findMany({
        orderBy: { createdAt: 'desc' }
    });
    const recentSolved = await prisma.solvedProblem.findMany({
        take: 10,
        orderBy: { solvedAt: 'desc' }
    });

    return {
        webhookUrl: config?.discordWebhookUrl || '',
        profiles,
        recentSolved
    };
}

export async function updateWebhookUrl(formData: FormData) {
    const url = formData.get('webhookUrl') as string;

    await prisma.globalConfig.upsert({
        where: { id: 'config' },
        update: { discordWebhookUrl: url },
        create: { id: 'config', discordWebhookUrl: url },
    });

    revalidatePath('/');
}

export async function addProfile(formData: FormData) {
    const platform = formData.get('platform') as string;
    const username = formData.get('username') as string;

    if (!platform || !username) return;

    try {
        await prisma.userProfile.create({
            data: {
                platform,
                username,
            },
        });
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to add profile:', error);
        // Silent fail for duplicates for now
    }
}

export async function removeProfile(profileId: string) {
    await prisma.userProfile.delete({
        where: { id: profileId },
    });
    revalidatePath('/');
}
