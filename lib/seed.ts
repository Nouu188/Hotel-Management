// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// Khởi tạo Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu quá trình seeding dữ liệu kho phòng (Room Availability)...');

  // 1. Lấy tất cả các loại phòng đang có trong hệ thống
  const allRoomTypes = await prisma.hotelBranchRoomType.findMany({
    select: {
      id: true,
      quantity: true,
    },
  });

  if (allRoomTypes.length === 0) {
    console.warn('⚠️ Không tìm thấy loại phòng nào (HotelBranchRoomType). Bỏ qua việc seeding.');
    return;
  }

  console.log(`🔍 Tìm thấy ${allRoomTypes.length} loại phòng. Bắt đầu tạo dữ liệu kho phòng...`);

  // 2. Chuẩn bị một mảng lớn để chứa tất cả các bản ghi mới
  const allAvailabilityRecords = [];
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0); // Bắt đầu từ đầu ngày hôm nay (UTC)

  // Lặp qua từng loại phòng
  for (const roomType of allRoomTypes) {
    // 3. Với mỗi loại phòng, tạo dữ liệu cho 365 ngày tiếp theo
    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(startDate);
      currentDate.setUTCDate(startDate.getUTCDate() + i);

      // Tạo object dữ liệu cho một ngày
      const availabilityData = {
        date: currentDate,
        hotelBranchRoomTypeId: roomType.id,
        totalRooms: roomType.quantity,
        bookedRooms: 0, // Ban đầu chưa có phòng nào được đặt
      };
      
      allAvailabilityRecords.push(availabilityData);
    }
  }

  console.log(`✅ Đã chuẩn bị ${allAvailabilityRecords.length} bản ghi kho phòng. Bắt đầu ghi vào cơ sở dữ liệu...`);

  // 4. Sử dụng createMany để thêm tất cả dữ liệu vào CSDL trong một lần
  // Đây là cách cực kỳ hiệu quả để insert số lượng lớn bản ghi.
  // `skipDuplicates: true` sẽ bỏ qua việc tạo mới nếu bản ghi cho ngày đó đã tồn tại,
  // giúp bạn có thể chạy lại script này nhiều lần mà không bị lỗi.
  await prisma.roomAvailability.createMany({
    data: allAvailabilityRecords,
    skipDuplicates: true,
  });

  console.log('🎉 Seeding dữ liệu kho phòng thành công!');
}

// Chạy hàm main và xử lý lỗi
main()
  .catch((e) => {
    console.error('❌ Đã xảy ra lỗi trong quá trình seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Luôn đóng kết nối Prisma khi hoàn tất
    await prisma.$disconnect();
  });