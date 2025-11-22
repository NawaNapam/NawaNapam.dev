import Redis from "ioredis";

export const redis = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  tls: {},
});

export const sub = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  tls: {},
});


// small wrapper for safe EVALSHA execution
export async function safeEvalSha(sha: string, ...args: (string | number)[]) {
  try {
    return await redis.evalsha(sha, 0, ...args);
  } catch (err) {
    console.error("[safeEvalSha] Redis error:", err);
    throw err;
  }
}
