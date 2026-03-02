import {
    ChatInputCommandInteraction,
    ButtonInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { runTrackerForUser, getTimestampsForDate } from '../tracker';

// ─── Shared: build the Re-check button row ───────────────────────────────────

function buildRecheckButton(discordUserId: string, start: number, end: number) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`recheck:${discordUserId}:${start}:${end}`)
            .setLabel('🔁 Re-check')
            .setStyle(ButtonStyle.Secondary)
    );
}

// ─── Shared: run check + format reply ────────────────────────────────────────

async function runAndReply(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
    dateStr: string,
    reply: (opts: { content: string; components?: any[] }) => Promise<void>,
    followUp: (opts: { content: string }) => Promise<void>
) {
    const result = await runTrackerForUser(userId, startTimestamp, endTimestamp);
    const button = buildRecheckButton(userId, startTimestamp, endTimestamp);

    if (result.errors.includes('no_profiles')) {
        await reply({
            content: "You have no profiles set up. Use `/add-profile` to add one first.",
            components: [],
        });
        return;
    }

    if (result.links.length === 0) {
        await reply({
            content: `📅 **${dateStr}** — No problems solved yet.`,
            components: [button],
        });
        return;
    }

    // Chunk links into Discord-safe message sizes (≤2000 chars)
    const chunks: string[] = [];
    let current = '';
    for (const link of result.links) {
        const line = link + '\n\n';
        if (current.length + line.length > 1900) {
            chunks.push(current.trim());
            current = '';
        }
        current += line;
    }
    if (current.trim()) chunks.push(current.trim());

    // First chunk — includes the header and the Re-check button
    await reply({
        content: `📅 **${dateStr}** — ${result.links.length} problem(s):\n\n${chunks[0]}`,
        components: [button],
    });

    // Overflow chunks (no button on follow-ups to avoid clutter)
    for (let i = 1; i < chunks.length; i++) {
        await followUp({ content: chunks[i] });
    }
}

// ─── /check command ───────────────────────────────────────────────────────────

export async function handleCheck(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const dateParam = interaction.options.getString('date');

    if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        await interaction.editReply('❌ Invalid date format. Use `YYYY-MM-DD`, e.g. `2026-03-01`');
        return;
    }

    const { startTimestamp, endTimestamp, dateStr } = getTimestampsForDate(dateParam);

    await runAndReply(
        interaction.user.id,
        startTimestamp,
        endTimestamp,
        dateStr,
        opts => interaction.editReply(opts),
        opts => interaction.followUp(opts).then(() => undefined),
    );
}

// ─── 🔁 Re-check button handler ───────────────────────────────────────────────

export async function handleRecheckButton(interaction: ButtonInteraction) {
    // customId format: recheck:{discordUserId}:{startTimestamp}:{endTimestamp}
    const [, userId, startStr, endStr] = interaction.customId.split(':');

    // Only the original user can trigger their own re-check
    if (interaction.user.id !== userId) {
        await interaction.reply({
            content: '❌ This check belongs to someone else.',
            ephemeral: true,
        });
        return;
    }

    await interaction.deferReply();

    const startTimestamp = parseInt(startStr, 10);
    const endTimestamp = parseInt(endStr, 10);
    const dateStr = new Date((startTimestamp + 5.5 * 3600) * 1000).toISOString().split('T')[0];

    await runAndReply(
        userId,
        startTimestamp,
        endTimestamp,
        dateStr,
        opts => interaction.editReply(opts),
        opts => interaction.followUp(opts).then(() => undefined),
    );
}
