import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";
const getInitialState = () => {
  const user = signInUser();
  return {
    // _id: string,
    grnNo: "",
    poNo: null,
    poId: null,
    tpnNo: null,
    supplier: null,
    warehouse: user?.warehouse,
    aamarId: user?.aamarId,
    products: [],
    type: "",
    note: "",
    doc: "",
    totalItem: 0,
    total: 0,
    grossTotal: 0,
    discount: 0,
    tax: 0,
    userId: user?.id || "",
    shipping_cost: 0,
    status: "Recieved",
  };
};

export const grnSlice = createSlice({
  name: "grn",
  initialState: getInitialState(),
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
    selectPoNoNew: (state, action) => {
      return { ...state, poNo: action.payload };
    },
    selectPoIdNew: (state, action) => {
      return { ...state, poId: action.payload };
    },

    selectTPNNo: (state, action) => {
      return { ...state, tpnNo: action.payload.id };
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
    selectDiscountTotal: (state, action) => {
      return { ...state, discount: action.payload };
    },
    selectDiscount: (state, action) => {
      return { ...state, discount: action.payload };
    },
    selectStatus: (state, action) => {
      return { ...state, status: action.payload };
    },
    selectNewPrice: (state, action) => {
      console.log(state.products);
      const selected = state.products.find((p) => p.id === action.payload.id);
      const rest = state.products.filter((p) => p.id !== action.payload.id);
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
        tax: Number(action.payload.tax),
        grossTotal: Number(action.payload.groundTotal),
      };
    },
    resetGrn: () => getInitialState(),
  },
});

export const {
  selectSupplier,
  selectWareHouse,
  selectAamarId,
  selectUser,
  selectProducts,
  selectNote,
  selectDiscount,
  selectCalculation,
  selectStatus,
  selectShipping,
  selectDiscountTotal,
  resetGrn,
  selectPoNo,
  selectPoNoNew,
  selectPoIdNew,
  selectTPNNo,
  selectNewPrice,
} = grnSlice.actions;
export const grnReducer = grnSlice.reducer;
