/**
 * quick-check.ts — Standalone problem link fetcher
 *
 * Discord-INDEPENDENT. Outputs links to console + clipboard.
 * Discord webhook posting is optional.
 *
 * Usage:
 *   npx tsx scripts/quick-check.ts              → today
 *   npx tsx scripts/quick-check.ts yesterday    → yesterday
 *   npx tsx scripts/quick-check.ts 2026-03-25   → specific date
 *   (no args = interactive date menu)
 */

import path from 'path';
import fs from 'fs';
import * as readline from 'readline';
import { execSync } from 'child_process';
import axios from 'axios';

import { fetchLeetCodeSubmissions } from '../lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../lib/platforms/codechef';
import { fetchSmartInterviewsSubmissions } from '../lib/platforms/smartinterviews';
import { fetchHackerRankSubmissions } from '../lib/platforms/hackerrank';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
    platform: string;
    username: string;
    token?: string;
}

interface Config {
    discord_webhook_url: string | null;
    profiles: Profile[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONFIG_PATH = path.resolve(__dirname, '../config.json');

const PLATFORM_NAMES: Record<string, string> = {
    LEETCODE: 'LeetCode',
    CODEFORCES: 'Codeforces',
    CODECHEF: 'CodeChef',
    HACKERRANK: 'HackerRank',
    SMARTINTERVIEWS: 'SmartInterviews',
};

const PLATFORM_EMOJI: Record<string, string> = {
    LEETCODE: '🟡',
    CODEFORCES: '🔵',
    CODECHEF: '🟤',
    HACKERRANK: '🟢',
    SMARTINTERVIEWS: '🟣',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clearLine() {
    process.stdout.write('\r\x1b[K');
}

function printBanner() {
    console.log('');
    console.log('  ╔═══════════════════════════════════════╗');
    console.log('  ║     CodeSync — Problem Link Fetcher   ║');
    console.log('  ╚═══════════════════════════════════════╝');
    console.log('');
}

function printSeparator() {
    console.log('  ═══════════════════════════════════════');
}

function copyToClipboard(text: string): boolean {
    try {
        execSync('clip', { input: text, encoding: 'utf-8' });
        return true;
    } catch {
        // clip.exe not available (non-Windows or restricted)
        return false;
    }
}

// ─── Interactive Setup Wizard ─────────────────────────────────────────────────

async function runSetupWizard(): Promise<Config> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q: string): Promise<string> =>
        new Promise((resolve) => rl.question(q, (answer) => resolve(answer.trim())));

    console.log('  No config found! Let\'s set you up.');
    console.log('  (This only happens once)\n');

    const platformList = [
        { name: 'LeetCode', key: 'LEETCODE' },
        { name: 'Codeforces', key: 'CODEFORCES' },
        { name: 'CodeChef', key: 'CODECHEF' },
        { name: 'HackerRank', key: 'HACKERRANK' },
        { name: 'SmartInterviews', key: 'SMARTINTERVIEWS' },
    ];

    const profiles: Profile[] = [];
    const addedPlatforms = new Set<string>();

    console.log('  Which platforms do you use?\n');

    let adding = true;
    while (adding) {
        // Show available platforms (skip already added)
        const available = platformList.filter(p => !addedPlatforms.has(p.key));

        if (available.length === 0) {
            console.log('  All platforms added!\n');
            break;
        }

        available.forEach((p, i) => {
            const emoji = PLATFORM_EMOJI[p.key] || '⚪';
            console.log(`    ${i + 1}. ${emoji} ${p.name}`);
        });
        console.log(`    ${available.length + 1}. ✅ Done — I've added all I need\n`);

        const choice = await ask('  Enter number: ');
        const idx = parseInt(choice) - 1;

        if (idx === available.length || choice.toLowerCase() === 'done') {
            adding = false;
            continue;
        }

        if (isNaN(idx) || idx < 0 || idx >= available.length) {
            console.log('  ❌ Invalid choice. Try again.\n');
            continue;
        }

        const platform = available[idx];
        const username = await ask(`  Your ${platform.name} username: `);

        if (!username) {
            console.log('  ❌ Username cannot be empty.\n');
            continue;
        }

        let token: string | undefined;

        if (platform.key === 'SMARTINTERVIEWS') {
            console.log('');
            console.log('  ┌────────────────────────────────────────────────┐');
            console.log('  │  SmartInterviews requires an auth token.       │');
            console.log('  │                                                │');
            console.log('  │  How to get it:                                │');
            console.log('  │  1. Login to hive.smartinterviews.in           │');
            console.log('  │  2. Press F12 → go to Network tab             │');
            console.log('  │  3. Reload the page / click anything           │');
            console.log('  │  4. Click any request → look at Headers       │');
            console.log('  │  5. Find "authorization" header               │');
            console.log('  │  6. Copy the value AFTER "Token "             │');
            console.log('  │     (don\'t include the word "Token ")         │');
            console.log('  └────────────────────────────────────────────────┘');
            console.log('');

            token = await ask('  Paste your token (or press Enter to skip): ');
            if (!token) {
                console.log('  ⚠️  No token provided. SmartInterviews won\'t be tracked.');
                console.log('     You can add it later by editing config.json.\n');
                continue; // Don't add the profile without token
            }
        }

        profiles.push({
            platform: platform.key,
            username,
            ...(token ? { token } : {}),
        });
        addedPlatforms.add(platform.key);

        const emoji = PLATFORM_EMOJI[platform.key] || '⚪';
        console.log(`  ${emoji} ✅ Added ${platform.name} → ${username}\n`);
    }

    if (profiles.length === 0) {
        console.log('  ⚠️  No platforms added. You can re-run this to set up.');
        console.log('     Or manually edit config.json.\n');
        rl.close();
        process.exit(0);
    }

    // Optional Discord webhook
    console.log('');
    printSeparator();
    console.log('');
    console.log('  Optional: Also post links to a Discord channel?');
    console.log('  (Get webhook URL from: Server Settings → Integrations → Webhooks)\n');
    const webhook = await ask('  Paste webhook URL (or press Enter to skip): ');

    rl.close();

    const config: Config = {
        discord_webhook_url: webhook || null,
        profiles,
    };

    // Save config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    console.log('\n  ✅ Config saved to config.json');
    console.log('  ✅ Setup complete!\n');

    return config;
}

// ─── Config Loader ────────────────────────────────────────────────────────────

function isConfigValid(config: any): config is Config {
    if (!config || !Array.isArray(config.profiles)) return false;
    if (config.profiles.length === 0) return false;

    // Check if all profiles still have placeholder usernames
    const realProfiles = config.profiles.filter(
        (p: any) => p.username && !p.username.includes('your_')
    );
    return realProfiles.length > 0;
}

async function loadOrCreateConfig(): Promise<Config> {
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
            const parsed = JSON.parse(raw);

            if (isConfigValid(parsed)) {
                // Normalize webhook field
                if (
                    parsed.discord_webhook_url &&
                    parsed.discord_webhook_url.includes('PASTE_YOUR')
                ) {
                    parsed.discord_webhook_url = null;
                }
                return parsed as Config;
            }

            // Config exists but invalid/empty — re-run wizard
            console.log('  ⚠️  Config found but no valid profiles. Let\'s fix that.\n');
        } catch {
            console.log('  ⚠️  Config file is corrupted. Let\'s start fresh.\n');
        }
    }

    return await runSetupWizard();
}

// ─── Date Handling ────────────────────────────────────────────────────────────

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
        const d = new Date(dateArg);
        d.setHours(0, 0, 0, 0);
        const start = Math.floor((d.getTime() - IST) / 1000);
        return { start, end: start + 86400, label: dateArg };
    }

    // Default: today
    const nowIST = Date.now() + IST;
    const today = new Date(nowIST);
    today.setUTCHours(0, 0, 0, 0);
    const start = Math.floor((today.getTime() - IST) / 1000);
    return { start, end: start + 86400, label: today.toISOString().split('T')[0] };
}

async function askForDate(): Promise<string | undefined> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q: string): Promise<string> =>
        new Promise((resolve) => rl.question(q, (answer) => resolve(answer.trim())));

    console.log('  📅 What do you want to check?\n');
    console.log('    1. Today');
    console.log('    2. Yesterday');
    console.log('    3. Enter a custom date (YYYY-MM-DD)\n');

    const choice = await ask('  Enter choice (or press Enter for today): ');
    rl.close();

    if (!choice || choice === '1') return undefined; // today
    if (choice === '2') return 'yesterday';
    if (choice === '3' || /^\d{4}-\d{2}-\d{2}$/.test(choice)) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(choice)) return choice;
        // Need to ask for the date
        const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ask2 = (q: string): Promise<string> =>
            new Promise((resolve) => rl2.question(q, (answer) => resolve(answer.trim())));
        const date = await ask2('  Enter date (YYYY-MM-DD): ');
        rl2.close();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            console.log('  ❌ Invalid date format. Using today instead.\n');
            return undefined;
        }
        return date;
    }

    console.log('  ❌ Invalid choice. Using today.\n');
    return undefined;
}

// ─── Fetching ─────────────────────────────────────────────────────────────────

interface PlatformResult {
    platform: string;
    links: string[];
    error?: string;
}

async function fetchAllLinks(
    profiles: Profile[],
    start: number,
    end: number
): Promise<PlatformResult[]> {
    const results: PlatformResult[] = [];

    for (const profile of profiles) {
        const platformUpper = profile.platform.toUpperCase();
        const name = PLATFORM_NAMES[platformUpper] || platformUpper;
        const emoji = PLATFORM_EMOJI[platformUpper] || '⚪';

        process.stdout.write(`  ${emoji} Fetching ${name}...`);

        let submissions: any[] = [];

        try {
            if (platformUpper === 'LEETCODE') {
                submissions = await fetchLeetCodeSubmissions(profile.username);
            } else if (platformUpper === 'CODEFORCES') {
                submissions = await fetchCodeforcesSubmissions(profile.username);
            } else if (platformUpper === 'CODECHEF') {
                submissions = await fetchCodeChefSubmissions(profile.username);
            } else if (platformUpper === 'SMARTINTERVIEWS') {
                submissions = await fetchSmartInterviewsSubmissions(
                    profile.username,
                    profile.token
                );
            } else if (platformUpper === 'HACKERRANK') {
                submissions = await fetchHackerRankSubmissions(profile.username);
            }
        } catch (err: any) {
            clearLine();
            console.log(`  ${emoji} ${name}: ❌ Failed (${err.message})`);
            results.push({ platform: platformUpper, links: [], error: err.message });
            continue;
        }

        // Filter by date window and deduplicate
        const seen = new Set<string>();
        const links: string[] = [];

        for (const sub of submissions) {
            if (sub.timestamp < start || sub.timestamp >= end) continue;
            if (seen.has(sub.titleSlug)) continue;
            seen.add(sub.titleSlug);
            links.push(sub.url);
        }

        clearLine();
        console.log(`  ${emoji} ${name}: ${links.length} problem(s)`);
        results.push({ platform: platformUpper, links });
    }

    return results;
}

// ─── Output ───────────────────────────────────────────────────────────────────

function formatOutput(results: PlatformResult[], label: string): {
    consoleOutput: string;
    rawLinks: string[];
    discordMessage: string;
} {
    const rawLinks: string[] = [];
    const consoleLines: string[] = [];
    const discordLines: string[] = [];

    let totalCount = 0;

    for (const result of results) {
        if (result.links.length === 0) continue;

        const name = PLATFORM_NAMES[result.platform] || result.platform;
        const emoji = PLATFORM_EMOJI[result.platform] || '⚪';

        totalCount += result.links.length;
        rawLinks.push(...result.links);

        consoleLines.push(`  ${emoji} ${name} (${result.links.length})`);
        discordLines.push(`${emoji} **${name}** (${result.links.length})`);

        for (const link of result.links) {
            consoleLines.push(`  ${link}`);
            discordLines.push(`<${link}>`);
        }

        consoleLines.push('');
        discordLines.push('');
    }

    // Add errors if any
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
        consoleLines.push('');
        for (const err of errors) {
            const name = PLATFORM_NAMES[err.platform] || err.platform;
            consoleLines.push(`  ⚠️  ${name}: could not fetch (${err.error})`);
        }
        consoleLines.push('');
    }

    const header = `📅 ${label} — ${totalCount} problem(s) solved`;

    const consoleOutput = [
        '',
        `  ${header}`,
        '',
        ...consoleLines,
    ].join('\n');

    const discordMessage = [
        `📅 **${label}** — ${totalCount} problem(s) solved\n`,
        ...discordLines,
    ].join('\n');

    return { consoleOutput, rawLinks, discordMessage };
}

// ─── Discord Posting (Optional) ───────────────────────────────────────────────

async function postToDiscord(webhookUrl: string, message: string): Promise<boolean> {
    try {
        // Discord messages have a 2000 char limit
        const chunks: string[] = [];
        let current = '';

        for (const line of message.split('\n')) {
            if (current.length + line.length + 1 > 1900) {
                chunks.push(current.trim());
                current = '';
            }
            current += line + '\n';
        }
        if (current.trim()) chunks.push(current.trim());

        for (const chunk of chunks) {
            await axios.post(webhookUrl, { content: chunk });
        }
        return true;
    } catch (err: any) {
        console.log(`  ⚠️  Discord posting failed: ${err.message}`);
        return false;
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    printBanner();

    // Step 1: Load or create config
    const config = await loadOrCreateConfig();

    // Step 2: Filter to real profiles only
    const profiles = config.profiles.filter(
        (p) => p.username && !p.username.includes('your_')
    );

    if (profiles.length === 0) {
        console.log('  ❌ No profiles configured.');
        console.log('     Delete config.json and run again to re-setup.\n');
        process.exit(1);
    }

    // Step 3: Determine date
    let dateArg = process.argv[2];

    if (!dateArg) {
        // No argument passed — show interactive menu
        dateArg = await askForDate() || undefined as any;
    }

    const { start, end, label } = getWindow(dateArg);

    printSeparator();
    console.log(`  📅 Checking: ${label} (IST)`);
    printSeparator();
    console.log('');

    // Step 4: Fetch from all platforms
    const results = await fetchAllLinks(profiles, start, end);

    // Step 5: Format and output
    const { consoleOutput, rawLinks, discordMessage } = formatOutput(results, label);

    printSeparator();
    console.log(consoleOutput);
    printSeparator();

    if (rawLinks.length === 0) {
        console.log(`\n  📭 No problems solved on ${label}\n`);
    } else {
        // Copy to clipboard
        const allLinks = rawLinks.join('\n');
        const copied = copyToClipboard(allLinks);

        if (copied) {
            console.log(`\n  📋 ${rawLinks.length} link(s) copied to clipboard!`);
            console.log('     Paste them anywhere — Discord, WhatsApp, wherever.\n');
        } else {
            console.log('\n  (Could not copy to clipboard automatically)\n');
            console.log('  Your links:');
            console.log('  ───────────');
            for (const link of rawLinks) {
                console.log(`  ${link}`);
            }
            console.log('');
        }

        // Optional Discord posting
        if (config.discord_webhook_url) {
            process.stdout.write('  📬 Posting to Discord...');
            const posted = await postToDiscord(config.discord_webhook_url, discordMessage);
            clearLine();
            if (posted) {
                console.log('  📬 Posted to Discord! ✅\n');
            }
        }
    }
}

main().catch((err) => {
    console.error('\n  ❌ Fatal error:', err.message);
    console.error('     If this keeps happening, try deleting config.json and re-running.\n');
});
