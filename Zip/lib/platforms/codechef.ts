import axios from 'axios';
import * as cheerio from 'cheerio';
import { Submission } from './leetcode';

const CC_API = 'https://www.codechef.com/recent/user';

export async function fetchCodeChefSubmissions(username: string): Promise<Submission[]> {
    const submissions: Submission[] = [];
    const MAX_PAGES = 5; // Scrape up to 5 pages

    for (let page = 0; page < MAX_PAGES; page++) {
        try {
            const response = await axios.get(CC_API, {
                params: {
                    page: page,
                    user_handle: username,
                    sort_by: 'timestamp',
                    sorting_order: 'desc',
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                }
            });

            if (!response.data || !response.data.content) {
                break; // End of available pages
            }

            // Parse HTML content
            const $ = cheerio.load(response.data.content);
            const rows = $('tr');
            
            if (rows.length === 0) {
                break; // No rows means no more submissions
            }

            let pageHasAccepted = false;

            $('tr').each((_, row) => {
                // Typical row: [Time, ProblemCode, Result, ...]
                const cols = $(row).find('td');
                if (cols.length === 0) return;

                // Result check (look for accepted icon or text)
                const isAccepted = $(row).html()?.includes('/tick-icon.png') || $(row).html()?.includes('accepted');

                if (!isAccepted) return;
                
                pageHasAccepted = true;

                const problemLink = $(cols).find('a[href*="/problems/"]').first();
                const problemCode = problemLink.text().trim();
                const problemUrl = `https://www.codechef.com${problemLink.attr('href')}`;

                // Extract timestamp from tooltip
                const timeSpan = $(cols).first().find('span[title]');
                let timeStr = timeSpan.attr('title');

                if (!timeStr) {
                    timeStr = $(cols).first().text().trim();
                }

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
                    try {
                        const parts = timeStr?.split(' ') || [];
                        if (parts.length >= 3) {
                            const timePart = parts[0]; 
                            const ampm = parts[1];      
                            const datePart = parts[2];  

                            const [hours, mins] = timePart.split(':').map(Number);
                            const [day, month, yearShort] = datePart.split('/').map(Number);
                            const year = 2000 + yearShort;

                            let hour24 = hours;
                            if (ampm === 'PM' && hours !== 12) hour24 += 12;
                            if (ampm === 'AM' && hours === 12) hour24 = 0;

                            const dateObj = new Date(year, month - 1, day, hour24, mins);
                            timestamp = Math.floor(dateObj.getTime() / 1000);
                        } else {
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

            // If the max_page returned tells us we reached the end, we could break too:
            // if (response.data.max_page && page >= response.data.max_page) break;

        } catch (error) {
            console.warn(`CodeChef fetch failed on page ${page}:`, error);
            break; // Stop fetching on error to prevent infinite loops/hangs
        }
    }

    return submissions;
}
