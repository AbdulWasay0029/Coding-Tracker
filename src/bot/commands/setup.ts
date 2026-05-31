import { ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from 'discord.js';
import { prisma } from '../../core/prisma';

export async function handleSetup(interaction: ChatInputCommandInteraction) {
    // Only admins can run this
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: '❌ Only server administrators can use this command.', ephemeral: true });
    }

    const welcomeChannel = interaction.options.getChannel('welcome-channel');
    const contestChannel = interaction.options.getChannel('contest-channel');
    const contestRole = interaction.options.getRole('contest-role');
    await interaction.deferReply({ ephemeral: true });

    try {
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guildId! },
            update: {
                welcomeChannelId: welcomeChannel?.id,
                contestChannelId: contestChannel?.id,
                contestRoleId: contestRole?.id,
            },
            create: {
                guildId: interaction.guildId!,
                welcomeChannelId: welcomeChannel?.id,
                contestChannelId: contestChannel?.id,
                contestRoleId: contestRole?.id,
            },
        });

        let msg = '✅ Server settings updated!\n';
        if (welcomeChannel) msg += `- Welcome messages: <#${welcomeChannel.id}>\n`;
        if (contestChannel) msg += `- Contest alerts: <#${contestChannel.id}>\n`;
        if (contestRole) msg += `- Contest ping role: <@&${contestRole.id}>\n`;

        await interaction.editReply(msg);
    } catch (err: any) {
        console.error('[Setup] Detailed Error:', err);
        await interaction.editReply(`❌ Failed to update server settings: ${err.message || 'Unknown database error'}`);
    }
}
