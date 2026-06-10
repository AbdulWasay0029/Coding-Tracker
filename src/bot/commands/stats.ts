import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../core/prisma';

const PLATFORM_EMOJI: Record<string, string> = {
    LEETCODE: '🟡',
    CODEFORCES: '🔵',
    CODECHEF: '🟤',
    SMARTINTERVIEWS: '🟣',
    HACKERRANK: '🟢',
};

const PLATFORM_NAMES: Record<string, string> = {
    LEETCODE: 'LeetCode',
    CODEFORCES: 'Codeforces',
    CODECHEF: 'CodeChef',
    HACKERRANK: 'HackerRank',
    SMARTINTERVIEWS: 'SmartInterviews',
};

export async function handleStats(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
        return interaction.reply({ content: '❌ This command must be used inside a server.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const targetUserId = targetUser.id;

        // Fetch user profiles to check if they are tracked
        const profiles = await prisma.userProfile.findMany({
            where: { discordUserId: targetUserId }
        });

        if (profiles.length === 0) {
            return interaction.editReply(`ℹ️ **${targetUser.username}** has not linked any coding profiles yet.`);
        }

        // Fetch their all-time solved problems grouped by platform
        const platformStats = await prisma.solvedProblem.groupBy({
            by: ['platform'],
            where: { discordUserId: targetUserId },
            _count: { problemId: true },
            orderBy: { _count: { problemId: 'desc' } }
        });

        const totalSolved = platformStats.reduce((sum, p) => sum + p._count.problemId, 0);

        if (totalSolved === 0) {
            return interaction.editReply(`📉 **${targetUser.username}** has linked their profiles, but hasn't solved any problems yet!`);
        }

        // Calculate their server rank globally (All-Time)
        const guildMembers = await interaction.guild.members.fetch();
        const guildMemberIds = Array.from(guildMembers.keys());

        const serverLeaderboard = await prisma.solvedProblem.groupBy({
            by: ['discordUserId'],
            where: { discordUserId: { in: guildMemberIds } },
            _count: { problemId: true },
            orderBy: { _count: { problemId: 'desc' } }
        });

        const rankIndex = serverLeaderboard.findIndex(u => u.discordUserId === targetUserId);
        const rankDisplay = rankIndex !== -1 ? `#${rankIndex + 1} of ${serverLeaderboard.length}` : 'Unranked';

        // Build the Player Card Embed
        let description = `**Total Problems Solved:** ${totalSolved}\n**Server Rank:** ${rankDisplay}\n\n**Platform Breakdown:**\n`;

        for (const stat of platformStats) {
            const platformKey = stat.platform.toUpperCase();
            const emoji = PLATFORM_EMOJI[platformKey] || '⚪';
            const name = PLATFORM_NAMES[platformKey] || stat.platform;
            description += `${emoji} **${name}:** ${stat._count.problemId} solved\n`;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${targetUser.username}'s Gamer Card`, iconURL: targetUser.displayAvatarURL() })
            .setTitle('🏆 All-Time Coding Statistics')
            .setDescription(description)
            .setColor(0x10B981) // Premium Toxic Green
            .setFooter({ text: 'CodeSync • Verified Tracker' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

    } catch (err) {
        console.error('[Stats] Error:', err);
        await interaction.editReply('❌ Failed to pull stats.');
    }
}
