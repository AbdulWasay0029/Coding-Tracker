import axios from 'axios';
import { Submission } from './leetcode';

const CF_API = 'https://codeforces.com/api/user.status';

export async function fetchCodeforcesSubmissions(username: string, count = 20): Promise<Submission[]> {
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

        const submissions = response.data.result;

        // Filter for AC (Accepted) solutions
        const acSubmissions = submissions.filter((sub: any) => sub.verdict === 'OK');

        return acSubmissions.map((sub: any) => ({
            id: sub.id.toString(),
            title: `${sub.problem.index}. ${sub.problem.name}`,
            titleSlug: `${sub.problem.contestId}-${sub.problem.index}`,
            timestamp: sub.creationTimeSeconds,
            url: `https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`,
        }));

    } catch (error) {
        console.error('Error fetching Codeforces submissions:', error);
        return [];
    }
}
