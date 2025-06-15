import { configureStore } from '@reduxjs/toolkit';
import filterHotelRoomTypeReducer from './slices/filterHotelRoomTypeSlice'; // Import reducer từ slice
import selectedHotelRoomTypesReducer from './slices/selectedHotelRoomTypesSlice';
import selectedExtrasReducer from './slices/extrasSlice';

export const store = configureStore({
  reducer: {
    filterHotelRoomType: filterHotelRoomTypeReducer,
    selectedHotelRoomTypes: selectedHotelRoomTypesReducer, // Thêm reducer vào store, đặt tên là 'booking'
    selectedExtras: selectedExtrasReducer, // <-- 2. Thêm reducer vào store
  },
  // Middleware mặc định của Redux Toolkit đã bao gồm thunk và devtools
  // Thêm middleware để bỏ qua kiểm tra serializable cho Date và undefined
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['filterHotelRoomType/setDateRange'], // Bỏ qua action này
        ignoredPaths: ['filterHotelRoomType.dateRange'], // Bỏ qua path này vì chứa Date/undefined
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;