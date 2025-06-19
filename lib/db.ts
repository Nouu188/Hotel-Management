// Ví dụ trong file: lib/db.ts

import { Booking, BookingStatus } from '@prisma/client';
import prisma from './prisma';
import { NotFoundError } from './http-errors';

// --- PHẦN LOGIC TRIGGER BẮT ĐẦU TỪ ĐÂY ---

// Các hàm xử lý nghiệp vụ (bạn sẽ tự triển khai logic chi tiết)
const sendConfirmationEmail = async (booking: Booking) => {
  console.log(`[TRIGGER] Gửi email xác nhận cho booking ID: ${booking.id} đến email khách hàng.`);
  // Logic gửi email thực tế (dùng Nodemailer, Resend,...)
};

const updateRoomAvailabilityOnConfirm = async (booking: Booking) => {
  console.log(`[TRIGGER] Bắt đầu cập nhật kho phòng theo ngày cho booking ID: ${booking.id}`);

  const bookingWithItems = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: { bookingRoomItems: true },
  });

  if (!bookingWithItems || bookingWithItems.bookingRoomItems.length === 0) {
    console.warn(`Booking ID: ${booking.id} không có mục nào để cập nhật.`);
    return;
  }
  
  // Lấy khoảng ngày (không bao gồm ngày cuối cùng vì khách sạn tính tiền theo đêm)
  const fromDate = new Date(bookingWithItems.fromDate.setUTCHours(0,0,0,0));
  const toDate = new Date(bookingWithItems.toDate.setUTCHours(0,0,0,0));

  try {
    // Dùng transaction để đảm bảo tất cả các ngày đều được cập nhật
    await prisma.$transaction(async (tx) => {
      // Lặp qua từng loại phòng khách đặt
      for (const item of bookingWithItems.bookingRoomItems) {
        
        // 1. Kiểm tra xem tất cả các ngày trong khoảng thời gian có đủ phòng không
        const availabilityRecords = await tx.roomAvailability.findMany({
          where: {
            hotelBranchRoomTypeId: item.hotelBranchRoomTypeId,
            date: {
              gte: fromDate,
              lt: toDate, 
            },
          },
        });

        const notEnoughRoomDay = availabilityRecords.find(
          (rec) => (rec.totalRooms - rec.bookedRooms) < item.quantityBooked
        );
        
        if (notEnoughRoomDay) {
          throw new Error(`Không đủ phòng loại ${item.hotelBranchRoomTypeId} vào ngày ${notEnoughRoomDay.date.toISOString()}`);
        }

        // 2. Nếu đủ phòng, tiến hành cập nhật
        await tx.roomAvailability.updateMany({
          where: {
            hotelBranchRoomTypeId: item.hotelBranchRoomTypeId,
            date: {
              gte: fromDate,
              lt: toDate,
            },
          },
          data: {
            bookedRooms: {
              increment: item.quantityBooked,
            },
          },
        });
      }
    });

    console.log(`[TRIGGER] Cập nhật kho phòng thành công cho booking ID: ${booking.id}`);

  } catch (error) {
    console.error(`[TRIGGER_ERROR] Lỗi khi cập nhật kho phòng cho booking ID: ${booking.id}`, error);
    // TODO: Xử lý nghiệp vụ khi thất bại (ví dụ đổi status booking)
    throw error;
  }
};

const updateRoomAvailabilityOnCancel = async (booking: Booking) => {
    console.log(`[TRIGGER] Hoàn trả số lượng phòng trống cho booking ID: ${booking.id}`);
    // Logic: Tương tự trên nhưng là tăng `quantity`
};

const notifyStaff = async (message: string) => {
  console.log(`[TRIGGER] Gửi thông báo đến nhân viên: ${message}`);
  // Logic gửi thông báo (qua Notification model, Slack,...)
};

const requestGuestReview = async (booking: Booking) => {
    console.log(`[TRIGGER] Gửi email yêu cầu đánh giá cho booking ID: ${booking.id}`);
    // Logic gửi email
}


// --Đăng ký Middleware với Prisma Client--
prisma.$use(async (params, next) => {
  // Middleware sẽ chạy trước mỗi câu lệnh Prisma

  // --- TRIGGER KHI CẬP NHẬT (UPDATE) MỘT BOOKING ---
  if (params.model === 'Booking' && params.action === 'update') {
    // Lấy trạng thái mới từ dữ liệu đang được cập nhật
    const newStatus = params.args.data.status as BookingStatus | undefined;

    // Nếu không có sự thay đổi về status, bỏ qua
    if (!newStatus) {
      return await next(params);
    }

    // Lấy trạng thái cũ của booking TRƯỚC KHI cập nhật
    const oldBooking = await prisma.booking.findUnique({
      where: { id: params.args.where.id },
      select: { status: true },
    });
    const oldStatus = oldBooking?.status;

    // Thực thi câu lệnh update gốc để lấy kết quả booking sau khi cập nhật
    const updatedBooking = await next(params);

    // So sánh trạng thái cũ và mới để kích hoạt logic
    if (oldStatus && oldStatus !== newStatus) {
      console.log(`[TRIGGER] Booking ID: ${updatedBooking.id} đổi trạng thái từ ${oldStatus} -> ${newStatus}`);

      // Dùng switch-case để xử lý từng trường hợp thay đổi trạng thái
      switch (newStatus) {
        case BookingStatus.CONFIRMED:
          if (oldStatus === BookingStatus.PENDING) {
            await sendConfirmationEmail(updatedBooking);
            await updateRoomAvailabilityOnConfirm(updatedBooking);
            await notifyStaff(`Booking ${updatedBooking.id} đã được xác nhận.`);
          }
          break;
        case BookingStatus.CHECKED_IN:
            await notifyStaff(`Khách của booking ${updatedBooking.id} đã check-in.`);
            // Logic khác...
          break;
        case BookingStatus.COMPLETED:
            await requestGuestReview(updatedBooking);
            // Logic khác...
            break;
        case BookingStatus.CANCELLED:
            await updateRoomAvailabilityOnCancel(updatedBooking);
            await notifyStaff(`Booking ${updatedBooking.id} đã bị hủy.`);
            // Logic xử lý hoàn tiền...
          break;
        case BookingStatus.FAIL_PAYMENT:
            // Gửi email cho khách hàng...
            break;
        // Thêm các case khác nếu cần
      }
    }
    return updatedBooking;
  }

  // --- TRIGGER KHI TẠO MỚI (CREATE) MỘT BOOKING ---
  if(params.model === 'Booking' && params.action === 'create') {
    // Chỉ cần chạy câu lệnh tạo mới trước
    const newBooking = await next(params);
    
    // Sau đó kích hoạt logic trigger
    await notifyStaff(`Có một đơn đặt phòng mới đang chờ xử lý: ID ${newBooking.id}`);

    return newBooking;
  }

  // Với các model và action khác, chỉ cần cho qua
  return await next(params);
});