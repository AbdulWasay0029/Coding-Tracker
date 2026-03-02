import { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../lib/prisma';

export async function handleAddProfile(interaction: ChatInputCommandInteraction) {
    const platform = interaction.options.getString('platform', true);
    const username = interaction.options.getString('username', true);
    const token = interaction.options.getString('token') ?? null;

    if (platform === 'SMARTINTERVIEWS' && !token) {
        await interaction.reply({
            content: '⚠️ SmartInterviews requires a JWT token.\nUse `/add-profile platform:SmartInterviews username:yourname token:eyJ...`',
            ephemeral: true,
        });
        return;
    }

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
                token,
            },
        });

        await interaction.reply({
            content: `✅ Added **${platform}** → \`${username}\``,
            ephemeral: true,
        });
    } catch (err) {
        console.error('add-profile error:', err);
        await interaction.reply({ content: '❌ Failed to save profile. Try again.', ephemeral: true });
    }
}
