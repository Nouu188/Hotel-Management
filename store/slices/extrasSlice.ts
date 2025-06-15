import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtraService, hotelExtras } from '@/constants/extraService';
import { calculateExtraPrice } from '@/components/bookingprocedure/Extra/ExtrasSelector';

export interface SelectedExtra extends ExtraService {
  selection: boolean;
  priceFinal: number;
  quantityFinal: number;
  quantityTmp: number;
  isAdded: boolean;
}

export interface SelectedExtraSliceProps {
  selections: SelectedExtra[];
}

const initialState: SelectedExtraSliceProps = {
  selections: hotelExtras.map(extra => ({
    ...extra,
    priceFinal: 0,
    quantityFinal: 0,
    quantityTmp: 0,
    selection: false,
    isAdded: false,
  })),
};

const selectedExtrasSlice = createSlice({
  name: 'selectedExtras',
  initialState,
  reducers: {
    selectExtra: (state, action: PayloadAction<{ extraId: string, quantityTmp: number }>) => {
      const { extraId, quantityTmp } = action.payload;
      const existingExtra = state.selections.find(extra => extra.id === extraId);

      if(existingExtra) {
        existingExtra.selection = true;
        existingExtra.quantityTmp = quantityTmp;
      }
    },
    unSelectExtra: (state, action: PayloadAction<{ extraId: string }>) => {
      const { extraId } = action.payload;
      const existingExtra = state.selections.find(extra => extra.id === extraId);

      if(existingExtra) {
        existingExtra.selection = false;
        existingExtra.quantityTmp = 0;
      }
    },
    addExtra: (state, action: PayloadAction<{ extraId: string }>) => {
      const { extraId } = action.payload;

      const existingExtra = state.selections.find(extra => extra.id === extraId);

      if(existingExtra) {
        existingExtra.isAdded = true;
        existingExtra.quantityFinal = existingExtra.quantityTmp;        
        existingExtra.priceFinal = calculateExtraPrice(existingExtra.price, existingExtra.quantityFinal);
      }
    },
    removeExtra: (state, action: PayloadAction<{ extraId: string }>) => {
      const { extraId } = action.payload;

      const existingExtra = state.selections.find(extra => extra.id === extraId);

      if(existingExtra) {
        existingExtra.isAdded = false;
        existingExtra.priceFinal = 0;
        existingExtra.quantityFinal = 0;
      }
    }
  },
});

export const { selectExtra, unSelectExtra, addExtra, removeExtra } = selectedExtrasSlice.actions;

export default selectedExtrasSlice.reducer;