// src/redis/client.ts
import Redis from "ioredis";

// const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
export const redis = new Redis();
export const sub = new Redis();

// helper small wrapper
export async function safeEvalSha(sha: string, ...args: any[]) {
  return redis.evalsha(sha, 0, ...args);
}
