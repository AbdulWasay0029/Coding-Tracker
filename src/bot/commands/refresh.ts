import { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../core/prisma';
import { runTrackerForUser, getTimestampsForDate } from '../../jobs/tracker';

export async function handleRefresh(interaction: ChatInputCommandInteraction) {
    if (interaction.user.id !== '481554233817300993') {
        return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        const { startTimestamp, endTimestamp, dateStr } = getTimestampsForDate('today');
        
        const uniqueUsers = await prisma.userProfile.findMany({
            select: { discordUserId: true },
            distinct: ['discordUserId']
        });

        if (uniqueUsers.length === 0) {
            return interaction.editReply('ℹ️ No profiles in database. Nothing to refresh.');
        }

        let totalLinks = 0;
        let studentsWithLinks = 0;

        for (const { discordUserId } of uniqueUsers) {
            const result = await runTrackerForUser(discordUserId, startTimestamp, endTimestamp);
            if (result.links.length > 0) {
                totalLinks += result.links.length;
                studentsWithLinks++;
            }
            // Anti-Rate-Limit padding
            await new Promise(r => setTimeout(r, 600));
        }

        await interaction.editReply(`✅ Successfully refreshed data for **${dateStr}**!\nFound **${totalLinks}** problems solved by **${studentsWithLinks}** students. Leaderboard is now up to date.`);

    } catch (err) {
        console.error('[Refresh] Error:', err);
        await interaction.editReply('❌ Failed to refresh data.');
    }
}
