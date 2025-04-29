"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

interface Props {
  onChange?: (value: string) => void,
  onAddOrRemoveRooms: (rooms: GuestCount[]) => void,
}

export default function RoomGuestSelector({
  onChange,
  onAddOrRemoveRooms,
}: Props) {
  const [rooms, setRooms] = useState<GuestCount[]>([
    { adults: 2, children: 0, infants: 0 },
  ]);
  const [roomsDraft, setRoomsDraft] = useState<GuestCount[]>(rooms);
  const [open, setOpen] = useState(false);

  const updateCount = (roomIndex: number, type: keyof GuestCount, delta: number) => {
    setRoomsDraft((prev) =>
      prev.map((room, index) =>
        index === roomIndex
          ? { ...room, [type]: Math.max(0, room[type] + delta) }
          : room
      )
    );
  };

  const addRoom = () => {
    setRoomsDraft([...roomsDraft, { adults: 2, children: 0, infants: 0 }]);
  };

  const removeRoom = (indexToRemove: number) => {
    if (roomsDraft.length === 1) return;
    setRoomsDraft((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleOpenChange = (isOpen: boolean) => {
    setRoomsDraft(rooms);
    setOpen(isOpen);
  };

  useEffect(() => onAddOrRemoveRooms?.(roomsDraft), [])

  const handleDone = () => {
    setRooms(roomsDraft);
    if(roomsDraft.length > 0)
      onAddOrRemoveRooms?.(roomsDraft);

    setOpen(false);
  };

  const roomText = `${roomsDraft.length} Room${roomsDraft.length > 1 ? "s" : ""}`;
  const guestCount = roomsDraft.reduce(
    (sum, room) => sum + room.adults + room.children + room.infants,
    0
  );
  const guestText = `${guestCount} Guest${guestCount !== 1 ? "s" : ""}`;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center border-[#b4b2b2] justify-start w-[370px] py-[24.5px] raleway text-[17px] rounded-sm">
          <Image src="/icons/adult.svg" width={15} height={15} alt="guest" className="opacity-80"/>
          <p className="font-normal">
            {roomText}, {guestText}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[640px] z-100 px-4 py-6 raleway">
        {roomsDraft.map((room, index) => (
          <div key={index} className="space-y-2 mb-4 gap-7 flex relative border-b pb-3">
            <p className="flex items-end whitespace-nowrap">
              Room {index + 1}
            </p>

            <div className="grid grid-cols-3 gap-12">
              {(["adults", "children", "infants"] as const).map((type) => (
                <div key={type} className="text-center">
                  <p className="text-sm font-medium capitalize">
                    {type === "adults"
                      ? "Adults"
                      : type === "children"
                      ? "Children"
                      : "Infants"}
                  </p>
                  <p className="text-xs whitespace-nowrap text-muted-foreground">
                    {type === "adults"
                      ? "Ages 5 or more"
                      : type === "children"
                      ? "Ages 1 - 4"
                      : "Under 1"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                  <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCount(index, type, -1)}
                      className="w-8.5 h-8.5 p-0 rounded-full border-[#055574]"
                    >
                      <Minus />
                    </Button>
                    <span className="w-4 container px-7 py-1 flex justify-center text-center border-1 border-[#055574]">{room[type]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCount(index, type, 1)}
                      className="w-8.5 h-8.5 p-0 rounded-full border-[#055574]"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {roomsDraft.length > 1 && (
                <button
                  onClick={() => removeRoom(index)}
                  className="text-red-500 text-xs right-0 mb-2 flex items-end"
                >
                  <Trash2/>
                </button>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-2 items-center mt-2">
          <Button variant="outline" className="rounded-sm border-2 py-1 border-[#055574] text-[#055574]" onClick={addRoom}>
            Add additional room
          </Button>
          <Button
            onClick={handleDone}
            disabled={guestCount === 0}
            className="rounded-sm bg-[#055574]"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
