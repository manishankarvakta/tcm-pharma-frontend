import { createSlice } from "@reduxjs/toolkit";
const intialState = {
  returned: [],
};
export const ecomSalesSlice = createSlice({
  name: "ecomsales",
  initialState: {
    invoiceId: "",
    warehouse: "",
    source: "pos",
    status: "complete",
    products: [],
    return_products: [],
    paidAmount: {
      cash: 0,
      card: ["dbbl", 0],
      mfs: ["bkash", 0],
    },
    changeAmount: 0,
    billerId: "",
    customerId: "",
    // totalItem: 0,
    // total: 0,
    // discount: 0,
    // vat: 0,
    // subTotal: 0,
    // totalReceived: 0,

    saleFinalize: [],
    amountCard: 0,
    mfs: { mfs: "Bkash" },
    saleCard: "",
    saleMfsName: { mfs: "Bkash" },
    mfsAmount: 0,
    cashReceived: 0,
    amountTotalReceived: 0,
    LastInvoiceId: "",
    pointAmount: 0,
  },

  reducers: {
    updateSaleValue: (state, action) => {
      state.invoiceId = action.payload.data.invoiceId;
      state.warehouse = action.payload.data.warehouse;
      state.source = action.payload.data.source;
      state.status = action.payload.data.status;
      state.products = action.payload.data.products;
      state.return_products = action.payload.data.return_products;
      state.paidAmount = action.payload.data.paidAmount;
      state.changeAmount = action.payload.data.changeAmount;
      state.billerId = action.payload.data.billerId;
      state.customerId = action.payload.data.customerId;
      // totalItem: 0,
      // total: 0,
      // discount: 0,
      // vat: 0,
      // subTotal: 0,
      // totalReceived: 0,

      state.saleFinalize = action.payload.data.saleFinalize;
      state.amountCard = action.payload.data.amountCard;
      state.mfs = action.payload.data.mfs;
      state.saleCard = action.payload.data.saleCard;
      state.saleMfsName = action.payload.data.saleMfsName;
      state.mfsAmount = action.payload.data.mfsAmount;
      state.cashReceived = action.payload.data.cashReceived;
      state.amountTotalReceived = action.payload.data.amountTotalReceived;
      state.LastInvoiceId = action.payload.data.LastInvoiceId;
      state.pointAmount = action.payload.data.paidAmount;
    },

    selectCustomer: (state, action) => {
      state.customerId = action.payload;
      // console.log(state);
    },
    selectProducts: (state, action) => {
      state.products = action.payload;
    },
    reset: () => intialState,
  },
});

export const {
  updateSaleValue,
  selectCustomer,
  selectProducts,
  reset,
} = ecomSalesSlice.actions;

export const ecomSalesReducer = ecomSalesSlice.reducer;
