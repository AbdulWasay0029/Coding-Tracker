import cron from 'node-cron';
import { Client, TextChannel } from 'discord.js';
import { prisma } from '../core/prisma';
import { runTrackerForUser, getTimestampsForDate } from './tracker';

// ─── Post to Discord Channel (chunked to respect 2000 char limit) ────────────

async function postToDiscordChannel(channel: TextChannel, content: string): Promise<void> {
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
        await channel.send({ content: chunk });
        await new Promise(r => setTimeout(r, 500));
    }
}

// ─── Core Scraping Logic ──────────────────────────────────────────────────

async function processGuildNightlyReport(client: Client, config: any) {
    if (!config.reminderChannelId) return;

    try {
        const guild = await client.guilds.fetch(config.guildId).catch(() => null);
        if (!guild) return;

        const channel = await client.channels.fetch(config.reminderChannelId).catch(() => null) as TextChannel;
        if (!channel || !channel.isTextBased()) return;

        const members = await guild.members.fetch();
        const guildMemberIds = new Set(members.keys());

        // Find all users in our DB who are ALSO in this specific Discord server
        const trackedUsers = await prisma.userProfile.findMany({
            where: { discordUserId: { in: Array.from(guildMemberIds) } },
            select: { discordUserId: true },
            distinct: ['discordUserId']
        });

        if (trackedUsers.length === 0) return;

        const { startTimestamp, endTimestamp, dateStr: label } = getTimestampsForDate('today');
        const lines: string[] = [];
        lines.push(`📅 **Daily Links — ${label}**\n`);

        let guildLinks = 0;
        let guildStudents = 0;

        for (const { discordUserId } of trackedUsers) {
            // Scrape data only for this user
            const result = await runTrackerForUser(discordUserId, startTimestamp, endTimestamp);
            
            if (result.links.length > 0) {
                const userLines: string[] = [];
                for (const [platform, urls] of Object.entries(result.groupedLinks)) {
                    const emoji = platform === 'LEETCODE' ? '🟡' :
                                  platform === 'CODEFORCES' ? '🔵' :
                                  platform === 'CODECHEF' ? '🟤' :
                                  platform === 'HACKERRANK' ? '🟢' : '🟣';
                    
                    const name = platform === 'SMARTINTERVIEWS' ? 'SmartInterviews' :
                                 platform.charAt(0) + platform.slice(1).toLowerCase();

                    userLines.push(`  ${emoji} **${name}**:\n    ${(urls as any[]).map(l => `<${l.url}>`).join('\n    ')}`);
                }

                lines.push(`👤 <@${discordUserId}>`);
                lines.push(...userLines);
                
                if (result.errors && result.errors.length > 0) {
                    lines.push(`  -# ⚠️ Errors: ${result.errors.join(', ')}`);
                }
                
                lines.push('');
                
                guildLinks += result.links.length;
                guildStudents++;
            }
            await new Promise(r => setTimeout(r, 600)); // Rate limit buffer
        }

        if (guildStudents > 0) {
            lines.push(`\n✅ ${guildStudents} student(s) · ${guildLinks} problem(s) solved today`);
            const message = lines.join('\n');
            await postToDiscordChannel(channel, message);
        } else {
            lines.push('📭 No problems solved today by anyone in the server. Get coding! 💪');
            await postToDiscordChannel(channel, lines.join('\n'));
        }

    } catch (err) {
        console.error(`❌ Failed to process nightly report for guild ${config.guildId}:`, err);
    }
}

// ─── Scheduler ─────────────────────────────────────────────────────────────

export function initNightlyScheduler(client: Client) {
    console.log('[Nightly Reports] Initializing internal cron scheduler...');
    
    // Run every minute
    cron.schedule('* * * * *', async () => {
        // Get current time in IST (HH:mm format)
        const now = new Date();
        const istTime = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(now); // example: "22:00"

        // Find all servers that want a report AT THIS EXACT MINUTE
        const configs = await prisma.guildConfig.findMany({
            where: { 
                reminderChannelId: { not: null },
                reminderTime: istTime
            }
        });

        if (configs.length > 0) {
            console.log(`[Nightly Reports] Triggering reports for ${configs.length} server(s) configured for ${istTime} IST.`);
            for (const config of configs) {
                // We don't await this so multiple servers can process concurrently (within reason)
                processGuildNightlyReport(client, config).catch(e => console.error(e));
            }
        }
    });

    console.log('[Nightly Reports] Scheduler running. (Timezone: Asia/Kolkata)');
}
