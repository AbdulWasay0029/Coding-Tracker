import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../core/prisma';

export async function handleCompare(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
        return interaction.reply({ content: '❌ This command must be used inside a server.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
        const user1 = interaction.user;
        const user2 = interaction.options.getUser('user');

        if (!user2) {
            return interaction.editReply('❌ You must specify an opponent to compare against.');
        }

        if (user1.id === user2.id) {
            return interaction.editReply('❌ You cannot compare yourself against yourself! Pick a worthy opponent.');
        }

        // Fetch aggregates for both users
        const [stats1, stats2] = await Promise.all([
            prisma.solvedProblem.groupBy({
                by: ['platform'],
                where: { discordUserId: user1.id },
                _count: { problemId: true },
                orderBy: { _count: { problemId: 'desc' } }
            }),
            prisma.solvedProblem.groupBy({
                by: ['platform'],
                where: { discordUserId: user2.id },
                _count: { problemId: true },
                orderBy: { _count: { problemId: 'desc' } }
            })
        ]);

        const total1 = stats1.reduce((sum, p) => sum + p._count.problemId, 0);
        const total2 = stats2.reduce((sum, p) => sum + p._count.problemId, 0);

        if (total1 === 0 && total2 === 0) {
            return interaction.editReply('📉 Neither of you have solved any problems yet! Go grind some LeetCode first.');
        }

        // Determine Winner
        let winnerText = '';
        let embedColor = 0x3B82F6; // CodeSync Blue

        if (total1 > total2) {
            winnerText = `👑 **${user1.username}** crushes **${user2.username}** by ${total1 - total2} problems!`;
            embedColor = 0x10B981; // Green for self victory
        } else if (total2 > total1) {
            winnerText = `💀 **${user2.username}** destroys **${user1.username}** by ${total2 - total1} problems!`;
            embedColor = 0xEF4444; // Red for defeat
        } else {
            winnerText = `🤝 It's a dead tie! Both have ${total1} problems solved.`;
        }

        // Top Platform calculation
        const getFavPlatform = (stats: any[]) => {
            if (stats.length === 0) return 'None';
            const top = stats[0];
            return `${top.platform} (${top._count.problemId})`;
        };

        const embed = new EmbedBuilder()
            .setTitle(`⚔️ Player Comparison`)
            .setDescription(winnerText)
            .addFields(
                {
                    name: `👤 ${user1.username}`,
                    value: `**Total Solved:** ${total1}\n**Top Platform:** ${getFavPlatform(stats1)}`,
                    inline: true
                },
                {
                    name: `⚔️`,
                    value: `\u200B`,
                    inline: true
                },
                {
                    name: `👤 ${user2.username}`,
                    value: `**Total Solved:** ${total2}\n**Top Platform:** ${getFavPlatform(stats2)}`,
                    inline: true
                }
            )
            .setColor(embedColor)
            .setFooter({ text: 'CodeSync Arena' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

    } catch (err) {
        console.error('[Compare] Error:', err);
        await interaction.editReply('❌ Failed to pull comparison stats.');
    }
}
