import { createSlice } from "@reduxjs/toolkit";

export const priceUpdateSlice = createSlice({
  name: "priceUpdate",
  initialState:
  {
    id: "",
    isUpdate: false,
  },

  reducers: {
    selectPriceId: (state, action) => {
      state.id = action.payload;
    },
    selectIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    }
  },
});

export const { selectPriceId, selectIsUpdate } = priceUpdateSlice.actions;
export const priceUpdateReducer = priceUpdateSlice.reducer;
