import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function handleHelp(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🚀 CodeSync — Command Reference')
        .setDescription('Track your competitive programming progress across LeetCode, Codeforces, CodeChef & SmartInterviews.')
        .setColor(0x8B5CF6) // purple
        .addFields(
            {
                name: '📋 Profile Setup',
                value: [
                    '`/add-profile` — Add a platform account to track',
                    '`/remove-profile` — Remove a tracked account',
                    '`/list-profiles` — Show all your tracked accounts',
                ].join('\n'),
            },
            {
                name: '🔍 Check Progress',
                value: [
                    '`/check` — Today\'s solved problems (IST)',
                    '`/check when:yesterday` — Yesterday\'s problems',
                    '`/check date:2026-03-01` — Any specific date (YYYY-MM-DD)',
                ].join('\n'),
            },
            {
                name: '🔐 SmartInterviews Token',
                value: [
                    'SmartInterviews requires a JWT token to fetch your submissions.',
                    '**How to get it:** Log in → F12 → Network tab → any `/api/` request → copy the `authorization` header value (without "Token ").',
                    'Pass it as the `token` option in `/add-profile`.',
                ].join('\n'),
            },
            {
                name: '💡 Tips',
                value: [
                    '• All times are **IST** (Indian Standard Time)',
                    '• The **🔁 Re-check** button on any result reruns the same check instantly',
                    '• Profile setup is per-user — you only need to do it once',
                    '• Multiple users can use the bot independently in the same server',
                ].join('\n'),
            },
        )
        .setFooter({ text: 'CodeSync • Hosted on Railway' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
}
