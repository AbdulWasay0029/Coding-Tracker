import cron from 'node-cron';
import { Client, TextChannel } from 'discord.js';
import { prisma } from '../core/prisma';
import { runTrackerForUser, getTimestampsForDate } from './tracker';

import { EmbedBuilder } from 'discord.js';

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

        // The Report Window is today. But the Fetch Window is 3 days, silently recovering missed data!
        const { startTimestamp, endTimestamp, dateStr: label } = getTimestampsForDate('today');
        const fetchStartTimestamp = startTimestamp - (86400 * 2); // 2 days before today (3 days total)

        const embeds: EmbedBuilder[] = [];
        let currentEmbed = new EmbedBuilder()
            .setColor('#10B981')
            .setTitle(`📅 Daily Progress Report — ${label}`)
            .setDescription("Here is the summary of today's coding progress for the server. Keep up the great work! 🔥");

        let fieldCount = 0;
        let totalSolved = 0;
        let totalActive = 0;
        const activeMentions: string[] = [];

        for (const { discordUserId } of trackedUsers) {
            // Scrape data only for this user
            const result = await runTrackerForUser(discordUserId, startTimestamp, endTimestamp, fetchStartTimestamp);
            
            if (result.links.length > 0) {
                totalActive++;
                totalSolved += result.links.length;
                activeMentions.push(`<@${discordUserId}>`);
                
                const member = members.get(discordUserId);
                const displayName = member ? member.displayName : 'Student';
                
                let fieldValue = '';
                
                for (const [platform, problems] of Object.entries(result.groupedLinks)) {
                    const emoji = platform === 'LEETCODE' ? '🟡' :
                                  platform === 'CODEFORCES' ? '🔵' :
                                  platform === 'CODECHEF' ? '🟤' :
                                  platform === 'HACKERRANK' ? '🟢' : '🟣';
                    
                    const name = platform === 'SMARTINTERVIEWS' ? 'SmartInterviews' :
                                 platform.charAt(0) + platform.slice(1).toLowerCase();

                    const linksStr = problems.map(p => `<${p.url}>`).join('\n');
                    fieldValue += `${emoji} **${name}** (${problems.length}): ${linksStr}\n`;
                }
                
                if (result.errors && result.errors.length > 0) {
                    fieldValue += `\n*⚠️ Errors: ${result.errors.join(', ')}*`;
                }
                
                if (fieldValue.length > 1024) {
                    fieldValue = fieldValue.slice(0, 1020) + '...';
                }
                
                currentEmbed.addFields({
                    name: `👤 ${displayName} (${result.links.length} solved)`,
                    value: fieldValue,
                    inline: false
                });
                
                fieldCount++;
                
                if (fieldCount === 25) {
                    embeds.push(currentEmbed);
                    currentEmbed = new EmbedBuilder().setColor('#10B981');
                    fieldCount = 0;
                }
            }
            await new Promise(r => setTimeout(r, 600)); // Rate limit buffer
        }

        if (fieldCount > 0) {
            embeds.push(currentEmbed);
        }

        if (embeds.length > 0) {
            embeds[embeds.length - 1].setFooter({
                text: `✅ ${totalActive} student(s) active · ${totalSolved} problem(s) solved today`
            });
            
            const chunks: EmbedBuilder[][] = [];
            for (let i = 0; i < embeds.length; i += 10) {
                chunks.push(embeds.slice(i, i + 10));
            }

            for (let i = 0; i < chunks.length; i++) {
                // Only put mentions on the first message chunk so we don't spam 
                const contentText = i === 0 ? activeMentions.join(' ') : undefined;
                await channel.send({ content: contentText, embeds: chunks[i] });
                await new Promise(r => setTimeout(r, 500));
            }
        } else {
            const emptyEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setTitle(`📅 Daily Progress Report — ${label}`)
                .setDescription("📭 No problems solved today by anyone in the server. Let's get back on the grind tomorrow! 💪");
            await channel.send({ embeds: [emptyEmbed] });
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
