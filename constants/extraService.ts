export interface ExtraService {
  id: string; 
  imgUrl: string,
  name: string;
  description: string;
  price: string; 
  priceType: 'per booking' | 'per adult';
  options?: string[];
  notes?: string;     
  isNumb: boolean;
  quantity?: number;
}

export const hotelExtras: ExtraService[] = [
  {
    id: "fb7868e4-2c46-4564-bb27-dfeab2d9ba14",
    imgUrl: "/extras/airport_transfer_7_seater.jpg",
    name: "Airport Transfer - 7 Seated Car Per Way",
    description: "Available for 1-4 passengers for one-way drive (pick up or drop off).",
    price: "550,000",
    priceType: "per booking",
    isNumb: false,
  },
  {
    id: "c0888581-f05f-4610-b1fc-d6d03e1ba209",
    imgUrl: "/extras/transfer_16_seater.webp",
    name: "Airport Transfer - 16 seated Minibus Per Way",
    description: "Available for 5-10 passengers for one-way drive (pick up or drop off).",
    price: "1,200,000",
    priceType: "per booking",
    isNumb: false,
  },
  {
    id: "ab910f13-2bda-4e12-9c7e-9ec6e165d9e4",
    imgUrl: "/extras/Afternoon_Tea.jpg",
    name: "One-time Afternoon Tea",
    description: "Enjoy a delightful one-time afternoon tea experience.", 
    price: "300,000",
    priceType: "per adult",
    notes: "Special Price. Reserve now is required." ,
    isNumb: true,
  },
  {
    id: "baf4fe61-46be-41b2-95a6-7f8e1b3fe557",
    imgUrl: "/extras/Body-Message.jpg",
    name: "One-time Body Massage - 90 Minutes",
    description: "Select one option for each person for a relaxing 90-minute body massage.",
    price: "1,100,000",
    priceType: "per adult",
    options: [
      "Relaxation Treatment", 
      "Tension Relief Therapy", 
      "Hot Stone Massage", 
      "Himalayan Salt Stone Massage"
    ],
    notes: "Reserve now is required - Special price - Not applicable to discount.",
    isNumb: true,
  },
  {
    id: "c6810dc7-424d-407e-ad93-72875721394b",
    imgUrl: "/extras/Afternoon_Tea.jpg",
    name: "Head, Neck, Back Massage - 45 Min/person/time BY La Spa",
    description: "A targeted 45-minute massage for your head, neck, and back by La Spa.",
    price: "565,000",
    priceType: "per adult",
    notes: "Reserve now is required - Special price - Not applicable to discount.",
    isNumb: true,
  },
  {
    id: "f65b1c95-4bcb-4836-a85f-d19a6dd10bfe",
    imgUrl: "/extras/Afternoon_Tea.jpg",
    name: "Foot Massage - 45 Min/person/time BY La Spa",
    description: "A rejuvenating 45-minute foot massage by La Spa.",
    price: "565,000",
    priceType: "per adult",
    notes: "Reserve now is required - Special price - Not applicable to discount.",
    isNumb: true,
  }
];
