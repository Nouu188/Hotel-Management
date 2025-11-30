import { Booking } from '@/components/history-booking/columns';
import { api } from '@/lib/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface HistoryState {
  bookings: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HistoryState = {
  bookings: [],
  status: 'idle',
  error: null,
};

export const fetchHistoryBookings = createAsyncThunk(
  'history/fetchBookings',
  async () => {
    const response = await api.bookings.getHistory();
    if (!response.success) {
        throw new Error('Failed to fetch bookings');
    }
    const data: Booking[] = await response.data as Booking[];
    return data;
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoryBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHistoryBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchHistoryBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default historySlice.reducer;