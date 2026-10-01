import { createSlice } from "@reduxjs/toolkit";

export const priceListSlice = createSlice({
  name: "priceList",
  initialState: [
    {
      _id: "",
      article_code: "",
      supplier: "",
      warehouse: "",
      
      order: "",
      mrp: 0,
      tp: 0,
      status: "",
    },
  ],
  reducers: {
    addPrice: (state, action) => {
      state.products = action.payload;
    },
    DataAddSuppliers: (state, action) => {
      state.name = action.payload;
      state.email = action.payload;
      state.code = action.payload;
      state.company = action.payload;
      state.address = action.payload;
      state.type = action.payload;
      state.phone = action.payload;
      state.status = action.payload;
    },
  },
});

export const { addPrice, DataAddSuppliers } = priceListSlice.actions;
export const priceListReducer = priceListSlice.reducer;
