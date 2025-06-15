import { PrismaClient } from '@prisma/client';
import { RoomTypeInBriefProps } from '@/components/RoomTypeInBrief';

const prisma = new PrismaClient();

const roomTypeInBrief: RoomTypeInBriefProps[] = [
  {
    name: "Superior Room",
    imgUrl: [
      "/room/superior-room/Superior-Room_1-2000.jpg",
      "/room/superior-room/Superior-Room_2-2000-scaled.jpg",
      "/room/superior-room/Superior-Room_3-2000.jpg",
      "/room/superior-room/Superior-Room_4-2000.jpg",
      "/room/superior-room/Superior-Room_5-2000.jpg",
    ],
    altText: "Superior-Room",
    price: "165",
    description: "Spacious enough to accommodate a family of 3 OR a group of friends, Superior Room is well appointed with lamps and architectural lighting enhancing the cozy feel.",
    roomSize: "25 sqm",
    view: "No window",
    bedTypes: "Hollywood twins (allows 1 double or 2 twin beds)",
    smoking: "No",
    maxOccupancy: "3 pax",
    bathTypes: "Toilet, washbasin and bathtub",
  },
  {
    name: "Deluxe Room",
    imgUrl: [
      "/room/deluxe-room/Deluxe_6-2000.jpg",
      "/room/deluxe-room/Deluxe_2-2000.jpg",
      "/room/deluxe-room/Deluxe_3-2000.jpg",
      "/room/deluxe-room/Deluxe_4-2000.jpg",
      "/room/deluxe-room/Deluxe_5-2000.jpg",
    ],
    altText: "Deluxe-Room",
    price: "195",
    description: "Elegant and refined, the Deluxe Room completes your stay with luxurious amenities.",
    roomSize: "22 - 25 sqm",
    view: "Limited view",
    bedTypes: "Hollywood twins (allows 1 double or 2 twin beds)",
    smoking: "No",
    maxOccupancy: "2 pax",
    bathTypes: "Toilet, washbasin and stand up shower",
  },
  {
    name: "Deluxe Connecting Room",
    imgUrl: [
      "/room/deluxe-connecting-room/Deluxe_1-2000-scaled.jpg",
      "/room/deluxe-connecting-room/Deluxe_2-2000.jpg",
      "/room/deluxe-connecting-room/Deluxe_3-2000.jpg",
      "/room/deluxe-connecting-room/Deluxe_4-2000.jpg",
      "/room/deluxe-connecting-room/Deluxe_5-2000.jpg",
    ],
    altText: "Deluxe-Connecting-Room",
    price: "390",
    description: "Elegant and refined, the Deluxe Connecting Room completes your stay with luxurious amenities.",
    roomSize: "44 - 50 sqm",
    view: "Neighboring or street view",
    bedTypes: "Hollywood twins (allows 2 double or 4 twin beds)",
    smoking: "No",
    maxOccupancy: "4 pax",
    bathTypes: "Toilet, washbasin and stand up shower",
  },
  {
    name: "Executive Room",
    imgUrl: [
      "/room/executive-room/Executive_2-2000.jpg",
      "/room/executive-room/Executive_3-2000.jpg",
      "/room/executive-room/Executive_4-2000.jpg",
      "/room/executive-room/Executive_5-2000.jpg",
      "/room/executive-room/Executive_1-2000.jpg",
      "/room/executive-room/Executive_6-2000.jpg",
    ],
    altText: "Executive-Room",
    price: "250",
    description: "Elegant and refined, the Executive Room completes your stay with luxurious amenities.",
    roomSize: "25 sqm",
    view: "Neighboring or street view",
    bedTypes: "Hollywood twins (allows 1 double or 2 twin beds)",
    smoking: "No",
    maxOccupancy: "2 pax",
    bathTypes: "Toilet, washbasin and stand up shower",
  },
  {
    name: "Executive Connecting Room",
    imgUrl: [
      "/room/executive-connecting-room/Executive_1-2000.jpg",
      "/room/executive-connecting-room/Executive_2-2000.jpg",
      "/room/executive-connecting-room/Executive_3-2000-scaled.jpg",
      "/room/executive-connecting-room/Executive_4-2000.jpg",
      "/room/executive-connecting-room/Executive_5-2000.jpg",
      "/room/executive-connecting-room/Executive_6-2000.jpg",
      "/room/executive-connecting-room/Executive_7-2000.jpg",
    ],
    altText: "Executive-Connecting-Room",
    price: "500",
    description: "Elegant and refined, the Executive Connecting Room completes your stay with luxurious amenities.",
    roomSize: "44 - 50 sqm",
    view: "Neighboring or street view",
    bedTypes: "Hollywood twins (allows 2 double or 4 twin beds)",
    smoking: "No",
    maxOccupancy: "4 pax",
    bathTypes: "Toilet, washbasin and stand up shower",
  },
  {
    name: "Junior Suite",
    imgUrl: [
      "/room/junior-suite/Junior-Suite_3-2000.jpg",
      "/room/junior-suite/Junior-Suite_2-2000-scaled.jpg",
      "/room/junior-suite/Junior-Suite_4-2000.jpg",
      "/room/junior-suite/Junior-Suite_5-2000.jpg",
      "/room/junior-suite/Junior-Suite_6-2000.jpg",
      "/room/junior-suite/Junior-Suite_1-2000.jpg",
      "/room/junior-suite/Junior-Suite_7-2000.jpg",
    ],
    altText: "Junior-Room",
    price: "500",
    description: "Featuring a spacious terrace to Ly Tu Trong street, our charming Junior Suites offer tranquil views of street.",
    roomSize: "50 sqm",
    view: "City streets or rooftops",
    bedTypes: "Hollywood twins (allows 1 double or 2 twin beds)",
    smoking: "No",
    maxOccupancy: "2 pax",
    bathTypes: "Separate toilet, washbasin and walk-in shower",
  },
  {
    name: "La Siesta Suite",
    imgUrl: [
      "/room/la-sieste-suite/La-Siesta-Suite_1-2000.jpg",
      "/room/la-sieste-suite/La-Siesta-Suite_2-2000.jpg",
      "/room/la-sieste-suite/La-Siesta-Suite_3-2000.jpg",
      "/room/la-sieste-suite/La-Siesta-Suite_4-2000.jpg",
      "/room/la-sieste-suite/La-Siesta-Suite_5-2000.jpg",
      "/room/la-sieste-suite/La-Siesta-Suite_6-R01-OPT2-2000.jpg",
      "/room/la-sieste-suite/La-Siesta-Suite_7-R01-OPT2-2000.jpg",
    ],
    altText: "La-Sieste-Suite",
    price: "600",
    description: "Elegant suite room with spacious balcony, where we arrange outdoor table and chairs for your relaxation time.",
    roomSize: "75 sqm",
    view: "City streets or rooftops",
    bedTypes: "Hollywood twins (allows 1 double or 2 twin beds)",
    smoking: "No",
    maxOccupancy: "2 pax",
    bathTypes: "Separate toilet, washbasin and walk-in shower",
  },
];

async function main() {
  console.log('Starting seeding process for RoomType images...');

  const updatedRooms = await prisma.$transaction(async (tx) => {
    const results = [];

    for (const room of roomTypeInBrief) {
      // Find RoomType by name
      const existingRoom = await tx.roomType.findFirst({
        where: { name: room.name },
      });

      if (existingRoom) {
        // Update image field
        const updatedRoom = await tx.roomType.update({
          where: { id: existingRoom.id },
          data: {
            image: room.imgUrl,
          },
        });
        results.push(updatedRoom);
        console.log(`Updated images for RoomType: ${room.name}`);
      } else {
        console.warn(`RoomType not found: ${room.name}. Skipping update.`);
      }
    }

    return results;
  });

  console.log(`Seeding completed. Updated ${updatedRooms.length} RoomType records.`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });