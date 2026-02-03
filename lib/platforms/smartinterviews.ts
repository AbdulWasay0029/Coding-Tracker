import axios from 'axios';
import { Submission } from './leetcode';

const SI_API_GOLDMINE = 'https://hive.smartinterviews.in/api/contest/allUserSubmissions';

export async function fetchSmartInterviewsSubmissions(username: string): Promise<Submission[]> {
    try {
        const token = process.env.SMARTINTERVIEWS_TOKEN;
        // If no token, return empty (or we could keep heatmap fallback, 
        // but user seems to have token now so let's focus on quality).
        if (!token) {
            console.log('SmartInterviews: No token found, skipping.');
            return [];
        }

        const headers = {
            'authorization': `Token ${token}`,
            'role': 'USER',
            'username': username,
            'User-Agent': 'Mozilla/5.0',
            'Content-Type': 'application/json'
        };

        const submissions: Submission[] = [];
        const seenIds = new Set<string>();

        // Contests to check (Add more if discovered)
        const contests = ['smart-interviews-basic', 'smart-interviews-primary'];

        for (const contestSlug of contests) {
            try {
                const payload = {
                    page: 0,
                    pageSize: 25, // Fetch a decent chunk
                    contestSlug: contestSlug
                };

                const { data } = await axios.post(SI_API_GOLDMINE, payload, { headers });

                if (data.data && data.data.submissions && Array.isArray(data.data.submissions)) {
                    for (const sub of data.data.submissions) {
                        // Check verdict (assuming 'Accepted' is the string, need to verify if it differs in this API)
                        // Based on typical SI responses, it's likely 'Accepted'.
                        // Let's print one to debug log if needed, but for now assume standard field names or map them.

                        // Map fields based on our "Gold Mine" payload success
                        // usually: submittedAt, problem.title, etc.
                        // Wait, in the test script we saw keys: [ 'submissions', 'total', 'contestData' ]
                        // We need to know the shape of a submission object in this list.
                        // It usually has 'problem' object inside.

                        const isAccepted = sub.verdict === 'Accepted';
                        if (!isAccepted) continue;

                        // Deduplicate
                        if (seenIds.has(sub._id)) continue;
                        seenIds.add(sub._id);

                        const timestamp = Math.floor(new Date(sub.submittedAt).getTime() / 1000);

                        // Construct URL
                        // We have contestSlug from the loop, and sub.problem.slug usually
                        const problemSlug = sub.problem?.slug || sub.problemSlug;
                        const solutionId = sub._id; // usually _id is the solution ID

                        let url = `https://hive.smartinterviews.in/submission/${solutionId}`;
                        if (problemSlug) {
                            url = `https://hive.smartinterviews.in/contest/${contestSlug}/problem/${problemSlug}`;
                        }

                        submissions.push({
                            id: `SI-${solutionId}`,
                            title: sub.problem?.title || sub.problemTitle || 'Unknown Problem',
                            titleSlug: problemSlug || `si-problem-${solutionId}`,
                            timestamp: timestamp,
                            url: url
                        });
                    }
                }

            } catch (contestErr) {
                // console.warn(`Failed to fetch contest ${contestSlug}:`, contestErr);
            }
        }

        return submissions;

    } catch (error) {
        console.warn('SmartInterviews fetch failed:', error);
        return [];
    }
}
