import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export async function handleHelp(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🚀 CodeSync Platform Engine')
        .setDescription('Track your coding progress instantly across LeetCode, Codeforces, CodeChef, HackerRank & SmartInterviews.')
        .setColor(0x00F0FF) // CodeSync Cyan
        .addFields(
            {
                name: '🔍 Check Progress',
                value: [
                    '`/check` — Todays solved problems',
                    '`/check date:yesterday` — Yesterday\'s problems',
                    '`/check date:2026-03-25` — Specific date (YYYY-MM-DD)',
                    '• **📋 Copy Links** — text block for your batch',
                    '• **🔁 Re-check** — force fetch latest data',
                ].join('\n'),
            },
            {
                name: '🏆 Leaderboard',
                value: [
                    '`/leaderboard` — View the top 10 solvers for this week',
                ].join('\n'),
            },
            {
                name: '⚙️ Server Admin (Mentors)',
                value: [
                    '`/export-report` — Download a CSV of student data',
                    '`/refresh` — Force refresh today\'s scrape',
                ].join('\n'),
            },
            {
                name: '💡 How to Setup & Configure',
                value: 'All profile management (Adding accounts, updating tokens) and Admin Server Configuration has moved to the **Web Dashboard** for enhanced security and usability.'
            }
        )
        .setFooter({ text: 'CodeSync • High Performance Tracking' })
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel('Go to Dashboard')
            .setStyle(ButtonStyle.Link)
            .setURL('https://codesync-hub.vercel.app/dashboard')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
}
