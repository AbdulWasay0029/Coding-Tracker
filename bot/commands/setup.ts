import { ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from 'discord.js';
import { prisma } from '../../lib/prisma';

export async function handleSetup(interaction: ChatInputCommandInteraction) {
    // Only admins can run this
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: '❌ Only server administrators can use this command.', ephemeral: true });
    }

    const welcomeChannel = interaction.options.getChannel('welcome-channel');
    const reminderChannel = interaction.options.getChannel('reminder-channel');
    const reminderTime = interaction.options.getString('reminder-time');

    await interaction.deferReply({ ephemeral: true });

    try {
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guildId! },
            update: {
                welcomeChannelId: welcomeChannel?.id,
                reminderChannelId: reminderChannel?.id,
                reminderTime: reminderTime ?? undefined,
            },
            create: {
                guildId: interaction.guildId!,
                welcomeChannelId: welcomeChannel?.id,
                reminderChannelId: reminderChannel?.id,
                reminderTime: reminderTime ?? "22:00",
            },
        });

        let msg = '✅ Server settings updated!\n';
        if (welcomeChannel) msg += `- Welcome messages: <#${welcomeChannel.id}>\n`;
        if (reminderChannel) msg += `- Daily reminders: <#${reminderChannel.id}> at ${reminderTime || '22:00'} IST\n`;

        await interaction.editReply(msg);
    } catch (err) {
        console.error('[Setup] Error:', err);
        await interaction.editReply('❌ Failed to update server settings.');
    }
}
