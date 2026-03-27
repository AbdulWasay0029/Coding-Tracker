import { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../lib/prisma';

const PLATFORM_EMOJI: Record<string, string> = {
    LEETCODE: '🟡',
    CODEFORCES: '🔵',
    CODECHEF: '🟤',
    SMARTINTERVIEWS: '🟣',
};

export async function handleListProfiles(interaction: ChatInputCommandInteraction) {
    const profiles = await prisma.userProfile.findMany({
        where: { discordUserId: interaction.user.id },
        orderBy: { platform: 'asc' },
    });

    if (profiles.length === 0) {
        await interaction.reply({
            content: "You haven't added any profiles yet.\nUse `/add-profile` to get started.",
            ephemeral: true,
        });
        return;
    }

    const lines = profiles.map(p => {
        const emoji = PLATFORM_EMOJI[p.platform] ?? '⚪';
        const tokenNote = p.token ? ' *(token saved)*' : '';
        return `${emoji} **${p.platform}** → \`${p.username}\`${tokenNote}`;
    });

    await interaction.reply({
        content: `**Your tracked profiles:**\n\n${lines.join('\n')}`,
        ephemeral: true,
    });
}
