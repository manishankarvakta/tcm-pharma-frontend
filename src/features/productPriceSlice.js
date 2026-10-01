import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  article_code: "",
  supplier: "",
  inventoryId: "",
  tp: "",
  mrp: "",
  order: "",
  status: "inactive",
};
export const productPriceSlice = createSlice({
  name: "productPrice",
  initialState: initialState,
  reducers: {
    selectWareHouse: (state, action) => {
      return { ...state, warehouse: action.payload };
    },
    selectStatus: (state, action) => {
      return { ...state, status: action.payload };
    },
    selectUpdateProduct: (state, action) => {
      return { ...state, photo: action.payload };
    },
    resetProductPrice: () => initialState,
  },
});
export const {
  selectWareHouse,
  selectStatus,
  resetProductPrice,
  selectUpdateProduct,
} = productPriceSlice.actions;
export const productPriceReducer = productPriceSlice.reducer;
