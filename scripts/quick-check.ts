/**
 * quick-check.ts — Local fallback script (used by .bat files)
 * 
 * Fetches all solved problems from all profiles in the DB
 * and posts them to a Discord webhook URL.
 * 
 * Usage:
 *   npx tsx scripts/quick-check.ts            ← today
 *   npx tsx scripts/quick-check.ts yesterday  ← yesterday
 *   npx tsx scripts/quick-check.ts 2026-03-01 ← specific date
 */

import readline from 'readline';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../lib/prisma';
import { fetchLeetCodeSubmissions } from '../lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../lib/platforms/codechef';
import { fetchSmartInterviewsSubmissions } from '../lib/platforms/smartinterviews';
import { fetchHackerRankSubmissions } from '../lib/platforms/hackerrank';

// ─── Timestamp helpers ────────────────────────────────────────────────────────

function getWindow(dateArg?: string): { start: number; end: number; label: string } {
    const istOffset = 5.5 * 60 * 60 * 1000;

    if (dateArg === 'yesterday') {
        const nowIST = Date.now() + istOffset;
        const yest = new Date(nowIST - 86400000);
        yest.setUTCHours(0, 0, 0, 0);
        const start = Math.floor((yest.getTime() - istOffset) / 1000);
        return { start, end: start + 86400, label: yest.toISOString().split('T')[0] };
    }

    if (dateArg && /^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
        const d = new Date(dateArg);
        d.setHours(0, 0, 0, 0);
        const start = Math.floor((d.getTime() - istOffset) / 1000);
        return { start, end: start + 86400, label: dateArg };
    }

    // Default: today IST
    const nowIST = Date.now() + istOffset;
    const today = new Date(nowIST);
    today.setUTCHours(0, 0, 0, 0);
    const start = Math.floor((today.getTime() - istOffset) / 1000);
    return { start, end: start + 86400, label: today.toISOString().split('T')[0] };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('❌ Set DISCORD_WEBHOOK_URL in your .env file first!');
        process.exit(1);
    }

    const dateArg = process.argv[2]; // 'yesterday', '2026-03-01', or undefined
    const { start, end, label } = getWindow(dateArg);

    console.log(`\n📅 Checking: ${label} (IST)`);
    console.log('─'.repeat(40));

    const profiles = await prisma.userProfile.findMany();

    if (profiles.length === 0) {
        console.log('No profiles found in DB. Add some with /add-profile on Discord first.');
        await prisma.$disconnect();
        return;
    }

    const links: string[] = [];
    const seen = new Set<string>();

    for (const profile of profiles) {
        console.log(`Fetching ${profile.platform}/${profile.username}...`);
        let submissions: any[] = [];

        try {
            if (profile.platform === 'LEETCODE') {
                submissions = await fetchLeetCodeSubmissions(profile.username);
            } else if (profile.platform === 'CODEFORCES') {
                submissions = await fetchCodeforcesSubmissions(profile.username);
            } else if (profile.platform === 'CODECHEF') {
                submissions = await fetchCodeChefSubmissions(profile.username);
            } else if (profile.platform === 'SMARTINTERVIEWS') {
                submissions = await fetchSmartInterviewsSubmissions(
                    profile.username,
                    profile.token ?? undefined
                );
            } else if (profile.platform === 'HACKERRANK') {
                submissions = await fetchHackerRankSubmissions(profile.username);
            }
        } catch (err: any) {
            console.error(`  ❌ Failed: ${err.message}`);
            continue;
        }

        for (const sub of submissions) {
            if (sub.timestamp < start || sub.timestamp >= end) continue;
            if (seen.has(sub.titleSlug)) continue;
            seen.add(sub.titleSlug);
            links.push(sub.url);
        }

        console.log(`  ✓ ${submissions.filter(s => s.timestamp >= start && s.timestamp < end).length} problem(s) found`);
    }

    console.log('─'.repeat(40));

    if (links.length === 0) {
        console.log(`📭 No problems solved on ${label}`);
        await prisma.$disconnect();
        return;
    }

    console.log(`📬 Posting ${links.length} links to Discord...`);

    // Chunk into webhook-safe messages (≤2000 chars each)
    const chunks: string[] = [];
    let current = `📅 **${label}** — ${links.length} problem(s):\n\n`;
    for (const link of links) {
        const line = `<${link}>\n\n`;
        if (current.length + line.length > 1900) {
            chunks.push(current.trim());
            current = '';
        }
        current += line;
    }
    if (current.trim()) chunks.push(current.trim());

    for (const chunk of chunks) {
        await axios.post(webhookUrl, { content: chunk });
    }

    console.log('✅ Done!');
    await prisma.$disconnect();
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
