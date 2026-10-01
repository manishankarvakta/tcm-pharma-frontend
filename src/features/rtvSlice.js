import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";
const user = signInUser();
const intialState = {
  supplier: "",
  warehouse: user?.warehouse,
  aamarId: user?.aamarId,
  products: [],
  type: "",
  note: "",
  doc: "",
  totalItem: 0,
  total: 0,
  userId: "",
  status: "Complete",
};
export const rtvSlice = createSlice({
  name: "rtv",
  initialState: intialState,
  reducers: {
    selectSupplier: (state, action) => {
      return { ...state, supplier: action.payload };
    },
    selectWareHouse: (state, action) => {
      return { ...state, warehouse: action.payload };
    },
    selectAamarId: (state, action) => {
      return { ...state, aamarId: action.payload };
    },
    selectPoNo: (state, action) => {
      return { ...state, poNo: action.payload.id, poId: action.payload.no };
    },
    selectUser: (state, action) => {
      return { ...state, userId: action.payload };
    },
    selectProducts: (state, action) => {
      return { ...state, products: action.payload };
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
    selectStatus: (state, action) => {
      return { ...state, status: action.payload };
    },
    selectNewPrice: (state, action) => {
      const selected = state.products.find((p) => p.id === action.payload.id);
      const rest = state.products.filter((p) => p.id === action.payload.id);
      return {
        ...state,
        products: [
          ...rest,
          {
            ...selected,
            newPrice: false,
            priceId: action.payload.priceId,
          },
        ],
      };
    },
    selectCalculation: (state, action) => {
      return {
        ...state,
        totalItem: Number(action.payload.totalItem),
        total: Number(action.payload.total),
      };
    },
    resetRtv: () => intialState,
  },
});

export const {
  selectSupplier,
  selectWareHouse,
  selectUser,
  selectProducts,
  selectNote,
  selectDiscount,
  selectCalculation,
  selectStatus,
  selectShipping,
  resetRtv,
  selectPoNo,
  selectNewPrice,
} = rtvSlice.actions;
export const rtvReducer = rtvSlice.reducer;
