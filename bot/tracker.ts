/**
 * User-aware tracker: given a Discord user ID and a time window,
 * fetches submissions from all their registered platforms and returns
 * a flat list of problem URLs — exactly what the old bat scripts did.
 *
 * The existing lib/tracker-logic.ts is left completely untouched.
 */
import { prisma } from '../lib/prisma';
import { fetchLeetCodeSubmissions } from '../lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../lib/platforms/codechef';
import { fetchSmartInterviewsSubmissions } from '../lib/platforms/smartinterviews';
import { fetchHackerRankSubmissions } from '../lib/platforms/hackerrank';

export interface TrackerResult {
    links: string[]; // Flat list for general logic
    groupedLinks: Record<string, string[]>; // platform -> urls
    errors: string[];
}

export async function runTrackerForUser(
    discordUserId: string,
    startTimestamp: number,
    endTimestamp: number
): Promise<TrackerResult> {
    const flatLinks: string[] = [];
    const groupedLinks: Record<string, string[]> = {};
    const errors: string[] = [];

    const profiles = await prisma.userProfile.findMany({ where: { discordUserId } });

    if (profiles.length === 0) {
        return { links: [], groupedLinks: {}, errors: ['no_profiles'] };
    }

    for (const profile of profiles) {
        let submissions: any[] = [];
        const platformKey = profile.platform.toUpperCase();
        const links: string[] = [];

        try {
            if (profile.platform === 'LEETCODE') {
                submissions = await fetchLeetCodeSubmissions(profile.username);
            } else if (profile.platform === 'CODEFORCES') {
                submissions = await fetchCodeforcesSubmissions(profile.username);
            } else if (profile.platform === 'CODECHEF') {
                submissions = await fetchCodeChefSubmissions(profile.username);
            } else if (profile.platform === 'SMARTINTERVIEWS') {
                // Pass per-user token stored in DB; falls back to env var if null
                submissions = await fetchSmartInterviewsSubmissions(
                    profile.username,
                    profile.token ?? undefined
                );
            } else if (profile.platform === 'HACKERRANK') {
                submissions = await fetchHackerRankSubmissions(profile.username);
            }
        } catch (err: any) {
            console.error(`[Tracker] Failed ${profile.platform}/${profile.username}:`, err.message);
            errors.push(`${profile.platform}: fetch failed`);
            continue;
        }

        const seen = new Set<string>();

        for (const sub of submissions) {
            if (sub.timestamp < startTimestamp || sub.timestamp >= endTimestamp) continue;
            if (seen.has(sub.titleSlug)) continue;
            seen.add(sub.titleSlug);

            // Upsert to DB so re-checks don't inflate counts
            try {
                await prisma.solvedProblem.upsert({
                    where: {
                        discordUserId_platform_problemId: {
                            discordUserId,
                            platform: profile.platform,
                            problemId: sub.id,
                        },
                    },
                    update: {},
                    create: {
                        discordUserId,
                        platform: profile.platform,
                        problemId: sub.id,
                        title: sub.title,
                        solvedAt: new Date(sub.timestamp * 1000),
                    },
                });
            } catch (_) {
                // Ignore — problem was already stored from a previous check
            }

            links.push(sub.url);
        }

        if (links.length > 0) {
            flatLinks.push(...links);
            groupedLinks[platformKey] = (groupedLinks[platformKey] || []).concat(links);
        }
    }

    return { links: flatLinks, groupedLinks, errors };
}

/** Converts a date param ("yesterday", "YYYY-MM-DD", or null/today) into IST-aligned Unix timestamps */
export function getTimestampsForDate(dateParam?: string | null): {
    startTimestamp: number;
    endTimestamp: number;
    dateStr: string;
    warning?: string; // Set if the user provided an invalid format
} {
    const istOffset = 5.5 * 60 * 60 * 1000;

    // Helper: get today's window
    function todayWindow() {
        const nowIST = Date.now() + istOffset;
        const dayStart = new Date(nowIST);
        dayStart.setUTCHours(0, 0, 0, 0);
        const startTimestamp = Math.floor((dayStart.getTime() - istOffset) / 1000);
        const dateStr = dayStart.toISOString().split('T')[0];
        return { startTimestamp, endTimestamp: startTimestamp + 86400, dateStr };
    }

    if (!dateParam || dateParam === 'today') {
        return todayWindow();
    }

    if (dateParam === 'yesterday') {
        const nowIST = Date.now() + istOffset;
        const yesterdayIST = new Date(nowIST - 86400000);
        yesterdayIST.setUTCHours(0, 0, 0, 0);
        const startTimestamp = Math.floor((yesterdayIST.getTime() - istOffset) / 1000);
        const dateStr = yesterdayIST.toISOString().split('T')[0];
        return { startTimestamp, endTimestamp: startTimestamp + 86400, dateStr };
    }

    // Must be YYYY-MM-DD format 
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        const target = new Date(dateParam + 'T00:00:00Z'); // Parse as UTC midnight
        if (!isNaN(target.getTime())) {
            // Treat the YYYY-MM-DD as an IST calendar day
            const startTimestamp = Math.floor((target.getTime() - istOffset) / 1000);
            return { startTimestamp, endTimestamp: startTimestamp + 86400, dateStr: dateParam };
        }
    }

    // Invalid format — fall back to today with a warning
    const today = todayWindow();
    return {
        ...today,
        warning: `⚠️ \"${dateParam}\" is not a valid date format. Use **YYYY-MM-DD** (e.g. \`2026-03-25\`). Showing **today** instead.`,
    };
}

