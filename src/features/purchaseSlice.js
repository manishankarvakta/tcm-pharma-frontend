import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";
const user = signInUser();
const intialState = {
  // _id: "",
  poNo: "",
  supplier: "",
  warehouse: user?.warehouse,
  aamarId: user?.aamarId,
  products: [],
  type: "",
  note: "",
  doc: "",
  totalItem: 0,
  total: 0,
  discount: 0,
  tax: 0,
  shipping_cost: 0,
  userId: user?.id,
  status: "Pending",
};
export const purchaseSlice = createSlice({
  name: "purchase",
  initialState: intialState,
  reducers: {
    selectPo: (state, action) => {
      return { ...state, poNo: action.payload };
    },
    selectSupplier: (state, action) => {
      return { ...state, supplier: action.payload };
    },
    selectWareHouse: (state, action) => {
      return { ...state, warehouse: action.payload };
    },
    selectAamarId: (state, action) => {
      return { ...state, aamarId: action.payload };
    },
    selectUser: (state, action) => {
      return { ...state, userId: action.payload };
    },
    selectProducts: (state, action) => {
      return {
        ...state,
        products: action.payload,
        totalItem: action.payload.length,
      };
    },
    selectNote: (state, action) => {
      return { ...state, note: action.payload };
    },
    selectShipping: (state, action) => {
      return { ...state, shipping_cost: action.payload };
    },
    selectDiscount: (state, action) => {
      return { ...state, discount: action.payload };
    },
    selectTax: (state, action) => {
      return { ...state, tax: action.payload };
    },
    selectStatus: (state, action) => {
      return { ...state, status: action.payload };
    },
    selectCalculation: (state, action) => {
      return {
        ...state,
        totalItem: Number(action.payload.totalItem),
        total: Number(action.payload.total),
        tax: Number(action.payload.tax),
      };
    },
    resetPurchase: () => intialState,
  },
});

export const {
  selectPo,
  selectSupplier,
  selectWareHouse,
  selectAamarId,
  selectUser,
  selectProducts,
  selectNote,
  selectDiscount,
  selectCalculation,
  selectTax,
  selectStatus,
  selectShipping,
  resetPurchase,
} = purchaseSlice.actions;
export const purchaseReducer = purchaseSlice.reducer;
