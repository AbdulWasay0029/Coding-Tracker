import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
    try {
        console.log('🗑️ Deleting all global application commands to fix duplicates...');
        
        // Passing an empty array to Global Commands effectively deletes all of them.
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
            { body: [] }
        );

        console.log('✅ Successfully deleted all global commands.');
        console.log('Only Guild-specific commands remain! The duplicates should disappear instantly in Discord.');
    } catch (err) {
        console.error('❌ Failed to delete global commands:', err);
    }
})();
