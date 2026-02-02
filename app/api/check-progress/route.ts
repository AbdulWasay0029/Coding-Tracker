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

        // Get start of today in IST (UTC+5:30)
        const now = new Date();
        // IST offset is +5.5 hours, so we add it to get IST time, then floor it, then subtract it back to compare timestamps?
        // Easier: Get current time in IST, set hours to 0, get timestamp.

        // Create a date object for the current time
        const dateInIst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        dateInIst.setHours(0, 0, 0, 0);

        // This dateInIst is "00:00 IST" but represents that abstract time. 
        // We need the timestamp of that moment in UTC.
        // We can do this by creating a Date object with these components relative to IST.
        // But simpler: just use the offset.

        // Let's use a robust method:
        const istOffset = 5.5 * 60 * 60 * 1000;
        const nowUTC = now.getTime();
        const nowIST = nowUTC + istOffset;

        const todayStartIST = new Date(nowIST);
        todayStartIST.setUTCHours(0, 0, 0, 0);

        // Subtract offset to get back to UTC timestamp for that IST moment
        const startOfDayTimestamp = Math.floor((todayStartIST.getTime() - istOffset) / 1000);

        for (const profile of profiles) {
            let submissions: any[] = [];

            if (profile.platform === 'LEETCODE') {
                submissions = await fetchLeetCodeSubmissions(profile.username);
            } else if (profile.platform === 'CODEFORCES') {
                submissions = await fetchCodeforcesSubmissions(profile.username);
            } else if (profile.platform === 'CODECHEF') {
                submissions = await fetchCodeChefSubmissions(profile.username);
            }

            // Track unique problems for this run to avoid duplicates in the same message
            const seenForProfile = new Set();

            // Filter for today's problems
            for (const sub of submissions) {
                // Filter: Check if solved today (IST)
                if (sub.timestamp < startOfDayTimestamp) {
                    continue;
                }

                // Deduplicate within this run: if we already saw this problem in the fetch list
                // (e.g. multiple subms for same problem today), skip.
                // Use titleSlug or ID for uniqueness
                if (seenForProfile.has(sub.titleSlug)) {
                    continue;
                }
                seenForProfile.add(sub.titleSlug);

                // Database: Try to save, but update if exists (though created check is fine)
                try {
                    await prisma.solvedProblem.upsert({
                        where: {
                            platform_problemId: {
                                platform: profile.platform,
                                problemId: sub.id,
                            }
                        },
                        update: {}, // Do nothing if exists
                        create: {
                            platform: profile.platform,
                            problemId: sub.id,
                            title: sub.title,
                            solvedAt: new Date(sub.timestamp * 1000),
                        }
                    });
                    totalNewProblems++;

                } catch (e) {
                    // Ignore DB errors
                }

                // Notification: ADD REGARDLESS OF EXISTENCE in DB (User Request)
                // But avoid adding duplicates globally in this message list if needed.
                // Actually user said "links of solved problems", usually list is fine.
                messages.push(sub.url);
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
