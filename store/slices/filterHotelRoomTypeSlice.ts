import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { hotelBranches } from '@/constants/hotelBranches'; // Import danh sách chi nhánh
import { GuestAllocation } from '@/types/roomType';

interface filterHotelRoomTypeState {
  selectedBranch: string;
  dateRange: DateRange | undefined;
  guestAllocation: GuestAllocation[];
}

const initialState: filterHotelRoomTypeState = {
  selectedBranch: hotelBranches[0].name, 
  dateRange: {
    from: new Date(),
    to: addDays(new Date(), 1),
  },
  guestAllocation: [{ adults: 2, children: 0, infants: 0 },]
};

const filterRoomTypeSlice = createSlice({
  name: 'filterHotelRoomType',
  initialState,
  reducers: {
    setSelectedBranch: (state, action: PayloadAction<string>) => {
      state.selectedBranch = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange | undefined>) => {
      state.dateRange = action.payload;
    },
    setGuestAllocation: (state, action: PayloadAction<GuestAllocation[]>) => {
      state.guestAllocation = action.payload;
    },
  },
});

export const { setSelectedBranch, setDateRange, setGuestAllocation } = filterRoomTypeSlice.actions;

export default filterRoomTypeSlice.reducer;