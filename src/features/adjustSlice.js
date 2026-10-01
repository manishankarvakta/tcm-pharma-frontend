import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";
// import { selectAamarId } from "./accountSlice";

const user = signInUser();

const initialState = {
  products: [],
  warehouse: user?.warehouse,
  total: "0",
  totalItem: "0",
  note: "",
  userId: user?.id,
  print: false,
  status: "active"
};
export const adjustSlice = createSlice({
  name: "adjust",
  initialState: initialState,
  reducers: {
    selectProducts: (state, action) => {
      return {
        ...state,
        products: action.payload,
        totalItem: action.payload.length
      };
    },
    selectWareHouse: (state, action) => {
      return { ...state, warehouse: action.payload };
    },
    // selectAamarId: (state, action) => {
    //   return { ...state, aamarId: action.payload };
    // },
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
    resetAdjust: () => initialState
  }
});

export const {
  selectProducts,
  selectWareHouse,
  selectTotal,
  selectTotalItem,
  selectNote,
  selectUser,
  selectStatus,
  selectAamarId,
  resetAdjust
} = adjustSlice.actions;
export const adjustReducer = adjustSlice.reducer;
