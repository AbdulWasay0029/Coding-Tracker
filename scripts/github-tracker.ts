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
import { runTrackerForUser, getTimestampsForDate } from '../bot/tracker';

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

    const { startTimestamp, endTimestamp, dateStr: label } = getTimestampsForDate('today');
    console.log(`📅 Running tracker for: ${label}`);

    // Get all unique Discord users who have profiles
    const uniqueUsers = await prisma.userProfile.findMany({
        select: { discordUserId: true },
        distinct: ['discordUserId']
    });

    if (uniqueUsers.length === 0) {
        console.log('ℹ️  No profiles in database. Nothing to post.');
        await prisma.$disconnect();
        return;
    }

    console.log(`👥 Found ${uniqueUsers.length} student(s) to track...`);

    const lines: string[] = [];
    lines.push(`📅 **Daily Links — ${label}**\n`);

    let totalLinks = 0;
    let studentsWithLinks = 0;

    for (const { discordUserId } of uniqueUsers) {
        // This is the key fix: running the core tracker logic so the DB is updated for leaderboards
        const result = await runTrackerForUser(discordUserId, startTimestamp, endTimestamp);

        if (result.links.length > 0) {
            const userLines: string[] = [];
            
            for (const [platform, urls] of Object.entries(result.groupedLinks)) {
                // Determine emoji and friendly name based on platform key
                const emoji = platform === 'LEETCODE' ? '🟡' :
                              platform === 'CODEFORCES' ? '🔵' :
                              platform === 'CODECHEF' ? '🟤' :
                              platform === 'HACKERRANK' ? '🟢' : '🟣';
                
                const name = platform === 'SMARTINTERVIEWS' ? 'SmartInterviews' :
                             platform.charAt(0) + platform.slice(1).toLowerCase();

                userLines.push(`  ${emoji} **${name}**:\n    ${urls.map(l => `<${l}>`).join('\n    ')}`);
            }

            lines.push(`👤 <@${discordUserId}>`);
            lines.push(...userLines);
            
            if (result.errors && result.errors.length > 0) {
                lines.push(`  -# ⚠️ Errors: ${result.errors.join(', ')}`);
            }
            
            lines.push('');
            
            totalLinks += result.links.length;
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
