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

            // Clean up time string if needed (sometimes has ' sec ago' etc in text, but title should be date)
            // CodeChef title format: "10:30 PM 02/02/2026"
            const timestamp = Date.parse(timeStr || '') / 1000 || Math.floor(Date.now() / 1000);

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
