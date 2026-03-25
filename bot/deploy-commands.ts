/**
 * Run this ONCE to register slash commands with Discord:
 *   npx tsx bot/deploy-commands.ts
 *
 * You only need to re-run this if you add or change commands.
 */
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PLATFORM_CHOICES = [
    { name: 'LeetCode', value: 'LEETCODE' },
    { name: 'Codeforces', value: 'CODEFORCES' },
    { name: 'CodeChef', value: 'CODECHEF' },
    { name: 'SmartInterviews', value: 'SMARTINTERVIEWS' },
    { name: 'HackerRank', value: 'HACKERRANK' },
];

const commands = [
    new SlashCommandBuilder()
        .setName('add-profile')
        .setDescription('Track a platform (LeetCode, Codeforces, etc.)')
        .addStringOption(o => o
            .setName('platform').setDescription('Which platform?').setRequired(true)
            .addChoices(...PLATFORM_CHOICES))
        .addStringOption(o => o
            .setName('username').setDescription('Your handle/username').setRequired(true))
        .addStringOption(o => o
            .setName('token').setDescription('JWT — SmartInterviews only (ey...)').setRequired(false)),

    new SlashCommandBuilder()
        .setName('remove-profile')
        .setDescription('Untrack a platform')
        .addStringOption(o => o
            .setName('platform').setDescription('The platform to remove').setRequired(true)
            .addChoices(...PLATFORM_CHOICES)),

    new SlashCommandBuilder()
        .setName('list-profiles')
        .setDescription('Show your tracked platforms'),

    new SlashCommandBuilder()
        .setName('check')
        .setDescription('Fetch your solved problems today/yesterday')
        .addStringOption(o => o
            .setName('date')
            .setDescription('Quick choice (today/yesterday) or custom YYYY-MM-DD')
            .setRequired(false)),

    new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('Force-sync all your tracked profiles immediately'),

    new SlashCommandBuilder()
        .setName('setup')
        .setDescription('ADMIN: Configure server settings (welcome/reminders)')
        .addChannelOption(o => o
            .setName('welcome-channel').setDescription('Where to post onboarding info').setRequired(false))
        .addChannelOption(o => o
            .setName('reminder-channel').setDescription('Where to post daily reminders').setRequired(false))
        .addStringOption(o => o
            .setName('reminder-time').setDescription('Remind at (HH:mm IST, e.g. 21:30)').setRequired(false)),

    new SlashCommandBuilder()
        .setName('help')
        .setDescription('How to use CodeSync'),
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
    try {
        console.log('Registering slash commands globally...');
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
            { body: commands }
        );
        console.log('✅ Done! Commands may take up to 1 hour to appear globally.');
        console.log('   Tip: For instant testing, use guild commands instead.');
    } catch (err) {
        console.error('Failed to register commands:', err);
    }
})();
