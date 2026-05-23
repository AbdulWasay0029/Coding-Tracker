import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../lib/prisma';

export async function handleLeaderboard(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
        return interaction.reply({ content: '❌ This command can only be used in a server.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
        // Default to "This Week" (last 7 days)
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Perform a global aggregate query to get the top 10 solvers in the last 7 days.
        // This naturally captures everyone tracked by the bot and avoids Discord Gateway rate limits.
        const leaderboardData = await prisma.solvedProblem.groupBy({
            by: ['discordUserId'],
            where: {
                solvedAt: { gte: lastWeek }
            },
            _count: {
                problemId: true
            },
            orderBy: {
                _count: {
                    problemId: 'desc'
                }
            },
            take: 10
        });

        if (leaderboardData.length === 0) {
            return interaction.editReply('📉 No problems have been solved by anyone in this server in the last 7 days. Time to start grinding!');
        }

        let description = '';
        const medals = ['🥇', '🥈', '🥉'];

        leaderboardData.forEach((user, index) => {
            const rank = index < 3 ? medals[index] : `**#${index + 1}**`;
            description += `${rank} <@${user.discordUserId}> — **${user._count.problemId}** problems\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Server Leaderboard (Last 7 Days)`)
            .setDescription(description)
            .setColor(0xFFD700)
            .setFooter({ text: 'Keep grinding to climb the ranks! 💻🔥' });

        await interaction.editReply({ embeds: [embed] });

    } catch (err) {
        console.error('[Leaderboard] Error:', err);
        await interaction.editReply('❌ Failed to generate leaderboard.');
    }
}
