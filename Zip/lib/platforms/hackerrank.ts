import axios from 'axios';
import { Submission } from './leetcode';

const BASE = 'https://www.hackerrank.com';

export async function fetchHackerRankSubmissions(username: string): Promise<Submission[]> {
    try {
        const submissions: Submission[] = [];
        const seen = new Set<string>();

        // Fetch up to 50 recent challenges (2 pages of 25)
        // — cursor pagination for older, but 25 is plenty for a daily check
        const { data } = await axios.get(
            `${BASE}/rest/hackers/${encodeURIComponent(username)}/recent_challenges?limit=50&offset=0`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json',
                },
            }
        );

        if (!data.models || !Array.isArray(data.models)) return [];

        for (const challenge of data.models) {
            const slug: string = challenge.ch_slug || challenge.url?.split('/').pop() || '';

            // Deduplicate by slug
            if (seen.has(slug)) continue;
            seen.add(slug);

            const timestamp = Math.floor(new Date(challenge.created_at).getTime() / 1000);
            const url = `${BASE}${challenge.url}`;

            submissions.push({
                id: `HR-${slug}`,
                title: challenge.name || slug,
                titleSlug: slug,
                timestamp,
                url,
            });
        }

        return submissions;

    } catch (error) {
        console.warn(`[HackerRank] Failed to fetch for ${username}:`, error);
        return [];
    }
}
