/**
 * github-tracker.ts — Automated nightly tracker for GitHub Actions
 *
 * Reads ALL student profiles from the database.
 * Fetches today's solved problems for each student.
 * Posts a single clean embed to the Discord webhook.
 *
 * Runs every night at 9PM IST via .github/workflows/daily-tracker.yml
 * No manual intervention needed.
 */

import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '../lib/encryption';

import { fetchLeetCodeSubmissions } from '../lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../lib/platforms/codechef';
import { fetchSmartInterviewsSubmissions } from '../lib/platforms/smartinterviews';
import { fetchHackerRankSubmissions } from '../lib/platforms/hackerrank';

const prisma = new PrismaClient();

// ─── Platform config ─────────────────────────────────────────────────────────

const PLATFORM_EMOJI: Record<string, string> = {
    LEETCODE: '🟡',
    CODEFORCES: '🔵',
    CODECHEF: '🟤',
    HACKERRANK: '🟢',
    SMARTINTERVIEWS: '🟣',
};

const PLATFORM_NAMES: Record<string, string> = {
    LEETCODE: 'LeetCode',
    CODEFORCES: 'Codeforces',
    CODECHEF: 'CodeChef',
    HACKERRANK: 'HackerRank',
    SMARTINTERVIEWS: 'SmartInterviews',
};

// ─── Date window (today in IST) ───────────────────────────────────────────────

function getTodayWindow(): { start: number; end: number; label: string } {
    const IST = 5.5 * 60 * 60 * 1000;
    const nowIST = Date.now() + IST;
    const today = new Date(nowIST);
    today.setUTCHours(0, 0, 0, 0);
    const start = Math.floor((today.getTime() - IST) / 1000);
    const label = today.toISOString().split('T')[0];
    return { start, end: start + 86400, label };
}

// ─── Fetch for one platform ───────────────────────────────────────────────────

async function fetchLinks(
    platform: string,
    username: string,
    token: string | null,
    start: number,
    end: number
): Promise<string[]> {
    let submissions: any[] = [];

    if (platform === 'LEETCODE') {
        submissions = await fetchLeetCodeSubmissions(username);
    } else if (platform === 'CODEFORCES') {
        submissions = await fetchCodeforcesSubmissions(username);
    } else if (platform === 'CODECHEF') {
        submissions = await fetchCodeChefSubmissions(username);
    } else if (platform === 'SMARTINTERVIEWS') {
        submissions = await fetchSmartInterviewsSubmissions(username, token ?? undefined);
    } else if (platform === 'HACKERRANK') {
        submissions = await fetchHackerRankSubmissions(username);
    }

    const seen = new Set<string>();
    const links: string[] = [];

    for (const sub of submissions) {
        if (sub.timestamp < start || sub.timestamp >= end) continue;
        if (seen.has(sub.titleSlug)) continue;
        seen.add(sub.titleSlug);
        links.push(sub.url);
    }

    return links;
}

// ─── Post to Discord (chunked to respect 2000 char limit) ────────────────────

async function postToDiscord(webhookUrl: string, content: string): Promise<void> {
    const chunks: string[] = [];
    let current = '';

    for (const line of content.split('\n')) {
        if (current.length + line.length + 1 > 1900) {
            chunks.push(current.trim());
            current = '';
        }
        current += line + '\n';
    }
    if (current.trim()) chunks.push(current.trim());

    for (const chunk of chunks) {
        await axios.post(webhookUrl, { content: chunk });
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('❌ DISCORD_WEBHOOK_URL not set');
        process.exit(1);
    }

    const { start, end, label } = getTodayWindow();
    console.log(`📅 Running tracker for: ${label}`);

    // Get all unique Discord users who have profiles
    const allProfiles = await prisma.userProfile.findMany({
        orderBy: { discordUserId: 'asc' },
    });

    if (allProfiles.length === 0) {
        console.log('ℹ️  No profiles in database. Nothing to post.');
        await prisma.$disconnect();
        return;
    }

    // Group by Discord user
    const byUser = new Map<string, typeof allProfiles>();
    for (const p of allProfiles) {
        if (!byUser.has(p.discordUserId)) byUser.set(p.discordUserId, []);
        byUser.get(p.discordUserId)!.push(p);
    }

    console.log(`👥 Found ${byUser.size} student(s)`);

    const lines: string[] = [];
    lines.push(`📅 **Daily Links — ${label}**\n`);

    let totalLinks = 0;
    let studentsWithLinks = 0;

    for (const [discordUserId, profiles] of byUser) {
        const userLines: string[] = [];

        for (const profile of profiles) {
            try {
                const links = await fetchLinks(
                    profile.platform,
                    profile.username,
                    profile.token ? decrypt(profile.token) : null,
                    start,
                    end
                );

                if (links.length > 0) {
                    const emoji = PLATFORM_EMOJI[profile.platform] || '⚪';
                    const name = PLATFORM_NAMES[profile.platform] || profile.platform;
                    userLines.push(`  ${emoji} **${name}**:\n    ${links.map(l => `<${l}>`).join('\n    ')}`);
                    totalLinks += links.length;
                }
            } catch (err: any) {
                console.log(`  ⚠️  ${profile.platform} for ${profile.username}: ${err.message}`);
            }
        }

        if (userLines.length > 0) {
            lines.push(`👤 <@${discordUserId}>`);
            lines.push(...userLines);
            lines.push('');
            studentsWithLinks++;
        }

        // Anti-Rate-Limit padding (Don't hammer APIs all at once)
        await new Promise(r => setTimeout(r, 600));
    }

    if (studentsWithLinks === 0) {
        lines.push('📭 No problems solved today. Get coding! 💪');
    } else {
        lines.push(`\n✅ ${studentsWithLinks} student(s) · ${totalLinks} problem(s) solved today`);
    }

    const message = lines.join('\n');
    console.log(`📬 Posting to Discord (${totalLinks} links from ${studentsWithLinks} students)...`);
    await postToDiscord(webhookUrl, message);

    await prisma.analyticsEvent.create({
        data: {
            discordUserId: 'SYSTEM',
            command: 'github-tracker',
            metadata: JSON.stringify({ studentsWithLinks, totalLinks })
        }
    });

    console.log('✅ Done!');

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error('❌ Fatal error:', err.message);
    await prisma.$disconnect();
    process.exit(1);
});
