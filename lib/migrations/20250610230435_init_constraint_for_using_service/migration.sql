/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,serviceId]` on the table `UsingService` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UsingService_bookingId_serviceId_key" ON "UsingService"("bookingId", "serviceId");
