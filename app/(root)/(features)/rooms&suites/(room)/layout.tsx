"use client";

import RoomTypeInBrief from "@/components/RoomTypeInBrief";
import { roomTypeInBrief } from "@/constants/roomTypeInBrief";
import { generateLabel } from "@/lib/utils";
import { usePathname } from "next/navigation";

function getRandomInt(min: number, max: number):number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTwoRandomNumbers(): [number, number] {
    let randomNumber1 = getRandomInt(0, 6);
    let randomNumber2 = getRandomInt(0, 6);

    while(randomNumber1 === randomNumber2) {
      randomNumber2 = getRandomInt(0, 6);
    }

    return [randomNumber1, randomNumber2];
}

let index = getTwoRandomNumbers();
console.log(index[1], "va", index[0])

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(pathname => pathname);

  while(roomTypeInBrief[index[0]].name === generateLabel(pathSegments[pathSegments.length - 1]) || roomTypeInBrief[index[1]].name === generateLabel(pathSegments[pathSegments.length - 1])) {
    index = getTwoRandomNumbers();
  }

  return (
    <div lang="en" className={``}> 
        {children}
        <section>
            <h1 className='playfair text-[34px] text-[#081746] text-center pb-4'>You may also be interested</h1>

            <div className="flex gap-3 text-[13px] mb-8">
                <RoomTypeInBrief {...roomTypeInBrief[index[0]]}/>

                <RoomTypeInBrief {...roomTypeInBrief[index[1]]}/>
            </div>
        </section>
    </div>
  );
}