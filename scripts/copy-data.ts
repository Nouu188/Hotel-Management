// scripts/copy-data.ts

import { PrismaClient, Prisma } from '@prisma/client';

// DANH SÁCH CÁC MODEL TỪ SCHEMA CỦA BẠN
// Đã được sắp xếp theo thứ tự ưu tiên để xử lý các mối quan hệ (foreign keys)
// Bạn không cần thay đổi danh sách này.
const ORDERED_MODEL_NAMES: (keyof PrismaClient)[] = [
  'user',
  'staff',
  'service',
  'roomType',
  'hotelBranch',
  'notification', // Không có quan hệ, có thể chạy bất cứ lúc nào
  'account', // Phụ thuộc vào User
  'hotelBranchRoomType', // Phụ thuộc vào HotelBranch, RoomType
  'roomAvailability', // Phụ thuộc vào HotelBranchRoomType
  'booking', // Phụ thuộc vào User
  'bookingGuest', // Phụ thuộc vào Booking
  'bill', // Phụ thuộc vào Booking, Staff
  'bookingRoomItem', // Phụ thuộc vào Booking, HotelBranchRoomType
  'usingService', // Phụ thuộc vào Booking, Service
];

// =================================================================
// CẤU HÌNH CỦA BẠN - VUI LÒNG KIỂM TRA LẠI
// =================================================================

// 1. URL của DB cũ (Prisma Accelerate) - Đã lấy từ yêu cầu của bạn
const sourceDbUrl = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNDhmODFlOTYtNjVmNy00NzgwLTk0Y2ItNDc3YjFjNjM1NDgwIiwidGVuYW50X2lkIjoiMWViMDY4YzM2ODI3MTRmN2VhMDBhNmZiNzExNzkwYTYwYTdkYzgwOTYxZmUzY2RlZDg0M2U0ZDk3NDk0OTFlOCIsImludGVybmFsX3NlY3JldCI6ImM2YTNkN2UwLTRlZWUtNDFmNi1iY2ZiLWQ1NDJkMDdjZWI1ZSJ9.CByouBgFhdf0qCj15ZS_scGO1gAHHgVHtPPdDJSYYfg";

// 2. URL của DB mới (trên pgAdmin) - HÃY THAY THẾ CHO ĐÚNG
const destinationDbUrl = process.env.DATABASE_URL; // <--- THAY THÔNG TIN CỦA BẠN VÀO ĐÂY

// =================================================================
// PHẦN LOGIC SAO CHÉP - KHÔNG CẦN CHỈNH SỬA
// =================================================================

const prismaSource = new PrismaClient({
  datasources: { db: { url: sourceDbUrl } },
});

const prismaDestination = new PrismaClient({
  datasources: { db: { url: destinationDbUrl } },
});

async function main() {
  console.log('Bắt đầu quá trình sao chép dữ liệu...');
  console.log(`Từ (nguồn): Prisma Accelerate`);
  console.log(`Đến (đích): ${destinationDbUrl && destinationDbUrl.split('@')[1]}`); // che password

  for (const modelName of ORDERED_MODEL_NAMES) {
    const model = modelName as any;
    
    console.log(`\n[+] Đang xử lý model: ${model}...`);

    try {
      // 1. Đọc tất cả dữ liệu từ DB nguồn
      const data = await (prismaSource as any)[model].findMany();

      if (data.length === 0) {
        console.log(` -> Không có dữ liệu trong model ${model}. Bỏ qua.`);
        continue;
      }

      console.log(` -> Tìm thấy ${data.length} bản ghi.`);

      // 2. Xóa dữ liệu cũ ở DB đích để tránh lỗi (an toàn hơn)
      await (prismaDestination as any)[model].deleteMany({});
      
      // 3. Ghi dữ liệu vào DB đích
      const result = await (prismaDestination as any)[model].createMany({
        data: data,
        skipDuplicates: false, // Không nên có dữ liệu trùng lặp sau khi đã xóa
      });

      console.log(` -> Sao chép thành công ${result.count} bản ghi vào DB mới.`);
    } catch (error) {
      console.error(` -> LỖI khi sao chép model ${model}:`);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(`  Mã lỗi Prisma: ${error.code}`);
        console.error(`  Thông điệp: ${error.message}`);
        console.error('  Gợi ý: Lỗi này thường xảy ra do vấn đề về khóa ngoại (foreign key). Hãy kiểm tra lại thứ tự của các model trong mảng ORDERED_MODEL_NAMES.');
      } else {
        console.error(error);
      }
      // Dừng lại nếu có lỗi để tránh làm hỏng dữ liệu
      throw new Error(`Migration failed at model ${model}`);
    }
  }
}

main()
  .then(async () => {
    console.log('\n✅✅✅ Hoàn tất quá trình sao chép dữ liệu thành công!');
  })
  .catch(async (e) => {
    console.error('\n❌❌❌ Đã xảy ra lỗi nghiêm trọng. Quá trình đã dừng lại.', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prismaSource.$disconnect();
    await prismaDestination.$disconnect();
  });