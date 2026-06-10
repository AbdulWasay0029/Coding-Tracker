import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../core/prisma';
import { decrypt } from '../../core/encryption';

const PLATFORM_EMOJI: Record<string, string> = {
    LEETCODE: '🟡',
    CODEFORCES: '🔵',
    CODECHEF: '🟤',
    SMARTINTERVIEWS: '🟣',
    HACKERRANK: '🟢',
};

export async function handleListProfiles(interaction: ChatInputCommandInteraction) {
    const profiles = await prisma.userProfile.findMany({
        where: { discordUserId: interaction.user.id },
        orderBy: { platform: 'asc' },
    });

    if (profiles.length === 0) {
        const embed = new EmbedBuilder()
            .setTitle('🚫 No Profiles Found')
            .setDescription("You haven't linked any coding platforms yet.")
            .addFields({ name: 'How to Link', value: 'Please log into the [CodeSync Dashboard](https://codesync-hub.vercel.app/dashboard) to securely link your accounts.' })
            .setColor(0xFF3333);
            
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle('🔗 Your Linked Profiles')
        .setDescription('Here are the coding platforms currently synced to your account:')
        .setColor(0x10B981); // Premium Toxic Green

    for (const p of profiles) {
        const emoji = PLATFORM_EMOJI[p.platform] ?? '⚪';
        let statusStr = '';
        
        if (p.platform === 'SMARTINTERVIEWS' && p.token) {
            try {
                const decrypted = decrypt(p.token);
                const parts = decrypted.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                    if (payload.exp && Date.now() > payload.exp * 1000) {
                        statusStr = '\n⚠️ **Status:** Token Expired! Please reconnect on the dashboard.';
                    } else {
                        statusStr = '\n✅ **Status:** Connected';
                    }
                } else {
                    statusStr = '\n❌ **Status:** Invalid Token format';
                }
            } catch (e) {
                statusStr = '\n❌ **Status:** Token Decryption Failed';
            }
        } else if (p.platform === 'SMARTINTERVIEWS' && !p.token) {
            statusStr = '\n⚠️ **Status:** Missing Token. Please reconnect on the dashboard.';
        }

        embed.addFields({
            name: `${emoji} ${p.platform}`,
            value: `**Username:** \`${p.username}\`${statusStr}`,
            inline: false
        });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
}
