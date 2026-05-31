import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export async function handleSetup(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('⚙️ Admin Configuration Moved')
        .setDescription('We have completely upgraded the CodeSync Platform! You can now configure Server Settings (Channels, Roles) directly from the Web Admin Portal.')
        .setColor(0x00F0FF);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel('Go to Admin Portal')
            .setStyle(ButtonStyle.Link)
            .setURL('https://codesync-hub.vercel.app/admin')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}
