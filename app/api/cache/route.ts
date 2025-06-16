import { getRedis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  const redis = getRedis();
  await redis.set("hello", "world");
  const value = await redis.get("hello");

  return NextResponse.json({ message: value });
}
