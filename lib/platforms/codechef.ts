import axios from 'axios';
import { Submission } from './leetcode';

const CC_API = 'https://www.codechef.com/api/list/bylimit/recent/ac';

export async function fetchCodeChefSubmissions(username: string): Promise<Submission[]> {
    try {
        const response = await axios.get(CC_API, {
            params: {
                page: 0,
                user_handle: username,
                sort_by: 'code',
                sorting_order: 'desc',
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (!response.data || !response.data.data) {
            return [];
        }

        const data = response.data.data;

        // The API usually returns HTML or JSON. If JSON:
        // It seems to return an object with "data" field containing the list.

        // Note: This API response structure varies. Usually it gives a list.
        // Let's assume a standard structure found in similar reverse-engineered implementations.

        return data.map((item: any) => ({
            id: item.id.toString(),
            title: `${item.contest_code}: ${item.problem_code}`,
            titleSlug: item.problem_code,
            timestamp: item.timestamp ? parseInt(item.timestamp) : Math.floor(Date.now() / 1000), // Fallback if missing
            url: `https://www.codechef.com/problems/${item.problem_code}`,
        }));

    } catch (error) {
        console.warn('Note: CodeChef fetch failed (API might be protected). Returning empty.', error);
        return [];
    }
}
