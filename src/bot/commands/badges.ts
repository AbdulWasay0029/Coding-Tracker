import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../core/prisma';

export async function handleBadges(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userId = targetUser.id;

        const [solves, profiles] = await Promise.all([
            prisma.solvedProblem.findMany({
                where: { discordUserId: userId },
                orderBy: { solvedAt: 'desc' }
            }),
            prisma.userProfile.findMany({
                where: { discordUserId: userId }
            })
        ]);

        const totalSolves = solves.length;
        const connectedPlatforms = new Set(profiles.map(p => p.platform));

        let maxSolvesInOneDay = 0;
        const solvesPerDay: Record<string, number> = {};
        let hasNightOwl = false;
        let hasEarlyBird = false;
        let hasWeekendWarrior = false;
        
        let hasCodeChef = connectedPlatforms.has('CODECHEF');
        let hasCodeforces = connectedPlatforms.has('CODEFORCES');
        let hasLeetCode = connectedPlatforms.has('LEETCODE');
        let hasSmartInterviews = connectedPlatforms.has('SMARTINTERVIEWS');

        for (const s of solves) {
            const istDate = new Date(s.solvedAt.getTime() + 5.5 * 60 * 60 * 1000);
            const dateStr = istDate.toISOString().split('T')[0];
            
            solvesPerDay[dateStr] = (solvesPerDay[dateStr] || 0) + 1;
            if (solvesPerDay[dateStr] > maxSolvesInOneDay) {
                maxSolvesInOneDay = solvesPerDay[dateStr];
            }

            const hour = istDate.getUTCHours();
            const day = istDate.getUTCDay();

            if (hour >= 0 && hour < 4) hasNightOwl = true;
            if (hour >= 5 && hour < 9) hasEarlyBird = true;

            if ((day === 0 || day === 6) && solvesPerDay[dateStr] >= 5) {
                hasWeekendWarrior = true;
            }

            if (s.platform === 'CODECHEF') hasCodeChef = true;
            if (s.platform === 'CODEFORCES') hasCodeforces = true;
            if (s.platform === 'LEETCODE') hasLeetCode = true;
            if (s.platform === 'SMARTINTERVIEWS') hasSmartInterviews = true;
        }

        const badges = [
            { name: 'First Blood', emoji: '⚡', unlocked: totalSolves > 0 },
            { name: 'Night Owl', emoji: '🌙', unlocked: hasNightOwl },
            { name: 'Early Bird', emoji: '🌅', unlocked: hasEarlyBird },
            { name: 'Weekend Warrior', emoji: '📅', unlocked: hasWeekendWarrior },
            { name: 'LeetCode Legend', emoji: '🟡', unlocked: hasLeetCode },
            { name: 'CF Specialist', emoji: '🔵', unlocked: hasCodeforces },
            { name: 'Smart Cookie', emoji: '🟣', unlocked: hasSmartInterviews },
            { name: 'Master Chef', emoji: '🟤', unlocked: hasCodeChef },
            { name: 'The Daily Grind', emoji: '🎯', unlocked: maxSolvesInOneDay >= 10 },
            { name: 'The Century Club', emoji: '💯', unlocked: totalSolves >= 100 },
            { name: 'The Polyglot', emoji: '🌍', unlocked: connectedPlatforms.size >= 3 },
            { name: 'CodeSync Veteran', emoji: '🛡️', unlocked: totalSolves >= 500 }
        ];

        const unlockedBadges = badges.filter(b => b.unlocked);
        const lockedBadges = badges.filter(b => !b.unlocked);

        let description = '';
        
        if (unlockedBadges.length > 0) {
            description += `**🔓 Unlocked (${unlockedBadges.length}/${badges.length})**\n`;
            description += unlockedBadges.map(b => `${b.emoji} **${b.name}**`).join('\n');
            description += '\n\n';
        } else {
            description += `**🔓 Unlocked (0/${badges.length})**\n*No badges unlocked yet.*\n\n`;
        }

        if (lockedBadges.length > 0) {
            description += `**🔒 Locked**\n`;
            description += lockedBadges.map(b => `~~${b.emoji} ${b.name}~~`).join(' · ');
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${targetUser.username}'s Achievements`, iconURL: targetUser.displayAvatarURL() })
            .setDescription(description)
            // Use CodeSync Blue to balance out the Toxic Green from stats
            .setColor(0x3B82F6) 
            .setFooter({ text: 'CodeSync Gamification Engine' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

    } catch (err) {
        console.error('[Badges] Error:', err);
        await interaction.editReply('❌ Failed to pull badges.');
    }
}
