import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis() {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables.");
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL);
  }

  return redis;
}
