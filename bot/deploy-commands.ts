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
];

const commands = [
    new SlashCommandBuilder()
        .setName('add-profile')
        .setDescription('Add a coding platform profile to track')
        .addStringOption(o => o
            .setName('platform').setDescription('The platform').setRequired(true)
            .addChoices(...PLATFORM_CHOICES))
        .addStringOption(o => o
            .setName('username').setDescription('Your username on that platform').setRequired(true))
        .addStringOption(o => o
            .setName('token').setDescription('JWT token — SmartInterviews only').setRequired(false)),

    new SlashCommandBuilder()
        .setName('remove-profile')
        .setDescription('Remove a tracked profile')
        .addStringOption(o => o
            .setName('platform').setDescription('The platform').setRequired(true)
            .addChoices(...PLATFORM_CHOICES))
        .addStringOption(o => o
            .setName('username').setDescription('Your username').setRequired(true)),

    new SlashCommandBuilder()
        .setName('list-profiles')
        .setDescription('List all your currently tracked profiles'),

    new SlashCommandBuilder()
        .setName('check')
        .setDescription('Fetch all problems you solved and post the links')
        .addStringOption(o => o
            .setName('date')
            .setDescription('Date to check — YYYY-MM-DD (defaults to today IST)')
            .setRequired(false)),
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
