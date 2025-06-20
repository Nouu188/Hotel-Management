"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GuestAllocation } from "@/types/roomType"; 
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react"; 
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setGuestAllocation } from "@/store/slices/filterHotelRoomTypeSlice";

interface Props {
  guestAllocations: GuestAllocation[]; 
}

export default function RoomGuestSelector({
  guestAllocations,
}: Props) {
  const [roomsDraft, setRoomsDraft] = useState<GuestAllocation[]>(guestAllocations);
  const [open, setOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch(); 

  useEffect(() => {
    setRoomsDraft(guestAllocations);
  }, [guestAllocations, open]); 
  const updateCount = (roomIndex: number, type: keyof GuestAllocation, delta: number) => {
    setRoomsDraft((prev) =>
      prev.map((room, index) => {
        if (index === roomIndex) {
          const newValue = room[type] + delta;
          const minValue = type === 'adults' ? 1 : 0;
          return { ...room, [type]: Math.max(minValue, newValue) };
        }
        return room;
      })
    );
  };

  const addRoom = () => {
    setRoomsDraft([...roomsDraft, { adults: 2, children: 0, infants: 0 }]);
  };

  const removeRoom = (indexToRemove: number) => {
    if (roomsDraft.length > 1) { 
      setRoomsDraft((prev) => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleDone = () => {
    dispatch(setGuestAllocation(roomsDraft)); 
    setOpen(false); 
  };

  const roomText = `${guestAllocations.length} Room${guestAllocations.length > 1 ? "s" : ""}`;
  const guestCount = guestAllocations.reduce(
    (sum, item) => sum + item.adults + item.children + item.infants,
    0
  );
  const guestText = `${guestCount} Guest${guestCount !== 1 ? "s" : ""}`;

  const draftGuestCount = roomsDraft.reduce(
    (sum, item) => sum + item.adults + item.children + item.infants,
    0
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center border-[#b4b2b2] justify-start xl:w-[340px] md:w-[230px] max-w-[780px] w-full py-[24.5px] raleway text-[17px] rounded-sm">
          <Image src="/icons/adult.svg" width={15} height={15} alt="guest" className="opacity-80"/>
          <p className="font-normal ml-2"> 
            {roomText}, {guestText}
          </p>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[640px] z-100 px-4 py-6 raleway">
        {roomsDraft.map((room, index) => (
          <div key={index} className="space-y-2 mb-4 flex relative border-b pb-3 items-center">
            <p className="flex-shrink-0 mr-4 font-medium">
              Room {index + 1}
            </p>
            <div className="flex-grow grid grid-cols-3 gap-4">
              {(["adults", "children", "infants"] as const).map((type) => (
                <div key={type} className="text-center">
                  <p className="text-sm font-medium capitalize">
                    {type === "adults" ? "Adults" : type === "children" ? "Children" : "Infants"}
                  </p>
                  <p className="text-xs whitespace-nowrap text-muted-foreground">
                    {type === "adults" ? "Ages 5 or more" : type === "children" ? "Ages 1 - 4" : "Under 1"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCount(index, type, -1)}
                      disabled={(type === 'adults' && room[type] <= 1) || (type !== 'adults' && room[type] <= 0)}
                      className="w-8 h-8 p-0 rounded-full border-[#055574]"
                    >
                      <Minus className="w-4 h-4"/>
                    </Button>
                    <span className="w-8 text-center">{room[type]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCount(index, type, 1)}
                      className="w-8 h-8 p-0 rounded-full border-[#055574]"
                    >
                      <Plus className="w-4 h-4"/>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {roomsDraft.length > 1 && (
              <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeRoom(index)}
                  className="text-red-500 hover:bg-red-100 ml-2 w-8 h-8 p-0"
              >
                  <Trash2 className="w-4 h-4"/>
              </Button>
            )}
          </div>
        ))}
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" className="rounded-sm border-2 py-1 border-[#055574] text-[#055574]" onClick={addRoom}>
            Add Room
          </Button>
          <Button
            onClick={handleDone} 
            disabled={draftGuestCount === 0}
            className="rounded-sm bg-[#055574]"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}