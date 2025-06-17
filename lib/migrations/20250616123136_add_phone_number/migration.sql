/*
  Warnings:

  - You are about to drop the column `phone` on the `BookingGuest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookingGuest" DROP COLUMN "phone",
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;
