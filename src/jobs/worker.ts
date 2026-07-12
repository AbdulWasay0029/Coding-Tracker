import { prisma } from '../core/prisma';
import { runTrackerForUser } from './tracker';

const WORKER_POLL_INTERVAL = 5000; // 5 seconds
let isWorkerRunning = false;

export function startWorker() {
    if (isWorkerRunning) return;
    isWorkerRunning = true;
    console.log('[Worker] Background Job Queue Processor Started.');
    pollQueue();
}

async function pollQueue() {
    try {
        // Find the oldest pending job
        const job = await prisma.scrapeJob.findFirst({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' }
        });

        if (!job) {
            // Queue is empty, wait and poll again
            setTimeout(pollQueue, WORKER_POLL_INTERVAL);
            return;
        }

        // Claim the job
        await prisma.scrapeJob.update({
            where: { id: job.id },
            data: { status: 'PROCESSING' }
        });

        console.log(`[Worker] Processing Job ${job.id} for user ${job.discordUserId}`);

        try {
            // Run the heavy tracker logic (which is now internally rate-limited and statefully cached)
            await runTrackerForUser(job.discordUserId, job.startTimestamp, job.endTimestamp, undefined, job.jobType);

            // Mark completed
            await prisma.scrapeJob.update({
                where: { id: job.id },
                data: { status: 'COMPLETED' }
            });
            console.log(`[Worker] Job ${job.id} completed successfully.`);

        } catch (jobError: any) {
            console.error(`[Worker] Job ${job.id} failed:`, jobError);
            
            const nextRetries = job.retries + 1;
            const nextStatus = nextRetries >= 3 ? 'FAILED' : 'PENDING';

            await prisma.scrapeJob.update({
                where: { id: job.id },
                data: { 
                    status: nextStatus,
                    retries: nextRetries,
                    error: jobError.message || String(jobError)
                }
            });
        }

        // Loop immediately for the next job
        // Use setImmediate to yield to the event loop
        setImmediate(pollQueue);

    } catch (err) {
        console.error('[Worker] Fatal queue polling error:', err);
        // Wait before retrying to prevent hot loop on database crash
        setTimeout(pollQueue, WORKER_POLL_INTERVAL);
    }
}
