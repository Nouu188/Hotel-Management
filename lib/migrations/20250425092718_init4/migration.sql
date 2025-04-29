/*
  Warnings:

  - You are about to drop the column `guestNumb` on the `BookingRoomItem` table. All the data in the column will be lost.
  - You are about to drop the column `personalRequest` on the `BookingRoomItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookingGuest" ADD COLUMN     "guestNumb" INTEGER;

-- AlterTable
ALTER TABLE "BookingRoomItem" DROP COLUMN "guestNumb",
DROP COLUMN "personalRequest";
