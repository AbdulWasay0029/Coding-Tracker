import { ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { prisma } from '../../core/prisma';
import { runTrackerForUser, getTimestampsForDate } from '../../jobs/tracker';

export async function handleRefresh(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
        return interaction.reply({ content: '❌ The CodeSync bot must be officially invited to this server to run this command.', ephemeral: true });
    }

    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: '❌ You must be a Server Administrator to use this command.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        const { startTimestamp, endTimestamp, dateStr } = getTimestampsForDate('today');
        
        const guildMembers = await interaction.guild.members.fetch();
        const guildMemberIds = Array.from(guildMembers.keys());

        const trackedUsers = await prisma.userProfile.findMany({
            where: { discordUserId: { in: guildMemberIds } },
            select: { discordUserId: true },
            distinct: ['discordUserId']
        });

        if (trackedUsers.length === 0) {
            return interaction.editReply('ℹ️ No tracked members found in this server. Nothing to refresh.');
        }

        let totalLinks = 0;
        let studentsWithLinks = 0;
        const fetchStartTimestamp = startTimestamp - (86400 * 2); // Pull the last 3 days to heal missing data!

        for (const { discordUserId } of trackedUsers) {
            const result = await runTrackerForUser(discordUserId, startTimestamp, endTimestamp, fetchStartTimestamp);
            if (result.links.length > 0) {
                totalLinks += result.links.length;
                studentsWithLinks++;
            }
            // Anti-Rate-Limit padding
            await new Promise(r => setTimeout(r, 600));
        }

        const embed = new EmbedBuilder()
            .setTitle(`🔄 Server Data Force Synced!`)
            .setDescription(`Successfully refreshed the tracking database for all **${trackedUsers.length}** tracked members in this server.`)
            .addFields({ name: '📊 Today\'s Impact', value: `Found **${totalLinks}** problems solved today by **${studentsWithLinks}** active students.` })
            .setColor(0x10B981) // Premium Toxic Green
            .setFooter({ text: 'CodeSync • Server Admin Actions' });

        await interaction.editReply({ embeds: [embed] });

    } catch (err) {
        console.error('[Refresh] Error:', err);
        await interaction.editReply('❌ Failed to refresh data.');
    }
}
