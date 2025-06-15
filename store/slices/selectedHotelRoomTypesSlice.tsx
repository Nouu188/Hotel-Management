import { HotelBranchRoomTypeItem } from "@/types/roomType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

export interface SelectedRoomInstance {
  instanceId: string;
  originalRoomData: HotelBranchRoomTypeItem; 
}

interface SelectedHotelRoomTypesState {
    selectedInstances: SelectedRoomInstance[];
}

const initialState: SelectedHotelRoomTypesState = {
    selectedInstances: []
}

const selectedHotelRoomTypesSlice = createSlice({
    name: "selectedHotelRoomTypes",
    initialState,
    reducers: {
        addSelectedHotelRoomTypes: (state, action: PayloadAction<HotelBranchRoomTypeItem>) => {
            const newInstance: SelectedRoomInstance = {
                instanceId: uuidv4(), 
                originalRoomData: action.payload 
            };
            state.selectedInstances.push(newInstance);        
        },
        removeSelectedRoomType: (state, action: PayloadAction<string>) => {
            state.selectedInstances = state.selectedInstances.filter(
                instance => instance.instanceId !== action.payload
            );        
        },
        clearAllRoomSelections: (state) => {
            state.selectedInstances = [];
        }
    }
});

export const { addSelectedHotelRoomTypes, removeSelectedRoomType, clearAllRoomSelections } = selectedHotelRoomTypesSlice.actions;

export default selectedHotelRoomTypesSlice.reducer;