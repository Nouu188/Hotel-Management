// scripts/run-worker.ts
import { Worker, Job } from 'bullmq';
import { getRedisConnection, BOOKING_EXPIRATION_QUEUE_NAME } from '../lib/queue.js'; // THÊM .js
import { bookingExpirationProcessor, BookingJobData } from '../lib/worker-logic.js'; // THÊM .js

console.log('🚀 Starting BullMQ Worker...');

const worker = new Worker<BookingJobData>(
  BOOKING_EXPIRATION_QUEUE_NAME,
  bookingExpirationProcessor,
  {
    connection: getRedisConnection(),
    concurrency: 10, // Xử lý tối đa 10 job cùng lúc
  }
);

worker.on('completed', (job: Job, result: any) => {
  console.log(`✅ Job ${job.id} completed.`);
});

worker.on('failed', (job: Job | undefined, err: Error) => {
  if (job) {
    console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
  } else {
    console.error(`An unknown job failed with error: ${err.message}`);
  }
});

console.log(`🎧 Worker is listening for jobs on queue "${BOOKING_EXPIRATION_QUEUE_NAME}"...`);

// Xử lý tín hiệu tắt để đóng kết nối một cách an toàn
const gracefulShutdown = async () => {
  console.log(' gracefully shutting down...');
  await worker.close();
  getRedisConnection().disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown); // Tín hiệu tắt từ hệ thống (ví dụ: Docker, K8s)
process.on('SIGINT', gracefulShutdown);  // Tín hiệu khi nhấn Ctrl+C