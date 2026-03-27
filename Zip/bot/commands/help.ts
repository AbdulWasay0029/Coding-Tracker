import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function handleHelp(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🚀 CodeSync — Help Guide')
        .setDescription('Track your coding progress across LeetCode, Codeforces, CodeChef, HackerRank & SmartInterviews.')
        .setColor(0x5865F2)
        .addFields(
            {
                name: '👤 Profile Setup',
                value: [
                    '`/add-profile` — Add your accounts (LeetCode, etc.)',
                    '`/remove-profile` — Untrack a platform',
                    '`/list-profiles` — Show your accounts',
                ].join('\n'),
            },
            {
                name: '🔍 Check Progress',
                value: [
                    '`/check` — Todays solved problems',
                    '`/check date:yesterday` — Yesterday\'s problems',
                    '`/check date:2026-03-25` — Specific date (YYYY-MM-DD)',
                    '• **Grouped output** — links labeled by platform',
                    '• **📋 Copy Links** — text block for your batch',
                    '• **🔁 Re-check** — refresh the result',
                ].join('\n'),
            },
            {
                name: '⚙️ Server Admin',
                value: [
                    '`/setup` — Configure welcome channel & daily reminders',
                ].join('\n'),
            },
            {
                name: '🟣 SmartInterviews Token',
                value: [
                    '**1.** Login to SmartInterviews hive',
                    '**2.** Press **F12** → **Network** tab',
                    '**3.** Refresh (**F5**) → search "**populateProfile**"',
                    '**4.** Copy value of "**authorization**" (starts with `ey...`)',
                    '**5.** Run `/add-profile` and paste it!',
                ].join('\n'),
            },
            {
                name: '💡 Tips',
                value: [
                    '• Times are in **IST** (India Standard Time)',
                    '• Setup is linked to your Discord ID — use it in any server!',
                    '• Links are wrapped in `<>` to keep the chat clean (no embeds)',
                ].join('\n'),
            },
        )
        .setFooter({ text: 'CodeSync • Industrial Standard Tracker' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
