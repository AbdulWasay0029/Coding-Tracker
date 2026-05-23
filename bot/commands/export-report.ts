import { ChatInputCommandInteraction, AttachmentBuilder, PermissionsBitField } from 'discord.js';
import { prisma } from '../../lib/prisma';

export async function handleExportReport(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
        return interaction.reply({ content: '❌ This command can only be used in a server.', ephemeral: true });
    }

    // Require Administrator permissions
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: '❌ You must be a Server Administrator to use this command.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        // Fetch all members to scope the report to this server
        const members = await interaction.guild.members.fetch();
        const memberIds = Array.from(members.keys());

        // Get aggregate data for all time for server members
        const aggregateData = await prisma.solvedProblem.groupBy({
            by: ['discordUserId'],
            where: {
                discordUserId: { in: memberIds }
            },
            _count: {
                problemId: true
            },
            orderBy: {
                _count: {
                    problemId: 'desc'
                }
            }
        });

        if (aggregateData.length === 0) {
            return interaction.editReply('No tracking data found for any members in this server.');
        }

        // Build CSV content
        let csvContent = 'Discord_ID,Username,Problems_Solved_All_Time\n';
        
        for (const data of aggregateData) {
            const member = members.get(data.discordUserId);
            // Fallback to ID if username is not resolvable for some reason
            const username = member ? member.user.tag : 'UnknownUser';
            csvContent += `"${data.discordUserId}","${username}",${data._count.problemId}\n`;
        }

        const buffer = Buffer.from(csvContent, 'utf-8');
        const attachment = new AttachmentBuilder(buffer, { name: `CodeSync_Report_${interaction.guild.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv` });

        await interaction.editReply({
            content: '✅ Here is the aggregate report for all students in this server:',
            files: [attachment]
        });

    } catch (err) {
        console.error('[ExportReport] Error:', err);
        await interaction.editReply('❌ Failed to generate report.');
    }
}
