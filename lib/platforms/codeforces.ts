import axios from 'axios';
import { Submission } from './leetcode';

const CF_API = 'https://codeforces.com/api/user.status';

export async function fetchCodeforcesSubmissions(username: string, stopBeforeTimestamp?: number): Promise<Submission[]> {
    const count = stopBeforeTimestamp ? 200 : 20;
    try {
        const response = await axios.get(CF_API, {
            params: {
                handle: username,
                from: 1,
                count,
            },
        });

        if (response.data.status !== 'OK') {
            console.error('Codeforces API Error:', response.data.comment);
            return [];
        }

        const rawSubmissions = response.data.result;
        const processedSubmissions: Submission[] = [];

        for (const sub of rawSubmissions) {
            const timestamp = sub.creationTimeSeconds;
            if (stopBeforeTimestamp && timestamp < stopBeforeTimestamp) {
                break; // Found older submissions, safe to stop
            }
            if (sub.verdict === 'OK') {
                processedSubmissions.push({
                    id: sub.id.toString(),
                    title: `${sub.problem.index}. ${sub.problem.name}`,
                    titleSlug: `${sub.problem.contestId}-${sub.problem.index}`,
                    timestamp: timestamp,
                    url: `https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`,
                });
            }
        }

        return processedSubmissions;
    } catch (error) {
        console.error('Error fetching Codeforces submissions:', error);
        return [];
    }
}
