import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    // The id will end in .svg, e.g. 481554233817300993.svg
    const discordUserId = id.replace('.svg', '');

    try {
        // Query the user's solved problems
        const problems = await prisma.solvedProblem.findMany({
            where: { discordUserId },
            orderBy: { solvedAt: 'desc' }
        });

        // Calculate stats
        const totalTracked = problems.length;
        
        // Calculate recent weekly activity
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyActivity = problems.filter(p => p.solvedAt >= oneWeekAgo).length;

        // Calculate streak (unique days)
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const uniqueDates = Array.from(new Set(problems.map(p => {
            const d = new Date(p.solvedAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }))).sort((a, b) => b - a);

        for (let i = 0; i < uniqueDates.length; i++) {
            const diffDays = Math.floor((currentDate.getTime() - uniqueDates[i]) / (1000 * 60 * 60 * 24));
            if (diffDays === 0 || diffDays === 1) {
                // If they solved today or yesterday, it counts towards the current streak
                streak++;
                currentDate = new Date(uniqueDates[i]);
            } else if (diffDays > 1) {
                break;
            }
        }

        // Determine title
        let title = "CodeSync Initiate";
        if (streak >= 3) title = "Consistent Coder";
        if (streak >= 7) title = "Grind Master";
        if (streak >= 30) title = "Unstoppable Algorithm";
        
        if (totalTracked === 0) {
            streak = 0;
            title = "Unranked";
        }

        // Generate SVG string (using glassmorphism / toxic green aesthetic)
        const svg = `
<svg width="400" height="150" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0E14" />
      <stop offset="100%" stop-color="#1A1D24" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="100%" height="100%" rx="12" fill="url(#bg)" stroke="#3B82F6" stroke-width="2" stroke-opacity="0.3" />
  
  <g transform="translate(20, 30)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">CodeSync Stats</text>
    <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="12" font-weight="500" fill="url(#accent)">${title}</text>
  </g>

  <g transform="translate(20, 80)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="12" fill="#ffffff" opacity="0.6">Total Tracked Progress</text>
    <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff">${totalTracked}</text>
  </g>

  <g transform="translate(150, 80)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="12" fill="#ffffff" opacity="0.6">Weekly Activity</text>
    <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="#3B82F6">${weeklyActivity}</text>
  </g>

  <g transform="translate(260, 80)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="12" fill="#ffffff" opacity="0.6">Current Streak</text>
    <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="#10B981" filter="url(#glow)">${streak} 🔥</text>
  </g>

  <circle cx="370" cy="30" r="4" fill="#10B981" filter="url(#glow)" />
</svg>`;

        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=14400, s-maxage=14400' // 4 hours
            }
        });

    } catch (error) {
        console.error('Error generating SVG widget:', error);
        return new NextResponse('Error generating SVG', { status: 500 });
    }
}
