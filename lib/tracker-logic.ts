import { prisma } from './prisma';
import { fetchLeetCodeSubmissions } from './platforms/leetcode';
import { fetchCodeforcesSubmissions } from './platforms/codeforces';
import { fetchCodeChefSubmissions } from './platforms/codechef';
import { fetchSmartInterviewsSubmissions } from './platforms/smartinterviews';
import { sendDiscordNotification } from './discord';

export async function checkAndNotifyProgress(startTimestamp: number, endTimestamp: number) {
    try {
        const config = await prisma.globalConfig.findUnique({ where: { id: 'config' } });
        const webhookUrl = config?.discordWebhookUrl;

        if (!webhookUrl) {
            return { success: false, message: 'No Webhook URL configured' };
        }

        const profiles = await prisma.userProfile.findMany();
        let totalNewProblems = 0;
        const messages: string[] = [];

        console.log(`[Tracker] Checking progress from ${new Date(startTimestamp * 1000).toISOString()} to ${new Date(endTimestamp * 1000).toISOString()}`);

        for (const profile of profiles) {
            let submissions: any[] = [];
            console.log(`[Tracker] Fetching ${profile.platform} for ${profile.username}...`);

            try {
                if (profile.platform === 'LEETCODE') {
                    submissions = await fetchLeetCodeSubmissions(profile.username);
                } else if (profile.platform === 'CODEFORCES') {
                    submissions = await fetchCodeforcesSubmissions(profile.username);
                } else if (profile.platform === 'CODECHEF') {
                    submissions = await fetchCodeChefSubmissions(profile.username);
                } else if (profile.platform === 'SMARTINTERVIEWS') {
                    submissions = await fetchSmartInterviewsSubmissions(profile.username);
                }
            } catch (err) {
                console.error(`[Tracker] Failed to fetch ${profile.platform}:`, err);
                continue;
            }

            // Track unique problems for this run to avoid duplicates in the same message
            const seenForProfile = new Set();

            // Filter for selected date range
            for (const sub of submissions) {
                // Filter: Check if solved within the target window
                if (sub.timestamp < startTimestamp || sub.timestamp >= endTimestamp) {
                    continue;
                }

                // Deduplicate within this run
                if (seenForProfile.has(sub.titleSlug)) {
                    continue;
                }
                seenForProfile.add(sub.titleSlug);

                // Database: Upsert
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

                messages.push(sub.url);
            }
        }

        if (messages.length > 0) {
            // Chunk messages
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

        return {
            success: true,
            newProblems: totalNewProblems,
            messagesSent: messages.length
        };

    } catch (error: any) {
        console.error('Tracker error:', error);
        return { success: false, error: error.message };
    }
}
