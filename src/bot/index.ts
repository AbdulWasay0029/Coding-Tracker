import { Client, GatewayIntentBits, Interaction, EmbedBuilder, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
if (!process.env.DISCORD_BOT_TOKEN) {
    dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}
if (!process.env.DISCORD_BOT_TOKEN) {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}
if (!process.env.DISCORD_BOT_TOKEN) {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

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
import { handleStats } from './commands/stats';
import { handleBadges } from './commands/badges';
import { handleCompare } from './commands/compare';
import { handleRefresh } from './commands/refresh';
import { initContestScheduler } from '../jobs/contests';
import { initNightlyScheduler } from '../jobs/nightly-cron';
import { RateLimiter } from '../core/rate-limiter';
import express from 'express';

// Initialize a 30-second cooldown specifically for hitting the scraping APIs
const checkLimiter = new RateLimiter(30);

const app = express();
const port = process.env.PORT || 7860;

app.get('/', (req, res) => res.send('🚀 CodeSync Bot is running!'));
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(port, () => {
    console.log(`🌍 Health check server on port ${port}`);
    console.log(`[Bot Startup] Verifying DISCORD_BOT_TOKEN...`);
    if (!process.env.DISCORD_BOT_TOKEN) {
        console.error(`❌ [CRITICAL ERROR] DISCORD_BOT_TOKEN is completely missing from process.env! Check your HeavenCloud .env file.`);
    } else {
        console.log(`[Bot Startup] DISCORD_BOT_TOKEN found (Length: ${process.env.DISCORD_BOT_TOKEN.length} chars). Initiating Discord Gateway connection...`);
    }
});

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ] 
});

client.on('error', (err) => console.error('❌ [Discord Client Error]:', err));
client.on('shardError', (error, shardId) => console.error(`❌ [Discord Shard ${shardId} Error]:`, error));

import { ActivityType } from 'discord.js';

client.once('clientReady', () => {
    console.log(`✅ Bot online as ${client.user?.tag}`);
    client.user?.setPresence({
        activities: [{ name: '/help | Tracking your grind', type: ActivityType.Playing }],
        status: 'online',
    });
    
    // Start background schedulers
    initContestScheduler(client);
    initNightlyScheduler(client);
    
    // Start background worker queue for scraping
    const { startWorker } = require('../jobs/worker');
    startWorker();
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
                case 'stats': await handleStats(interaction); break;
                case 'badges': await handleBadges(interaction); break;
                case 'compare': await handleCompare(interaction); break;
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


client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => console.log('[Bot Startup] client.login() promise resolved. Waiting for Discord Shard ready...'))
    .catch((err) => {
        console.error('❌ [Bot Startup] client.login() FAILED completely:', err.message || err);
    });
