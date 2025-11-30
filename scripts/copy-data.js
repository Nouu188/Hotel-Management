"use strict";
// scripts/copy-data.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
// DANH SÁCH CÁC MODEL TỪ SCHEMA CỦA BẠN
// Đã được sắp xếp theo thứ tự ưu tiên để xử lý các mối quan hệ (foreign keys)
// Bạn không cần thay đổi danh sách này.
var ORDERED_MODEL_NAMES = [
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
var sourceDbUrl = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNDhmODFlOTYtNjVmNy00NzgwLTk0Y2ItNDc3YjFjNjM1NDgwIiwidGVuYW50X2lkIjoiMWViMDY4YzM2ODI3MTRmN2VhMDBhNmZiNzExNzkwYTYwYTdkYzgwOTYxZmUzY2RlZDg0M2U0ZDk3NDk0OTFlOCIsImludGVybmFsX3NlY3JldCI6ImM2YTNkN2UwLTRlZWUtNDFmNi1iY2ZiLWQ1NDJkMDdjZWI1ZSJ9.CByouBgFhdf0qCj15ZS_scGO1gAHHgVHtPPdDJSYYfg";
// 2. URL của DB mới (trên pgAdmin) - HÃY THAY THẾ CHO ĐÚNG
var destinationDbUrl = process.env.DATABASE_URL; // <--- THAY THÔNG TIN CỦA BẠN VÀO ĐÂY
// =================================================================
// PHẦN LOGIC SAO CHÉP - KHÔNG CẦN CHỈNH SỬA
// =================================================================
var prismaSource = new client_1.PrismaClient({
    datasources: { db: { url: sourceDbUrl } },
});
var prismaDestination = new client_1.PrismaClient({
    datasources: { db: { url: destinationDbUrl } },
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, ORDERED_MODEL_NAMES_1, modelName, model, data, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Bắt đầu quá trình sao chép dữ liệu...');
                    console.log("T\u1EEB (ngu\u1ED3n): Prisma Accelerate");
                    console.log("\u0110\u1EBFn (\u0111\u00EDch): ".concat(destinationDbUrl && destinationDbUrl.split('@')[1])); // che password
                    _i = 0, ORDERED_MODEL_NAMES_1 = ORDERED_MODEL_NAMES;
                    _a.label = 1;
                case 1:
                    if (!(_i < ORDERED_MODEL_NAMES_1.length)) return [3 /*break*/, 8];
                    modelName = ORDERED_MODEL_NAMES_1[_i];
                    model = modelName;
                    console.log("\n[+] \u0110ang x\u1EED l\u00FD model: ".concat(model, "..."));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, prismaSource[model].findMany()];
                case 3:
                    data = _a.sent();
                    if (data.length === 0) {
                        console.log(" -> Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u trong model ".concat(model, ". B\u1ECF qua."));
                        return [3 /*break*/, 7];
                    }
                    console.log(" -> T\u00ECm th\u1EA5y ".concat(data.length, " b\u1EA3n ghi."));
                    // 2. Xóa dữ liệu cũ ở DB đích để tránh lỗi (an toàn hơn)
                    return [4 /*yield*/, prismaDestination[model].deleteMany({})];
                case 4:
                    // 2. Xóa dữ liệu cũ ở DB đích để tránh lỗi (an toàn hơn)
                    _a.sent();
                    return [4 /*yield*/, prismaDestination[model].createMany({
                            data: data,
                            skipDuplicates: false, // Không nên có dữ liệu trùng lặp sau khi đã xóa
                        })];
                case 5:
                    result = _a.sent();
                    console.log(" -> Sao ch\u00E9p th\u00E0nh c\u00F4ng ".concat(result.count, " b\u1EA3n ghi v\u00E0o DB m\u1EDBi."));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error(" -> L\u1ED6I khi sao ch\u00E9p model ".concat(model, ":"));
                    if (error_1 instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                        console.error("  M\u00E3 l\u1ED7i Prisma: ".concat(error_1.code));
                        console.error("  Th\u00F4ng \u0111i\u1EC7p: ".concat(error_1.message));
                        console.error('  Gợi ý: Lỗi này thường xảy ra do vấn đề về khóa ngoại (foreign key). Hãy kiểm tra lại thứ tự của các model trong mảng ORDERED_MODEL_NAMES.');
                    }
                    else {
                        console.error(error_1);
                    }
                    // Dừng lại nếu có lỗi để tránh làm hỏng dữ liệu
                    throw new Error("Migration failed at model ".concat(model));
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('\n✅✅✅ Hoàn tất quá trình sao chép dữ liệu thành công!');
        return [2 /*return*/];
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.error('\n❌❌❌ Đã xảy ra lỗi nghiêm trọng. Quá trình đã dừng lại.', e.message);
        process.exit(1);
        return [2 /*return*/];
    });
}); })
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prismaSource.$disconnect()];
            case 1:
                _a.sent();
                return [4 /*yield*/, prismaDestination.$disconnect()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
