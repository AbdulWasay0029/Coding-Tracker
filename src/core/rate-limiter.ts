export class TokenBucket {
    private tokens: number;
    private lastRefill: number;
    private queue: ((value: void) => void)[] = [];

    constructor(
        private capacity: number,
        private refillRatePerSecond: number
    ) {
        this.tokens = capacity;
        this.lastRefill = Date.now();
    }

    private refill() {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000;
        const newTokens = timePassed * this.refillRatePerSecond;

        if (newTokens > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + newTokens);
            this.lastRefill = now;
            this.processQueue();
        }
    }

    private processQueue() {
        while (this.queue.length > 0 && this.tokens >= 1) {
            this.tokens -= 1;
            const resolve = this.queue.shift();
            if (resolve) resolve();
        }
    }

    public async acquire(): Promise<void> {
        this.refill();

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return Promise.resolve();
        }

        // Wait in the queue
        return new Promise<void>((resolve) => {
            this.queue.push(resolve);
            
            // Set a timeout to periodically check the queue if it's stalled
            const checkInterval = setInterval(() => {
                this.refill();
                if (!this.queue.includes(resolve)) {
                    clearInterval(checkInterval);
                }
            }, 1000);
        });
    }
}

// Global rate limiters to prevent IP bans
// Most platforms: max 50 requests per minute (approx 0.8 per second)
export const leetCodeLimiter = new TokenBucket(10, 0.5); // Capacity 10, refill 1 every 2 seconds
export const codeforcesLimiter = new TokenBucket(10, 0.5);
export const codechefLimiter = new TokenBucket(10, 0.5);
export const hackerRankLimiter = new TokenBucket(10, 0.5);
export const smartInterviewsLimiter = new TokenBucket(10, 0.5);
