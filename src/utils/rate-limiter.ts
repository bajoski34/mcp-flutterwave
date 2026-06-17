export class RateLimiter {
    private queue: number[] = [];

    constructor(private maxRequests: number, private windowMs: number) {}

    async throttle(): Promise<void> {
        const now = Date.now();
        this.queue = this.queue.filter(t => now - t < this.windowMs);
        if (this.queue.length >= this.maxRequests) {
            const oldest = this.queue[0];
            const wait = this.windowMs - (now - oldest);
            await new Promise(res => setTimeout(res, wait));
            return this.throttle();
        }
        this.queue.push(Date.now());
    }
}
