import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface RoomItem {
  adults: number;
  children: number;
  infants: number;
}

interface UseSyncBookingQueryProps {
  selectedBranch: string;
  dateRange?: DateRange;
  items: RoomItem[];
}

export function useSyncBookingQuery({
  selectedBranch,
  dateRange,
  items,
}: UseSyncBookingQueryProps) {
  const router = useRouter();

  useEffect(() => {
    if (!selectedBranch || !dateRange?.from || !dateRange?.to) return;

    const fromDate = format(dateRange.from, "yyyy-MM-dd");
    const toDate = format(dateRange.to, "yyyy-MM-dd");

    const queryParams = items
      .map(
        (item, index) =>
          `items[${index}][adults]=${item.adults}&items[${index}][children]=${item.children}&items[${index}][infants]=${item.infants}`
      )
      .join("&");

    const fullUrl = `/book-directonline?branch=${encodeURIComponent(
      selectedBranch
    )}&fromDate=${fromDate}&toDate=${toDate}&${queryParams}`;

    router.push(fullUrl);
  }, [
    selectedBranch,
    dateRange?.from?.toISOString(),
    dateRange?.to?.toISOString(),
    items,
  ]);
}
