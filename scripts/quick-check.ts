/**
 * quick-check.ts — Local fallback script (used by .bat files)
 *
 * Reads platform profiles from a local config.json file.
 */

import path from 'path';
import axios from 'axios';
import fs from 'fs';

import { fetchLeetCodeSubmissions } from '../lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../lib/platforms/codechef';
import { fetchSmartInterviewsSubmissions } from '../lib/platforms/smartinterviews';
import { fetchHackerRankSubmissions } from '../lib/platforms/hackerrank';

// ─── Profile & Config parser ──────────────────────────────────────────────────

interface Profile {
    platform: string;
    username: string;
    token?: string;
}

interface Config {
    discord_webhook_url: string;
    profiles: Profile[];
}

const CONFIG_PATH = path.resolve(__dirname, '../config.json');

function loadConfig(): Config {
    if (!fs.existsSync(CONFIG_PATH)) {
        const template: Config = {
            discord_webhook_url: "PASTE_YOUR_DISCORD_WEBHOOK_URL_HERE",
            profiles: [
                { platform: "LEETCODE", username: "your_leetcode_username" },
                { platform: "CODEFORCES", username: "your_codeforces_username" },
                { platform: "CODECHEF", username: "your_codechef_username" },
                { platform: "HACKERRANK", username: "your_hackerrank_username" },
                { platform: "SMARTINTERVIEWS", username: "your_username", token: "your_jwt_token_here_if_using" }
            ]
        };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(template, null, 4));
        console.error('❌ No config.json found!');
        console.error('✅ I just created a new "config.json" file for you in the main folder.');
        console.error('👉 Please open "config.json", paste your Discord Webhook URL and usernames, then run this .bat script again.');
        process.exit(1);
    }

    try {
        const fileData = fs.readFileSync(CONFIG_PATH, 'utf-8');
        return JSON.parse(fileData) as Config;
    } catch (err) {
        console.error('❌ Failed to read config.json. Make sure you did not break the JSON format!');
        process.exit(1);
    }
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
    const config = loadConfig();
    const webhookUrl = config.discord_webhook_url;
    
    if (!webhookUrl || webhookUrl.includes('PASTE_YOUR_DISCORD_WEBHOOK_URL_HERE')) {
        console.error('❌ You forgot to set your discord_webhook_url in config.json!');
        process.exit(1);
    }

    const profiles = config.profiles.filter(p => !p.username.includes('your_'));
    const { start, end, label } = getWindow(process.argv[2]);

    console.log(`\n📅 Checking: ${label} (IST)`);
    console.log('─'.repeat(40));

    const links: string[] = [];
    const seen = new Set<string>();

    for (const profile of profiles) {
        console.log(`Fetching ${profile.platform}/${profile.username}...`);
        let submissions: any[] = [];

        try {
            const platformUpper = profile.platform.toUpperCase();
            if (platformUpper === 'LEETCODE') {
                submissions = await fetchLeetCodeSubmissions(profile.username);
            } else if (platformUpper === 'CODEFORCES') {
                submissions = await fetchCodeforcesSubmissions(profile.username);
            } else if (platformUpper === 'CODECHEF') {
                submissions = await fetchCodeChefSubmissions(profile.username);
            } else if (platformUpper === 'SMARTINTERVIEWS') {
                submissions = await fetchSmartInterviewsSubmissions(profile.username, profile.token);
            } else if (platformUpper === 'HACKERRANK') {
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
        process.exit(0);
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
