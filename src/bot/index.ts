import { Client, GatewayIntentBits, Interaction, EmbedBuilder, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../core/prisma';
import { handleAddProfile } from './commands/add-profile';
import { handleUpdateProfile } from './commands/update-profile';
import { handleRemoveProfile } from './commands/remove-profile';
import { handleListProfiles } from './commands/list-profiles';
import { handleCheck, handleRecheckButton, handleCopyLinksButton } from './commands/check';
import { handleHelp } from './commands/help';
import { handleSetup } from './commands/setup';
import { handleLeaderboard } from './commands/leaderboard';
import { handleExportReport } from './commands/export-report';
import { handleRefresh } from './commands/refresh';
import { initContestScheduler } from '../jobs/contests';
import { RateLimiter } from '../core/rate-limiter';
import express from 'express';

// Initialize a 30-second cooldown specifically for hitting the scraping APIs
const checkLimiter = new RateLimiter(30);

const app = express();
const port = process.env.PORT || 7860;

app.get('/', (req, res) => res.send('🚀 CodeSync Bot is running!'));
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(port, () => console.log(`🌍 Health check server on port ${port}`));

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ] 
});

import { ActivityType } from 'discord.js';

client.once('ready', () => {
    console.log(`✅ Bot online as ${client.user?.tag}`);
    client.user?.setPresence({
        activities: [{ name: '/help | Tracking your grind', type: ActivityType.Playing }],
        status: 'online',
    });
    
    // Start background contest scheduler
    initContestScheduler(client);
});

client.on('interactionCreate', async (interaction: Interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'add-profile': await handleAddProfile(interaction); break;
                case 'update-profile': await handleUpdateProfile(interaction); break;
                case 'remove-profile': await handleRemoveProfile(interaction); break;
                case 'list-profiles': await handleListProfiles(interaction); break;
                case 'check': 
                    if (interaction.user.id !== '481554233817300993' && interaction.user.id !== '832267346688737320' && checkLimiter.isRateLimited(interaction.user.id)) {
                        const remaining = Math.ceil(checkLimiter.getRemainingSeconds(interaction.user.id));
                        await interaction.reply({ content: `⏳ You are checking too fast! Please wait **${remaining}s** before scraping profiles again.`, ephemeral: true });
                        break;
                    }
                    await handleCheck(interaction); 
                    break;
                case 'setup': await handleSetup(interaction); break;
                case 'help': await handleHelp(interaction); break;
                case 'leaderboard': await handleLeaderboard(interaction); break;
                case 'export-report': await handleExportReport(interaction); break;
                case 'refresh': await handleRefresh(interaction); break;
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('recheck:')) {
                if (interaction.user.id !== '481554233817300993' && interaction.user.id !== '832267346688737320' && checkLimiter.isRateLimited(interaction.user.id)) {
                    const remaining = Math.ceil(checkLimiter.getRemainingSeconds(interaction.user.id));
                    await interaction.reply({ content: `⏳ Please wait **${remaining}s** before re-checking. APIs need a break! 🤖`, ephemeral: true });
                    return;
                }
                await handleRecheckButton(interaction);
            } else if (interaction.customId.startsWith('copy_links:')) {
                await handleCopyLinksButton(interaction);
            }
        }
    } catch (err) {
        console.error('Unhandled interaction error:', err);
    }
});

// ─── Onboarding Event ────────────────────────────────────────────────────────
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

client.on('guildMemberAdd', async (member) => {
    try {
        const config = await prisma.guildConfig.findUnique({
            where: { guildId: member.guild.id }
        });

        if (!config?.welcomeChannelId) return; // Opt-in ONLY

        const channel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
        if (!channel) return;

        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`Welcome to ${member.guild.name}, ${member.user.username}! 🚀`)
            .setDescription(`I'm **CodeSync**, here to track your competitive programming progress globally.\n\nClick the button below to link your LeetCode, Codeforces, CodeChef, and HackerRank accounts in 30 seconds.`)
            .addFields(
                { name: '📊 Climb the Leaderboard', value: 'Compete against your server-mates automatically.' },
                { name: '🔥 Build your Streak', value: 'Track your daily solves and earn roles.' }
            )
            .setColor(0x5865F2)
            .setThumbnail(member.guild.iconURL() || member.user.displayAvatarURL());

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('🚀 Setup My Profile')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://codesync-hub.vercel.app/')
            );

        try {
            // Attempt zero-friction DM onboarding
            await member.user.send({
                embeds: [welcomeEmbed],
                components: [row]
            });
        } catch (dmError) {
            // Fallback: If DMs are closed, send in the welcome channel with a soft ping
            await channel.send({ 
                content: `Hey <@${member.id}>! I tried to DM you but your DMs are closed. Check this out to get started:`,
                embeds: [welcomeEmbed],
                components: [row]
            });
        }
    } catch (err) {
        console.error('[Onboarding] Error:', err);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
