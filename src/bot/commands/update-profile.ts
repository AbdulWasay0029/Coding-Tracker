import { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../core/prisma';
import { encrypt } from '../../core/encryption';

export async function handleUpdateProfile(interaction: ChatInputCommandInteraction) {
    const platform = interaction.options.getString('platform', true).toUpperCase();
    const newUsername = interaction.options.getString('new_username', true);
    let token = interaction.options.getString('token');

    if (!/^[a-zA-Z0-9_.-]+$/.test(newUsername)) {
        return interaction.reply({ content: '❌ Invalid username format. Please use only letters, numbers, hyphens, and underscores.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        // Find existing profile for this user and platform
        const existingProfiles = await prisma.userProfile.findMany({
            where: { discordUserId: interaction.user.id, platform }
        });

        if (existingProfiles.length === 0) {
            return interaction.editReply('❌ No existing profile found for this platform. Use `/add-profile` instead.');
        }

        // We update the first one found (most users only have 1 per platform)
        const profileToUpdate = existingProfiles[0];

        await prisma.userProfile.update({
            where: { id: profileToUpdate.id },
            data: {
                username: newUsername,
                // Only overwrite token if a new one is provided.
                token: token ? encrypt(token) : profileToUpdate.token,
            }
        });

        await interaction.editReply(`✅ Successfully updated your **${platform}** profile to username **${newUsername}**.`);
    } catch (err) {
        console.error('[UpdateProfile] Error:', err);
        // The unique constraint might fail if they try to update to a username they already track
        await interaction.editReply('❌ Failed to update profile. Do you already have a profile with this username?');
    }
}
