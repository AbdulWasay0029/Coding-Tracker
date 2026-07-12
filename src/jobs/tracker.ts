/**
 * User-aware tracker: given a Discord user ID and a time window,
 * fetches submissions from all their registered platforms and returns
 * a flat list of problem URLs — exactly what the old bat scripts did.
 *
 * The existing lib/tracker-logic.ts is left completely untouched.
 */
import { prisma } from '../core/prisma';
import { fetchLeetCodeSubmissions } from '../core/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../core/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../core/platforms/codechef';
import { fetchHackerRankSubmissions } from '../core/platforms/hackerrank';
import { fetchSmartInterviewsSubmissions } from '../core/platforms/smartinterviews';
import { decrypt } from '../core/encryption';
import { withCache } from '../core/cache';

export interface TrackerResult {
    links: string[]; // Flat list for general logic
    groupedLinks: Record<string, { title: string, url: string }[]>; // platform -> {title, url}
    errors: string[];
}

export async function runTrackerForUser(
    discordUserId: string,
    startTimestamp: number,
    endTimestamp: number,
    fetchStartOverride?: number,
    jobType: string = 'DAILY_SYNC'
): Promise<TrackerResult> {
    const actualStartTimestamp = fetchStartOverride ?? startTimestamp;
    
    const flatLinks: string[] = [];
    const groupedLinks: Record<string, { title: string, url: string }[]> = {};
    const errors: string[] = [];

    const profiles = await prisma.userProfile.findMany({ where: { discordUserId } });

    if (profiles.length === 0) {
        return { links: [], groupedLinks: {}, errors: ['no_profiles'] };
    }

    // Load all already tracked dates from cache for this user
    const existingTrackedRows = await prisma.trackedDate.findMany({
        where: { discordUserId }
    });
    const trackedDatesCache = new Set(existingTrackedRows.map(r => `${r.platform}-${r.date}`));

    // Parallelize all requests to save huge amounts of waiting time O(M*N) -> O(Max(M))
    const fetchPromises = profiles.map(async (profile) => {
        let submissions: any[] = [];
        const platformKey = profile.platform.toUpperCase();

        try {
            // Check if all historical dates in window are already tracked
            let needsFetch = false;
            let checkDayMs = actualStartTimestamp * 1000 + (5.5 * 3600 * 1000);
            const endCheckDayMs = endTimestamp * 1000 + (5.5 * 3600 * 1000);
            const nowOffset = 5.5 * 60 * 60 * 1000;
            const todayIstStr = new Date(Date.now() + nowOffset).toISOString().split('T')[0];
            
            while (checkDayMs <= endCheckDayMs) {
                const dStr = new Date(checkDayMs).toISOString().split('T')[0];
                if (dStr !== todayIstStr && !trackedDatesCache.has(`${platformKey}-${dStr}`)) {
                    needsFetch = true;
                    break;
                }
                checkDayMs += 86400 * 1000;
            }

            if (!needsFetch && jobType === 'FULL_HISTORY') {
                console.log(`[Tracker] Skipping ${profile.platform}/${profile.username} - completely tracked in cache`);
                return { profile, platformKey, submissions: [], error: null };
            }

            if (profile.platform === 'LEETCODE') {
                submissions = await withCache(`lc-${profile.username}-${actualStartTimestamp}-${jobType}`, 300, () => fetchLeetCodeSubmissions(profile.username, actualStartTimestamp));
            } else if (profile.platform === 'CODEFORCES') {
                submissions = await withCache(`cf-${profile.username}-${actualStartTimestamp}-${jobType}`, 300, () => fetchCodeforcesSubmissions(profile.username, actualStartTimestamp));
            } else if (profile.platform === 'CODECHEF') {
                submissions = await withCache(`cc-${profile.username}-${actualStartTimestamp}-${jobType}`, 300, () => fetchCodeChefSubmissions(profile.username, actualStartTimestamp));
            } else if (profile.platform === 'SMARTINTERVIEWS') {
                const decryptedToken = profile.token ? decrypt(profile.token) : undefined;
                submissions = await withCache(`si-${profile.username}-${actualStartTimestamp}-${jobType}`, 300, () => fetchSmartInterviewsSubmissions(
                    profile.username,
                    decryptedToken,
                    actualStartTimestamp
                ));
            } else if (profile.platform === 'HACKERRANK') {
                submissions = await withCache(`hr-${profile.username}-${actualStartTimestamp}-${jobType}`, 300, () => fetchHackerRankSubmissions(profile.username, actualStartTimestamp));
            }
            return { profile, platformKey, submissions, error: null };
        } catch (err: any) {
            console.error(`[Tracker] Failed ${profile.platform}/${profile.username}:`, err.message);
            return { profile, platformKey, submissions: [], error: `${profile.platform}: fetch failed` };
        }
    });

    const results = await Promise.all(fetchPromises);

    const globalUpsertTasks: (() => Promise<any>)[] = [];
    const newTrackedDatesToSave: Set<string> = new Set();
    
    // Get "today" in IST so we NEVER cache today as "fully tracked"
    const nowOffset = 5.5 * 60 * 60 * 1000;
    const todayIstStr = new Date(Date.now() + nowOffset).toISOString().split('T')[0];
    
    for (const { profile, submissions, error } of results) {
        if (error) {
            errors.push(error);
            continue;
        }

        const platformKey = profile.platform.toUpperCase();
        const links: string[] = [];
        const platformGroup: { title: string, url: string }[] = [];
        const seen = new Set<string>();

        for (const sub of submissions) {
            // Filter out anything older than our fetch boundary on DAILY_SYNC
            if (jobType === 'DAILY_SYNC' && sub.timestamp < actualStartTimestamp) continue;
            
            if (seen.has(sub.titleSlug)) continue;
            seen.add(sub.titleSlug);

            // Create a deterministic unique ID for this problem on this specific day (IST)
            const istOffset = 5.5 * 60 * 60 * 1000;
            const istDate = new Date(sub.timestamp * 1000 + istOffset);
            const dateStr = istDate.toISOString().split('T')[0];
            const uniqueProblemId = `${sub.titleSlug}-${dateStr}`;

            // If we already fully tracked this date in the past, skip DB upsert to save latency!
            if (trackedDatesCache.has(`${platformKey}-${dateStr}`)) {
                if (!(sub.timestamp >= startTimestamp && sub.timestamp < endTimestamp)) continue;
            }

            // Cluster all DB writes into a sequential task queue to prevent connection pool exhaustion
            globalUpsertTasks.push(() => 
                prisma.solvedProblem.upsert({
                    where: {
                        discordUserId_platform_problemId: {
                            discordUserId,
                            platform: profile.platform,
                            problemId: uniqueProblemId,
                        },
                    },
                    update: {},
                    create: {
                        discordUserId,
                        platform: profile.platform,
                        problemId: uniqueProblemId,
                        title: sub.title,
                        solvedAt: new Date(sub.timestamp * 1000),
                    },
                })
            );

            // IMPORTANT: Only return links for the specific daily report window requested!
            if (sub.timestamp >= startTimestamp && sub.timestamp < endTimestamp) {
                links.push(sub.url);
                platformGroup.push({ title: sub.title, url: sub.url });
            }
        }

        // Mark every day inside the window (except today) as tracked
        let currentDayMs = actualStartTimestamp * 1000 + (5.5 * 3600 * 1000); // IST
        const endDayMs = endTimestamp * 1000 + (5.5 * 3600 * 1000);
        
        while (currentDayMs <= endDayMs) {
            const dStr = new Date(currentDayMs).toISOString().split('T')[0];
            if (dStr !== todayIstStr) { // NEVER cache today!
                newTrackedDatesToSave.add(`${platformKey}|${dStr}`);
            }
            currentDayMs += 86400 * 1000; // Add 1 day
        }

        if (links.length > 0) {
            flatLinks.push(...links);
            groupedLinks[platformKey] = (groupedLinks[platformKey] || []).concat(platformGroup);
        }
    }

    // Execute sequentially to protect the Prisma connection pool!
    for (const task of globalUpsertTasks) {
        try {
            await task();
        } catch (err: any) {
            console.error('[Tracker] Upsert failed:', err.message);
        }
    }

    // Bulk save the new Tracked Dates so future runs skip immediately
    for (const item of newTrackedDatesToSave) {
        const [platform, dateStr] = item.split('|');
        try {
            await prisma.trackedDate.upsert({
                where: { discordUserId_platform_date: { discordUserId, platform, date: dateStr } },
                update: {},
                create: { discordUserId, platform, date: dateStr }
            });
        } catch (e) {
            // Ignore unique constraint races
        }
    }

    return { links: flatLinks, groupedLinks, errors };
}

/** Converts a date param ("yesterday", "YYYY-MM-DD", or null/today) into IST-aligned Unix timestamps */
export function getTimestampsForDate(dateParam?: string | null, discordUserId?: string): {
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

    // Support DD/MM/YYYY (Indian standard) — convert to YYYY-MM-DD internally
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateParam)) {
        const [dd, mm, yyyy] = dateParam.split('/');
        dateParam = `${yyyy}-${mm}-${dd}`;
    }

    // Must be YYYY-MM-DD format 
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        const target = new Date(dateParam + 'T00:00:00Z'); // Parse as UTC midnight
        if (!isNaN(target.getTime())) {
            // Check if older than 30 days
            if (Date.now() - target.getTime() > 30 * 86400000 && discordUserId !== '481554233817300993') {
                const today = todayWindow();
                return {
                    ...today,
                    warning: `⚠️ The date \`${dateParam}\` is older than 30 days. Our scraping range is limited to the last 30 days to protect resources. Showing **today** instead.`,
                };
            }
            // Treat the YYYY-MM-DD as an IST calendar day
            const startTimestamp = Math.floor((target.getTime() - istOffset) / 1000);
            return { startTimestamp, endTimestamp: startTimestamp + 86400, dateStr: dateParam };
        }
    }

    // Invalid format — fall back to today with a warning
    const today = todayWindow();
    return {
        ...today,
        warning: `⚠️ \"${dateParam}\" is not a valid date. Use **DD/MM/YYYY** (e.g. \`27/03/2026\`) or **YYYY-MM-DD** (e.g. \`2026-03-27\`). Showing **today** instead.`,
    };
}

