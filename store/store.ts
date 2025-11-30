import { configureStore } from '@reduxjs/toolkit';
import filterHotelRoomTypeReducer from './slices/filterHotelRoomTypeSlice';
import selectedHotelRoomTypesReducer from './slices/selectedHotelRoomTypesSlice';
import selectedExtrasReducer from './slices/extrasSlice';
import historyReducer from './slices/historyBookingSlice';

export const store = configureStore({
  reducer: {
    filterHotelRoomType: filterHotelRoomTypeReducer,
    selectedHotelRoomTypes: selectedHotelRoomTypesReducer,
    selectedExtras: selectedExtrasReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['filterHotelRoomType/setDateRange'], 
        ignoredPaths: ['filterHotelRoomType.dateRange'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;