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
                    '`/update-profile` — Edit username or token',
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
                name: '🏆 Leaderboard',
                value: [
                    '`/leaderboard` — View the top 10 solvers for this week',
                ].join('\n'),
            },
            {
                name: '⚙️ Server Admin',
                value: [
                    '`/setup` — Configure welcome channel & daily reminders',
                    '`/export-report` — Download a CSV of student data',
                    '`/refresh` — Force refresh today\'s scrape',
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
                name: '🌐 Web Dashboard',
                value: [
                    'Visit **[codesync-hub.vercel.app](https://codesync-hub.vercel.app/)**',
                    'Log in with Discord to manage your profiles and view the Global Leaderboard!',
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
