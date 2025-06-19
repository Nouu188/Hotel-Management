-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "paymentMethod" SET DEFAULT 'E_WALLET';
