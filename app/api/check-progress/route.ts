import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchLeetCodeSubmissions } from '@/lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '@/lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '@/lib/platforms/codechef';
import { sendDiscordNotification } from '@/lib/discord';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const config = await prisma.globalConfig.findUnique({ where: { id: 'config' } });
        const webhookUrl = config?.discordWebhookUrl;

        if (!webhookUrl) {
            return NextResponse.json({ message: 'No Webhook URL configured' }, { status: 400 });
        }

        const profiles = await prisma.userProfile.findMany();
        let totalNewProblems = 0;
        const messages: string[] = [];

        for (const profile of profiles) {
            let submissions: any[] = [];

            if (profile.platform === 'LEETCODE') {
                submissions = await fetchLeetCodeSubmissions(profile.username);
            } else if (profile.platform === 'CODEFORCES') {
                submissions = await fetchCodeforcesSubmissions(profile.username);
            } else if (profile.platform === 'CODECHEF') {
                submissions = await fetchCodeChefSubmissions(profile.username);
            }

            // Filter for today's problems or just new ones not in DB
            for (const sub of submissions) {
                // Check if exists
                const exists = await prisma.solvedProblem.findUnique({
                    where: {
                        platform_problemId: {
                            platform: profile.platform,
                            problemId: sub.id,
                        }
                    }
                });

                if (!exists) {
                    // It's a new problem!
                    await prisma.solvedProblem.create({
                        data: {
                            platform: profile.platform,
                            problemId: sub.id, // Ensure ID is string
                            title: sub.title,
                            solvedAt: new Date(sub.timestamp * 1000),
                        }
                    });

                    messages.push(`**${profile.username}** solved **${sub.title}** on ${profile.platform}!\n${sub.url}`);
                    totalNewProblems++;
                }
            }
        }

        if (messages.length > 0) {
            // Chunk messages to avoid Discord limits (2000 chars)
            const chunkedMessages = [];
            let currentChunk = '';

            for (const msg of messages) {
                if (currentChunk.length + msg.length > 1900) {
                    chunkedMessages.push(currentChunk);
                    currentChunk = '';
                }
                currentChunk += msg + '\n\n';
            }
            if (currentChunk) chunkedMessages.push(currentChunk);

            for (const chunk of chunkedMessages) {
                await sendDiscordNotification(webhookUrl, chunk);
            }
        }

        return NextResponse.json({
            success: true,
            newProblems: totalNewProblems,
            messagesSent: messages.length
        });

    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
