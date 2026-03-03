/**
 * quick-check.ts — Local fallback script (used by .bat files)
 *
 * Reads platform profiles from .env (no database needed).
 * Set QUICK_CHECK_PROFILES in .env — no cloud DB or network setup required.
 *
 * Usage:
 *   npx tsx scripts/quick-check.ts            ← today (IST)
 *   npx tsx scripts/quick-check.ts yesterday  ← yesterday
 *   npx tsx scripts/quick-check.ts 2026-03-01 ← specific date
 */

import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { fetchLeetCodeSubmissions } from '../lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../lib/platforms/codechef';
import { fetchSmartInterviewsSubmissions } from '../lib/platforms/smartinterviews';
import { fetchHackerRankSubmissions } from '../lib/platforms/hackerrank';

// ─── Profile parser ───────────────────────────────────────────────────────────
// Format in .env:
//   QUICK_CHECK_PROFILES="LEETCODE:username|CODEFORCES:username|HACKERRANK:username|SMARTINTERVIEWS:username:jwt_token"

interface Profile {
    platform: string;
    username: string;
    token?: string;
}

function loadProfiles(): Profile[] {
    const raw = process.env.QUICK_CHECK_PROFILES;
    if (!raw) {
        console.error('❌ Set QUICK_CHECK_PROFILES in your .env file.');
        console.error('   Example:');
        console.error('   QUICK_CHECK_PROFILES="LEETCODE:yourname|CODEFORCES:yourname|HACKERRANK:yourname"');
        process.exit(1);
    }

    return raw.split('|').map(entry => {
        const parts = entry.trim().split(':');
        return {
            platform: parts[0].toUpperCase(),
            username: parts[1],
            token: parts[2], // optional, only for SmartInterviews
        };
    }).filter(p => p.platform && p.username);
}

// ─── Timestamp helpers ────────────────────────────────────────────────────────

function getWindow(dateArg?: string): { start: number; end: number; label: string } {
    const IST = 5.5 * 60 * 60 * 1000;

    if (dateArg === 'yesterday') {
        const nowIST = Date.now() + IST;
        const yest = new Date(nowIST - 86400000);
        yest.setUTCHours(0, 0, 0, 0);
        const start = Math.floor((yest.getTime() - IST) / 1000);
        return { start, end: start + 86400, label: yest.toISOString().split('T')[0] };
    }

    if (dateArg && /^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
        const d = new Date(dateArg); d.setHours(0, 0, 0, 0);
        const start = Math.floor((d.getTime() - IST) / 1000);
        return { start, end: start + 86400, label: dateArg };
    }

    const nowIST = Date.now() + IST;
    const today = new Date(nowIST);
    today.setUTCHours(0, 0, 0, 0);
    const start = Math.floor((today.getTime() - IST) / 1000);
    return { start, end: start + 86400, label: today.toISOString().split('T')[0] };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl.includes('your-webhook-url-here')) {
        console.error('❌ Set DISCORD_WEBHOOK_URL in your .env file!');
        process.exit(1);
    }

    const profiles = loadProfiles();
    const { start, end, label } = getWindow(process.argv[2]);

    console.log(`\n📅 Checking: ${label} (IST)`);
    console.log('─'.repeat(40));

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
                submissions = await fetchSmartInterviewsSubmissions(profile.username, profile.token);
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

        const solved = submissions.filter(s => s.timestamp >= start && s.timestamp < end).length;
        console.log(`  ✓ ${solved} problem(s)`);
    }

    console.log('─'.repeat(40));

    if (links.length === 0) {
        console.log(`📭 No problems solved on ${label}`);
        return;
    }

    console.log(`📬 Posting ${links.length} links to Discord...`);

    const chunks: string[] = [];
    let current = `📅 **${label}** — ${links.length} problem(s):\n\n`;
    for (const link of links) {
        const line = `<${link}>\n\n`;
        if (current.length + line.length > 1900) { chunks.push(current.trim()); current = ''; }
        current += line;
    }
    if (current.trim()) chunks.push(current.trim());

    for (const chunk of chunks) {
        await axios.post(webhookUrl, { content: chunk });
    }

    console.log('✅ Done!');
}

main().catch(err => { console.error('Fatal error:', err); });
