-- CreateTable
CREATE TABLE "RoomAvailability" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hotelBranchRoomTypeId" TEXT NOT NULL,
    "totalRooms" INTEGER NOT NULL,
    "bookedRooms" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoomAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomAvailability_date_hotelBranchRoomTypeId_key" ON "RoomAvailability"("date", "hotelBranchRoomTypeId");

-- AddForeignKey
ALTER TABLE "RoomAvailability" ADD CONSTRAINT "RoomAvailability_hotelBranchRoomTypeId_fkey" FOREIGN KEY ("hotelBranchRoomTypeId") REFERENCES "HotelBranchRoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
