import {
    ChatInputCommandInteraction,
    ButtonInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { runTrackerForUser, getTimestampsForDate } from '../tracker';
import { prisma } from '../../lib/prisma';

// ─── Constants for labeling ──────────────────────────────────────────────────

const PLATFORM_NAMES: Record<string, string> = {
    LEETCODE: 'LeetCode',
    CODEFORCES: 'Codeforces',
    CODECHEF: 'CodeChef',
    HACKERRANK: 'HackerRank',
    SMARTINTERVIEWS: 'SmartInterviews',
};

const PLATFORM_EMOJI: Record<string, string> = {
    LEETCODE: '🟡',
    CODEFORCES: '🔵',
    CODECHEF: '🟤',
    HACKERRANK: '🟢',
    SMARTINTERVIEWS: '🟣',
};

// ─── Shared: build button row ────────────────────────────────────────────────

function buildActionRow(discordUserId: string, start: number, end: number, hasLinks: boolean) {
    const row = new ActionRowBuilder<ButtonBuilder>();

    row.addComponents(
        new ButtonBuilder()
            .setCustomId(`recheck:${discordUserId}:${start}:${end}`)
            .setLabel('Re-check')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔁')
    );

    if (hasLinks) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`copy_links:${discordUserId}:${start}:${end}`)
                .setLabel('Get Copyable List')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📋')
        );
    }

    return row;
}

// ─── Shared: run check + format reply ────────────────────────────────────────

async function runAndReply(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
    dateStr: string,
    reply: (opts: any) => Promise<unknown>,
    followUp: (opts: any) => Promise<unknown>
) {
    const result = await runTrackerForUser(userId, startTimestamp, endTimestamp);

    if (result.errors.includes('no_profiles')) {
        const welcomeEmbed = new EmbedBuilder()
            .setTitle('👋 Welcome to CodeSync!')
            .setDescription('I checked for your solved problems, but it looks like you haven\'t added any coding profiles yet.')
            .addFields(
                { name: 'How to start', value: 'Use **/add-profile** to register your accounts (LeetCode, Codeforces, etc.).' },
                { name: 'Need help?', value: 'Use **/help** for a full guide on getting your tokens/usernames.' }
            )
            .setColor(0x5865F2);

        await reply({ embeds: [welcomeEmbed], components: [] });
        return;
    }

    const hasLinks = result.links.length > 0;
    const row = buildActionRow(userId, startTimestamp, endTimestamp, hasLinks);

    if (!hasLinks) {
        let emptyContent = `📅 **${dateStr}** — No problems solved yet today. Keep grinding!`;
        if (result.errors && result.errors.length > 0) {
            emptyContent += `\n\n-# ⚠️ Errors: ${result.errors.map((e: string) => e).join(', ')} (Tokens expire! Run /add-profile to refresh)`;
        }
        await reply({
            content: emptyContent,
            components: [row],
        });
        return;
    }

    // Format grouped links
    let content = `📅 **${dateStr}** — ${result.links.length} problem(s) solved:\n\n`;

    for (const [platform, urls] of Object.entries(result.groupedLinks)) {
        const name = PLATFORM_NAMES[platform] || platform;
        const emoji = PLATFORM_EMOJI[platform] || '⚪';
        content += `${emoji} **${name}** (${urls.length})\n`;
        for (const url of urls) {
            content += `<${url}>\n`; // Angle brackets suppress embeds
        }
        content += '\n';
    }

    if (result.errors && result.errors.length > 0) {
        content += `\n-# ⚠️ Errors: ${result.errors.map(e => e).join(', ')} (Tokens expire! Run /add-profile to refresh)\n`;
    }

    // Handle Discord's 2000 char limit
    if (content.length <= 2000) {
        await reply({ content, components: [row] });
    } else {
        // Simple fallback if it expires char limit (unlikely with just links but possible)
        await reply({ content: `📅 **${dateStr}** — ${result.links.length} links (too many to show in one message, use "Get Copyable List")`, components: [row] });
    }
}

// ─── /check command ───────────────────────────────────────────────────────────

export async function handleCheck(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const dateVal = interaction.options.getString('date') || 'today';
    const { startTimestamp, endTimestamp, dateStr, warning } = getTimestampsForDate(dateVal);

    // Show a warning if the user gave an invalid date format
    if (warning) {
        await interaction.followUp({ content: warning, ephemeral: true });
    }

    await runAndReply(
        interaction.user.id,
        startTimestamp,
        endTimestamp,
        dateStr,
        opts => interaction.editReply(opts),
        opts => interaction.followUp(opts).then(() => undefined)
    );

    // Record Analytics
    await prisma.analyticsEvent.create({
        data: {
            discordUserId: interaction.user.id,
            command: 'check',
            metadata: JSON.stringify({ date: dateStr })
        }
    });
}
// ─── 📋 Copy Links button handler ─────────────────────────────────────────────

export async function handleCopyLinksButton(interaction: ButtonInteraction) {
    const [, userId, startStr, endStr] = interaction.customId.split(':');

    if (interaction.user.id !== userId) {
        return interaction.reply({ content: '❌ Only the person who ran the check can use this button.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    // Extract links straight from the embed/message to avoid re-scraping -> O(1) Local Cache Trick
    const messageContent = interaction.message.content;
    const regex = /<(https?:\/\/[^\s>]+)>/g;
    const links: string[] = [];
    let match;
    while ((match = regex.exec(messageContent)) !== null) {
        links.push(match[1]);
    }

    if (links.length === 0) {
        return interaction.editReply('No links found in the original message to copy.');
    }

    // Provide links in a clean block format
    const block = links.join('\n');
    await interaction.editReply({
        content: `Here are your links for today. Copy-paste them into your batch channel:\n\n\`\`\`\n${block}\n\`\`\``
    });
}

// ─── 🔁 Re-check button handler ───────────────────────────────────────────────

export async function handleRecheckButton(interaction: ButtonInteraction) {
    const [, userId, startStr, endStr] = interaction.customId.split(':');

    if (interaction.user.id !== userId) {
        return interaction.reply({ content: '❌ Only the person who ran the check can use this button.', ephemeral: true });
    }

    await interaction.deferReply();

    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    const dateStr = new Date((start + 5.5 * 3600) * 1000).toISOString().split('T')[0];

    await runAndReply(
        userId,
        start,
        end,
        dateStr,
        opts => interaction.editReply(opts),
        opts => interaction.followUp(opts).then(() => undefined),
    );
}
