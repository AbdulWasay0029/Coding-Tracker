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
        .setName('update-profile')
        .setDescription('Update your platform username or token')
        .addStringOption(o => o
            .setName('platform').setDescription('Which platform?').setRequired(true)
            .addChoices(...PLATFORM_CHOICES))
        .addStringOption(o => o
            .setName('new_username').setDescription('Your new handle/username').setRequired(true))
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
        .setName('stats')
        .setDescription('View an all-time Gamer Card for yourself or another student')
        .addUserOption(o => o
            .setName('user')
            .setDescription('The user to view stats for (leave blank for yourself)')
            .setRequired(false)),

    new SlashCommandBuilder()
        .setName('badges')
        .setDescription('View your unlocked CodeSync Gamification badges')
        .addUserOption(o => o
            .setName('user')
            .setDescription('The user to view badges for (leave blank for yourself)')
            .setRequired(false)),

    new SlashCommandBuilder()
        .setName('compare')
        .setDescription('Compare your coding stats against another grinder')
        .addUserOption(o => o
            .setName('user')
            .setDescription('The opponent you want to compare yourself against')
            .setRequired(true)),

    new SlashCommandBuilder()
        .setName('check')
        .setDescription('Fetch your solved problems today/yesterday')
        .addStringOption(o => o
            .setName('date')
            .setDescription('today / yesterday / DD/MM/YYYY (e.g. 27/03/2026)')
            .setRequired(false)),

    new SlashCommandBuilder()
        .setName('setup')
        .setDescription('ADMIN: Configure server settings (welcome/reminders)')
        .addChannelOption(o => o
            .setName('welcome-channel').setDescription('Where to post onboarding info').setRequired(false))
        .addChannelOption(o => o
            .setName('contest-channel').setDescription('Where to post upcoming coding contest alerts').setRequired(false))
        .addRoleOption(o => o
            .setName('contest-role').setDescription('Role to ping for contest alerts').setRequired(false)),

    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('See the top 10 grinders in this server (This Week)'),

    new SlashCommandBuilder()
        .setName('export-report')
        .setDescription('ADMIN: Download a CSV report of all students in this server'),

    new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('ADMIN: Force refresh today\'s leaderboard data for all users'),

    new SlashCommandBuilder()
        .setName('help')
        .setDescription('How to use CodeSync'),
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
    try {
        const guildId = process.env.DISCORD_GUILD_ID;

        console.log('Registering slash commands GLOBALLY (so they work in all servers)...');
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
            { body: commands }
        );

        if (guildId) {
            console.log(`Clearing old duplicate slash commands from TEST GUILD ${guildId}...`);
            await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, guildId),
                { body: [] }
            );
        }
        console.log('✅ Done!');
    } catch (err) {
        console.error('Failed to register commands:', err);
    }
})();
