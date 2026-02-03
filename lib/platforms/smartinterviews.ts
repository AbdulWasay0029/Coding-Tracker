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

                        // Map fields based on our "Gold Mine" payload success
                        // usually: submittedAt, problem.title, etc.
                        // Wait, in the test script we saw keys: [ 'submissions', 'total', 'contestData' ]
                        // We need to know the shape of a submission object in this list.
                        // It usually has 'problem' object inside.

                        // Debug logs show keys are direct: problemSlug, problemTitle, solutionId
                        // NOT nested in 'problem' object, and 'solutionId' instead of '_id'

                        const isAccepted = sub.verdict === 'Accepted';
                        if (!isAccepted) continue;

                        // Deduplicate using solutionId
                        if (seenIds.has(sub.solutionId)) continue;
                        seenIds.add(sub.solutionId);

                        const timestamp = Math.floor(new Date(sub.submittedAt).getTime() / 1000);

                        // Construct URL
                        const problemSlug = sub.problemSlug;

                        let url = `https://hive.smartinterviews.in/submission/${sub.solutionId}`;
                        if (problemSlug) {
                            url = `https://hive.smartinterviews.in/contest/${contestSlug}/problem/${problemSlug}`;
                        }

                        submissions.push({
                            id: `SI-${sub.solutionId}`,
                            title: sub.problemTitle || 'Unknown Problem',
                            titleSlug: problemSlug || `si-problem-${sub.solutionId}`,
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
