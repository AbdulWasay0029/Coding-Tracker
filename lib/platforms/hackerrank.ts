import axios from 'axios';
import { Submission } from './leetcode';

const BASE = 'https://www.hackerrank.com';

export async function fetchHackerRankSubmissions(username: string, stopBeforeTimestamp?: number): Promise<Submission[]> {
    try {
        const submissions: Submission[] = [];
        const seen = new Set<string>();

        const limit = 50;
        const maxOffsets = stopBeforeTimestamp ? 20 : 1; // up to 1000 items
        let offset = 0;
        let hitOlderDate = false;

        while (offset < maxOffsets * limit) {
            if (hitOlderDate) break;

            const { data } = await axios.get(
                `${BASE}/rest/hackers/${encodeURIComponent(username)}/recent_challenges?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Accept': 'application/json',
                    },
                }
            );

            if (!data.models || !Array.isArray(data.models) || data.models.length === 0) break;

            for (const challenge of data.models) {
                const timestamp = Math.floor(new Date(challenge.created_at).getTime() / 1000);
                if (stopBeforeTimestamp && timestamp < stopBeforeTimestamp) {
                    hitOlderDate = true;
                    break; 
                }

                const slug: string = challenge.ch_slug || challenge.url?.split('/').pop() || '';

                if (seen.has(slug)) continue;
                seen.add(slug);

                const url = `${BASE}${challenge.url}`;

                submissions.push({
                    id: `HR-${slug}`,
                    title: challenge.name || slug,
                    titleSlug: slug,
                    timestamp,
                    url,
                });
            }
            
            offset += limit;
        }

        return submissions;

    } catch (error) {
        console.warn(`[HackerRank] Failed to fetch for ${username}:`, error);
        return [];
    }
}
