import { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../lib/prisma';

export async function handleRemoveProfile(interaction: ChatInputCommandInteraction) {
    const platform = interaction.options.getString('platform', true);
    const username = interaction.options.getString('username', true);

    const deleted = await prisma.userProfile.deleteMany({
        where: {
            discordUserId: interaction.user.id,
            platform,
            username,
        },
    });

    if (deleted.count === 0) {
        await interaction.reply({
            content: `❌ No profile found for **${platform}** → \`${username}\``,
            ephemeral: true,
        });
    } else {
        await interaction.reply({
            content: `🗑️ Removed **${platform}** → \`${username}\``,
            ephemeral: true,
        });
    }
}
