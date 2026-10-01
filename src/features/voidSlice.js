import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";

const user = signInUser();


const initialState = {
  invoiceId: "0171000000",
  source: "POS",
  warehouse: user?.warehouse,
  aamarId: user?.aamarId,
  products: [],
  returnProducts: [],
  returnCal: {
    totalItem: 0,
    total: 0,
    vat: 0,
    grossTotal: 0,
    grossTotalRound: 0,
    point: 0,
  },
  returnInvoice: null,
  paidAmount: {
    cash: 0,
    mfs: {
      name: "bkash",
      amount: 0,
    },
    card: {
      name: "visa",
      amount: 0,
    },
    point: 0,
  },
  changeAmount: 0,
  totalReceived: 0,
  grossTotal: 0,
  grossTotalRound: 0,
  totalItem: 0,
  total: 0,
  vat: 0,
  point: {
    old: 0,
    new: 0,
  },
  todayPoint: 0,
  discount: 0,
  discountPercent: 0,
  billerId: user?.id,
  customerId: "62e301c1ee6c8940f6ac1515",
  customerPhone: "0171000000",
  customerName: "Walkway Customer",
  updateUser: user?.id,
  status: "complete",
};
export const voidSlice = createSlice({
  name: "voidSales",
  initialState: initialState,

  reducers: {
    selcetVoidCustomer: (state, action) => {
      // console.log("Add Customer", action.payload);
      // const newPoint = state.point.new + action.payload.point;
      return {
        ...state,
        customerId: action.payload.customerId,
        // point: {
        //   old: action.payload.point,
        //   new: state.todayPoint + action.payload.point,
        // },
        customerPhone: action.payload.phone,
        customerName: action.payload.name,
      };
    },
    selectVoidBiller: (state, action) => {
      return { ...state, billerId: action.payload };
    },

    selectWareHouse: (state, action) => {
      return { ...state, warehouse: action.payload };
    },
    selectAamarId: (state, action) => {
      return { ...state, aamarId: action.payload };
    },
    salesReturnCal: (state, action) => {
      return {
        ...state,
        totalItem: parseFloat(action.payload.totalItem),
        total: -action.payload.total,
        grossTotalRound: action.payload.grossTotalRound,
        grossTotal: action.payload.grossTotal,
        vat: action.payload.vatAmount,
        changeAmount: -action.payload.grossTotalRound,
        returnCal: {
          ...state.returnCal,
          totalItem: parseFloat(action.payload.totalItem),
          total: -action.payload.total,
          grossTotalRound: action.payload.grossTotalRound,
          grossTotal: action.payload.grossTotal,
          point: action.payload.newPoint,
          vat: action.payload.vatAmount,
        },
      };
    },

    salePointAmount: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          point: action.payload,
        },
      };
    },
    saleNewPoint: (state, action) => {
      return {
        ...state,
        point: {
          ...state.point,
          new: action.payload,
        },
      };
    },

    saleReturnQty: (state, action) => {
      let selectedItem = state.returnProducts.find(
        (item) => item.article_code === action.payload.id
      );
      let restItems = state.returnProducts.filter(
        (item) => item.article_code !== action.payload.id
      );

      if (selectedItem) {
        selectedItem = { ...selectedItem, qty: action.payload.qty };
      }

      const returnItems = [...restItems, selectedItem].sort(
        (a, b) => a.order - b.order
      );

      return {
        ...state,
        returnProducts: returnItems,
      };
    },

    saleReturnProducts: (state, action) => {
      return {
        ...state,
        returnProducts: action.payload,
      };
    },
    saleTotalDiscount: (state, action) => {
      return {
        ...state,
        discount: action.payload,
        changeAmount: state.grossTotalRound - action.payload,
      };
    },
    saleVoidReset: () => initialState,
  },
});

export const {
  selcetVoidCustomer,
  selectVoidBiller,
  salesReturnCal,
  salePointAmount,
  saleNewPoint,
  saleReturnQty,
  saleReturnProducts,
  saleTotalDiscount,
  saleVoidReset,
  // saleReturnCal,
} = voidSlice.actions;

export const voidReducer = voidSlice.reducer;
