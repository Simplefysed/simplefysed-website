// Lightweight in-memory rate limiter (fixed window, per key). Enough to blunt
// rapid-fire abuse of the contact endpoint. NOTE: state lives per server
// instance, so on serverless (e.g. Vercel) each warm instance keeps its own
// counters and they reset on cold start. For strict, distributed limiting move
// this to Upstash Redis / Vercel KV.
interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSec: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    // Occasionally sweep expired entries so the map can't grow unbounded.
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k)
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 }
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { allowed: true, remaining: limit - bucket.count, retryAfterSec: 0 }
}
