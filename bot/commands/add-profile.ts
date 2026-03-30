import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../lib/prisma';
import { encrypt } from '../../lib/encryption';

export async function handleAddProfile(interaction: ChatInputCommandInteraction) {
    const platform = interaction.options.getString('platform', true).toUpperCase();
    const username = interaction.options.getString('username', true);
    let token = interaction.options.getString('token');

    // Basic Input Sanitization rules (No strange characters/XSS)
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
        return interaction.reply({ content: '❌ Invalid username format. Please use only letters, numbers, hyphens, and underscores.', ephemeral: true });
    }

    // Special handling for SmartInterviews missing token
    if (platform === 'SMARTINTERVIEWS' && !token) {
        const tokenEmbed = new EmbedBuilder()
            .setTitle('🟣 SmartInterviews Setup')
            .setDescription('To track SmartInterviews, you need an auth token.')
            .addFields(
                { name: 'Step 1', value: 'Login to [hive.smartinterviews.in](https://hive.smartinterviews.in/)' },
                { name: 'Step 2', value: 'Press **F12** (Inspect) → **Network** tab' },
                { name: 'Step 3', value: 'Refresh (**F5**) and search for "**populateProfile**" in the filter box.' },
                { name: 'Step 4', value: 'Click the request → **Headers** → Find "**authorization**".' },
                { name: 'Step 5', value: 'Copy the value starting with `ey...` (don\'t include "Token ").' },
                { name: 'Step 6', value: 'Run `/add-profile` again and paste it in the **token** field.' }
            )
            .setColor(0x5865F2);

        await interaction.reply({ embeds: [tokenEmbed], ephemeral: true });
        return;
    }

    await interaction.deferReply();

    try {
        await prisma.userProfile.upsert({
            where: {
                discordUserId_platform_username: {
                    discordUserId: interaction.user.id,
                    platform,
                    username,
                },
            },
            update: { token },
            create: {
                discordUserId: interaction.user.id,
                platform,
                username,
                token: encrypt(token || ''),
            },
        });

        // Record Analytics
        await prisma.analyticsEvent.create({
            data: {
                discordUserId: interaction.user.id,
                command: 'add-profile',
                metadata: JSON.stringify({ platform })
            }
        });

        await interaction.editReply(`✅ Successfully added **${platform}** profile for **${username}**.\n\nType \`/check\` to see your today's solved problems!`);
    } catch (err) {
        console.error('[AddProfile] Error:', err);
        await interaction.editReply('❌ Failed to add profile. Maybe you already added this platform/username?');
    }
}
