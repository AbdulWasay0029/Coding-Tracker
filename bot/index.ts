import { Client, GatewayIntentBits, Interaction } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Fly.io health check — only starts when PORT env var is set (on Fly.io)
// Railway and local runs are unaffected
if (process.env.PORT) {
    http.createServer((_, res) => { res.writeHead(200); res.end('ok'); })
        .listen(Number(process.env.PORT));
    console.log(`Health check on :${process.env.PORT}`);
}

import { handleAddProfile } from './commands/add-profile';
import { handleRemoveProfile } from './commands/remove-profile';
import { handleListProfiles } from './commands/list-profiles';
import { handleCheck } from './commands/check';
import { handleRecheckButton } from './commands/check';
import { handleHelp } from './commands/help';

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
                case 'help': await handleHelp(interaction); break;
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
