import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  await redis.set("hello", "world");
  const value = await redis.get("hello");

  return NextResponse.json({ message: value });
}
