import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../core/prisma';

export async function handleLeaderboard(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
        return interaction.reply({ content: '❌ The CodeSync bot must be officially invited to this server to run this command.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
        // Calculate the start of the current week (Monday) at 00:00:00 IST
        const istOffset = 5.5 * 60 * 60 * 1000;
        const nowIST = new Date(Date.now() + istOffset);

        const dayOfWeek = nowIST.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const startOfWeekIST = new Date(nowIST.getTime());
        startOfWeekIST.setUTCDate(startOfWeekIST.getUTCDate() - diffToMonday);
        startOfWeekIST.setUTCHours(0, 0, 0, 0);

        const startOfWeekUTC = new Date(startOfWeekIST.getTime() - istOffset);

        // Fetch all members in the current Discord server to prevent global data leaks
        const guildMembers = await interaction.guild.members.fetch();
        const guildMemberIds = Array.from(guildMembers.keys());

        const leaderboardData = await prisma.solvedProblem.groupBy({
            by: ['discordUserId'],
            where: {
                solvedAt: { gte: startOfWeekUTC },
                discordUserId: { in: guildMemberIds }
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
            return interaction.editReply('📉 No problems have been solved by anyone in this server this week. Time to start grinding!');
        }

        let description = '';
        const medals = ['🥇', '🥈', '🥉'];

        leaderboardData.forEach((user, index) => {
            const rank = index < 3 ? medals[index] : `**#${index + 1}**`;
            description += `${rank} <@${user.discordUserId}> — **${user._count.problemId}** problems\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Server Leaderboard (This Week)`)
            .setDescription(description)
            .setColor(0x10B981) // Premium Toxic Green
            .setFooter({ text: 'CodeSync • View your full stats on the Web Dashboard' });

        await interaction.editReply({ embeds: [embed] });

    } catch (err) {
        console.error('[Leaderboard] Error:', err);
        await interaction.editReply('❌ Failed to generate leaderboard.');
    }
}
