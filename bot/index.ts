import { Client, GatewayIntentBits, Interaction, EmbedBuilder, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../lib/prisma';
import { handleAddProfile } from './commands/add-profile';
import { handleRemoveProfile } from './commands/remove-profile';
import { handleListProfiles } from './commands/list-profiles';
import { handleCheck, handleRecheckButton, handleCopyLinksButton } from './commands/check';
import { handleHelp } from './commands/help';
import { handleSetup } from './commands/setup';
import express from 'express';

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

client.once('ready', () => {
    console.log(`✅ Bot online as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'add-profile': await handleAddProfile(interaction); break;
                case 'remove-profile': await handleRemoveProfile(interaction); break;
                case 'list-profiles': await handleListProfiles(interaction); break;
                case 'check': await handleCheck(interaction); break;
                case 'setup': await handleSetup(interaction); break;
                case 'help': await handleHelp(interaction); break;
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('recheck:')) {
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

client.on('guildMemberAdd', async (member) => {
    try {
        const config = await prisma.guildConfig.findUnique({
            where: { guildId: member.guild.id }
        });

        if (!config?.welcomeChannelId) return; // Opt-in ONLY

        const channel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
        if (!channel) return;

        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`Welcome to the server, ${member.user.username}! 🚀`)
            .setDescription(`I'm **CodeSync**, here to help you track your coding progress and share your solved problem links with the batch.`)
            .addFields(
                { name: '1. Add your profiles', value: 'Use **/add-profile** to register your accounts (LeetCode, Codeforces, etc.).' },
                { name: '2. Check your daily links', value: 'Use **/check** to fetch everything you\'ve solved today correctly grouped and labeled!' },
                { name: '3. Learn more', value: 'Type **/help** for a full guide on getting tokens/usernames.' }
            )
            .setColor(0x5865F2)
            .setThumbnail(member.user.displayAvatarURL());

        await channel.send({ 
            content: `Hey <@${member.id}>! Check this out to get started:`,
            embeds: [welcomeEmbed] 
        });
    } catch (err) {
        console.error('[Onboarding] Error:', err);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
