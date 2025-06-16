import Redis from "ioredis";

declare global {
  var redis: Redis | undefined;
}

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables.");
}

const redis = global.redis || new Redis(process.env.REDIS_URL!);

if (process.env.NODE_ENV !== "production") global.redis = redis;

export default redis;
