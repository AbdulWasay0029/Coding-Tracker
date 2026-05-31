import { ChatInputCommandInteraction, AttachmentBuilder, PermissionsBitField } from 'discord.js';
import { prisma } from '../../core/prisma';

export async function handleExportReport(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
        return interaction.reply({ content: '❌ The CodeSync bot must be officially invited to this server to run this command.', ephemeral: true });
    }

    // Require Administrator permissions
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: '❌ You must be a Server Administrator to use this command.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        // Get aggregate data for all time for all tracked users
        // This avoids Discord API rate limits by querying our own DB instead of fetching 1000+ guild members
        const aggregateData = await prisma.solvedProblem.groupBy({
            by: ['discordUserId'],
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
            return interaction.editReply('No tracking data found for any members.');
        }

        // Fetch user profiles to get human-readable platform usernames for the CSV
        const allProfiles = await prisma.userProfile.findMany();

        // Build CSV content
        let csvContent = 'Discord_ID,Platform_Usernames,Problems_Solved_All_Time\n';
        
        for (const data of aggregateData) {
            const userProfiles = allProfiles.filter(p => p.discordUserId === data.discordUserId);
            const usernames = userProfiles.map(p => p.username).join(' | ');
            csvContent += `"${data.discordUserId}","${usernames}",${data._count.problemId}\n`;
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
