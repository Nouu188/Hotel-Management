// lib/queue.ts
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connectionString = process.env.REDIS_URL;
if (!connectionString) {
  throw new Error("REDIS_URL environment variable is not set.");
}

// Sử dụng lazy connection
let connection: IORedis | undefined;
export const getRedisConnection = () => {
  if (!connection) {
    connection = new IORedis(connectionString, { maxRetriesPerRequest: null });
  }
  return connection;
};

export const BOOKING_EXPIRATION_QUEUE_NAME = 'booking-expiration';

let bookingQueue: Queue | undefined;
export const getBookingExpirationQueue = () => {
  if (!bookingQueue) {
    bookingQueue = new Queue(BOOKING_EXPIRATION_QUEUE_NAME, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 1000 }, // Giữ lại 1000 job hoàn thành
        removeOnFail: { count: 5000 },    // Giữ lại 5000 job thất bại
      },
    });
  }
  return bookingQueue;
};