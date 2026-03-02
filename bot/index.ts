import { Client, GatewayIntentBits, Interaction } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { handleAddProfile } from './commands/add-profile';
import { handleRemoveProfile } from './commands/remove-profile';
import { handleListProfiles } from './commands/list-profiles';
import { handleCheck } from './commands/check';
import { handleRecheckButton } from './commands/check'; // button re-uses check logic

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`✅ Bot online as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'add-profile': await handleAddProfile(interaction); break;
                case 'remove-profile': await handleRemoveProfile(interaction); break;
                case 'list-profiles': await handleListProfiles(interaction); break;
                case 'check': await handleCheck(interaction); break;
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('recheck:')) {
                await handleRecheckButton(interaction);
            }
        }
    } catch (err) {
        console.error('Unhandled interaction error:', err);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
