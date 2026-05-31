import {
    ChatInputCommandInteraction,
    ButtonInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { runTrackerForUser, getTimestampsForDate } from '../../jobs/tracker';
import { prisma } from '../../core/prisma';

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
            .setDescription('I checked for your solved problems, but it looks like you haven\'t connected any coding profiles yet.')
            .addFields(
                { name: 'How to start', value: 'Please log into the [CodeSync Dashboard](https://codesync-hub.vercel.app/dashboard) to securely link your accounts.' }
            )
            .setColor(0x00F0FF);

        await reply({ embeds: [welcomeEmbed], components: [] });
        return;
    }

    const hasLinks = result.links.length > 0;
    const row = buildActionRow(userId, startTimestamp, endTimestamp, hasLinks);

    if (!hasLinks) {
        const isToday = dateStr === new Date(Date.now() + 5.5 * 3600000).toISOString().split('T')[0];
        
        const emptyEmbed = new EmbedBuilder()
            .setTitle(`📅 ${dateStr} Report`)
            .setDescription(`No problems solved ${isToday ? 'yet today' : 'on this date'}. Keep grinding!`)
            .setColor(0x00F0FF); // CodeSync Cyan

        if (result.errors && result.errors.length > 0) {
            emptyEmbed.addFields({ name: '⚠️ Sync Warnings', value: `${result.errors.join(', ')}\n*Tokens may have expired. Reconnect on the web dashboard.*` });
        }

        await reply({ embeds: [emptyEmbed], components: [row] });
        return;
    }

    // Format dateStr from YYYY-MM-DD to DD/MM/YYYY
    const [yyyy, mm, dd] = dateStr.split('-');
    const displayDate = `${dd}/${mm}/${yyyy}`;

    // Format grouped links for Embed
    const embed = new EmbedBuilder()
        .setTitle(`📅 ${displayDate} Report`)
        .setDescription(`**${result.links.length}** problem(s) solved!`)
        .setColor(0x39FF14); // CodeSync Toxic Green

    for (const [platform, items] of Object.entries(result.groupedLinks)) {
        const name = PLATFORM_NAMES[platform] || platform;
        const emoji = PLATFORM_EMOJI[platform] || '⚪';
        
        const linkList = items.map(item => `• [${item.title}](${item.url})`).join('\n');
        
        embed.addFields({
            name: `${emoji} ${name} (${items.length})`,
            value: linkList
        });
    }

    if (result.errors && result.errors.length > 0) {
        embed.addFields({ name: '⚠️ Sync Warnings', value: `${result.errors.join(', ')}\n*Tokens may have expired. Reconnect on the web dashboard.*` });
    }

    await reply({ embeds: [embed], components: [row] });
}

// ─── /check command ───────────────────────────────────────────────────────────

export async function handleCheck(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const dateVal = interaction.options.getString('date') || 'today';
    const { startTimestamp, endTimestamp, dateStr, warning } = getTimestampsForDate(dateVal, interaction.user.id);

    if (warning) {
        // Send warning ephemerally before the main reply.
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

    // Since we now use Embeds, we need to extract from embed fields
    const embeds = interaction.message.embeds;
    if (!embeds || embeds.length === 0) {
        return interaction.editReply('No links found in the original message to copy.');
    }

    const links: string[] = [];
    const regex = /\]\((https?:\/\/[^\s\)]+)\)/g; // Extract URL from markdown link `[View Problem](URL)`
    
    for (const field of embeds[0].fields) {
        let match;
        while ((match = regex.exec(field.value)) !== null) {
            links.push(match[1]);
        }
    }

    if (links.length === 0) {
        return interaction.editReply('No links found in the original message to copy.');
    }

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
