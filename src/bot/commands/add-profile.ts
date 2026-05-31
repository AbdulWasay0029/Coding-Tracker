import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export async function handleAddProfile(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🔗 Profile Management Moved')
        .setDescription('We have completely upgraded the CodeSync Platform! You can now securely manage your coding profiles directly from your Web Dashboard.')
        .setColor(0x00F0FF);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel('Go to Dashboard')
            .setStyle(ButtonStyle.Link)
            .setURL('https://codesync-hub.vercel.app/dashboard')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}
