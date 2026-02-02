import axios from 'axios';
import * as cheerio from 'cheerio';
import { Submission } from './leetcode';

const CC_API = 'https://www.codechef.com/recent/user';

export async function fetchCodeChefSubmissions(username: string): Promise<Submission[]> {
    try {
        const response = await axios.get(CC_API, {
            params: {
                page: 0,
                user_handle: username,
                sort_by: 'timestamp',
                sorting_order: 'desc',
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (!response.data || !response.data.content) {
            return [];
        }

        // Parse HTML content
        const $ = cheerio.load(response.data.content);
        const submissions: Submission[] = [];

        $('tr').each((_, row) => {
            // Typical row: [Time, ProblemCode, Result, ...]
            const cols = $(row).find('td');
            if (cols.length === 0) return;

            // Result check (look for accepted icon or text)
            const isAccepted = $(row).html()?.includes('/tick-icon.png') || $(row).html()?.includes('accepted');

            if (!isAccepted) return;

            const problemLink = $(cols).find('a[href*="/problems/"]').first();
            const problemCode = problemLink.text().trim();
            const problemUrl = `https://www.codechef.com${problemLink.attr('href')}`;

            // Extract timestamp from tooltip
            // User says there's a timer icon with hover. 
            // Often it's the first column: <td> <span title="DD/MM/YYYY HH:MM ..."> 2 min ago </span> </td>
            const timeSpan = $(cols).first().find('span[title]');
            let timeStr = timeSpan.attr('title');

            if (!timeStr) {
                // Fallback: try direct text if format allows, or look for other tooltips
                timeStr = $(cols).first().text().trim();
            }

            // Clean up time string if needed
            // CodeChef format examples: "8 min ago", "09:09 PM 28/01/26"

            let timestamp: number;

            if (timeStr?.includes('ago')) {
                // Parse relative time
                const num = parseInt(timeStr.match(/\d+/)?.[0] || '0');
                const now = Math.floor(Date.now() / 1000);
                if (timeStr.includes('sec')) timestamp = now - num;
                else if (timeStr.includes('min')) timestamp = now - num * 60;
                else if (timeStr.includes('hour')) timestamp = now - num * 3600;
                else if (timeStr.includes('day')) timestamp = now - num * 86400;
                else timestamp = now;
            } else {
                // Parse absolute time: "09:09 PM 28/01/26"
                // Split date and time
                try {
                    // Normalize to simpler format if possible or parse manually
                    // Assume DD/MM/YY
                    const parts = timeStr?.split(' ') || [];
                    if (parts.length >= 3) {
                        const timePart = parts[0]; // 09:09
                        const ampm = parts[1];      // PM
                        const datePart = parts[2];  // 28/01/26

                        const [hours, mins] = timePart.split(':').map(Number);
                        const [day, month, yearShort] = datePart.split('/').map(Number);
                        const year = 2000 + yearShort;

                        let hour24 = hours;
                        if (ampm === 'PM' && hours !== 12) hour24 += 12;
                        if (ampm === 'AM' && hours === 12) hour24 = 0;

                        const dateObj = new Date(year, month - 1, day, hour24, mins);
                        timestamp = Math.floor(dateObj.getTime() / 1000);
                    } else {
                        // Fallback
                        timestamp = Math.floor(Date.now() / 1000);
                    }
                } catch (e) {
                    timestamp = Math.floor(Date.now() / 1000);
                }
            }

            if (problemCode) {
                submissions.push({
                    id: `${username}-${problemCode}-${timestamp}`,
                    title: problemCode,
                    titleSlug: problemCode,
                    timestamp: timestamp,
                    url: problemUrl
                });
            }
        });

        return submissions;

    } catch (error) {
        console.warn('CodeChef fetch failed:', error);
        return [];
    }
}
