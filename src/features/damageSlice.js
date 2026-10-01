import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";

const user = signInUser();

const initialState = {
  products: [],
  warehouse: user?.warehouse,
  aamarId: user?.aamarId,
  total: "0",
  totalItem: "0",
  note: "",
  userId: user?.id,
  status: "active",
};
export const damageSlice = createSlice({
  name: "damage",
  initialState: initialState,
  reducers: {
    selectProducts: (state, action) => {
      return {
        ...state,
        products: action.payload,
        totalItem: action.payload.length,
      };
    },
    selectWareHouse: (state, action) => {
      return { ...state, warehouse: action.payload };
    },
    selectAamarId: (state, action) => {
      return { ...state, aamarId: action.payload };
    },
    selectTotal: (state, action) => {
      return { ...state, total: action.payload };
    },
    selectTotalItem: (state, action) => {
      return { ...state, totalItem: action.payload };
    },
    selectNote: (state, action) => {
      return { ...state, note: action.payload };
    },
    selectUser: (state, action) => {
      return { ...state, userId: action.payload };
    },
    selectStatus: (state, action) => {
      return { ...state, status: action.payload };
    },
    resetDamage: () => initialState,
  },
});

export const {
  selectProducts,
  selectWareHouse,
  selectTotal,
  selectTotalItem,
  selectNote,
  selectUser,
  selectStatus,
  resetDamage,
} = damageSlice.actions;
export const damageReducer = damageSlice.reducer;
