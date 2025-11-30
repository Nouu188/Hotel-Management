// lib/worker-logic.ts (File mới hoặc đổi tên từ worker.ts)
import { Job } from 'bullmq';
import { BookingStatus } from '@prisma/client';
import prisma from './prisma.js'; // THÊM .js

// Định nghĩa kiểu dữ liệu cho job
export interface BookingJobData {
  bookingId: string;
}

// Export hàm xử lý job
export const bookingExpirationProcessor = async (job: Job<BookingJobData>) => {
  const { bookingId } = job.data;
  console.log(`[WORKER] Processing job ${job.id} for bookingId: ${bookingId}`);

  try {
    const booking = await prisma.booking.findFirst({
      where: { 
        id: bookingId,
        status: BookingStatus.PENDING // Chỉ tìm booking còn PENDING
      },
      select: { id: true }, // Chỉ cần biết nó có tồn tại hay không
    });

    // Nếu tìm thấy booking (vẫn còn PENDING)
    if (booking) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });
      console.log(`[WORKER] Booking ${bookingId} has expired and was cancelled.`);
    } else {
      // Nếu không tìm thấy, nghĩa là nó đã được CONFIRMED hoặc CANCELLED bởi người dùng
      console.log(`[WORKER] Booking ${bookingId} is no longer PENDING. Job ignored.`);
    }
  } catch (error) {
    console.error(`[WORKER] Failed to process job ${job.id} for booking ${bookingId}:`, error);
    throw error; // Ném lỗi để BullMQ thử lại
  }
};