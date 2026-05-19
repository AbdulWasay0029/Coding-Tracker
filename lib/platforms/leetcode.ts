import axios from 'axios';

export interface Submission {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: number; // Unix timestamp in seconds
    url: string;
}

const LEETCODE_API = 'https://leetcode.com/graphql';

export async function fetchLeetCodeSubmissions(username: string, stopBeforeTimestamp?: number): Promise<Submission[]> {
    const limit = stopBeforeTimestamp ? 100 : 20;
    const query = `
    query getRecentSubmissions($username: String!, $limit: Int) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

    try {
        const response = await axios.post(
            LEETCODE_API,
            {
                query,
                variables: { username, limit },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; CodingPlatformTracker/1.0)',
                },
            }
        );

        if (response.data.errors) {
            console.error('LeetCode GraphQL Errors:', response.data.errors);
            return [];
        }

        const data = response.data.data.recentAcSubmissionList;
        if (!Array.isArray(data)) return [];

        const submissions: Submission[] = [];
        for (const item of data) {
            const timestamp = parseInt(item.timestamp);
            if (stopBeforeTimestamp && timestamp < stopBeforeTimestamp) {
                break; // Found older submissions, safe to stop
            }
            submissions.push({
                id: item.id,
                title: item.title,
                titleSlug: item.titleSlug,
                timestamp: timestamp,
                url: `https://leetcode.com/problems/${item.titleSlug}/`,
            });
        }
        return submissions;
    } catch (error) {
        console.error('Error fetching LeetCode submissions:', error);
        return [];
    }
}
