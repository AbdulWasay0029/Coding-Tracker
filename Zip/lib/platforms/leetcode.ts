import axios from 'axios';

export interface Submission {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: number; // Unix timestamp in seconds
    url: string;
}

const LEETCODE_API = 'https://leetcode.com/graphql';

export async function fetchLeetCodeSubmissions(username: string, limit = 20): Promise<Submission[]> {
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

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            titleSlug: item.titleSlug,
            timestamp: parseInt(item.timestamp),
            url: `https://leetcode.com/problems/${item.titleSlug}/`,
        }));
    } catch (error) {
        console.error('Error fetching LeetCode submissions:', error);
        return [];
    }
}
