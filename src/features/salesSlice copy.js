import { createSlice } from "@reduxjs/toolkit";
const intialState = {
  returned: [],
};
export const salesSlice = createSlice({
  name: "sales",
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
  },

  reducers: {
    selcetCustomer: (state, action) => {
      state.customerId = action.payload;
      // console.log(state);
    },
    DataAddSales: (state, action) => {
      state.warehouse = action.payload;
      state.source = action.payload;
      state.invoiceId = action.payload;
      state.return_products = action.payload;
      state.paidAmount = action.payload;
      state.billerId = action.payload;
      state.status = action.payload;
    },
    selcetProduct: (state, action) => {
      state.products = action.payload;
    },
    saleFinalize: (state, action) => {
      state.saleFinalize = action.payload;
    },

    saleCashReceived: (state, action) => {
      state.cashReceived = action.payload;
    },

    saleCard: (state, action) => {
      state.card = action.payload;
    },
    saleCardAmount: (state, action) => {
      state.amountCard = action.payload;
    },
    saleMfsName: (state, action) => {
      state.mfs = action.payload;
    },
    saleMfsAmount: (state, action) => {
      state.mfsAmount = action.payload;
    },
    totalReceived: (state, action) => {
      state.amountTotalReceived = action.payload;
    },
    totalChangeAmount: (state, action) => {
      state.changeAmount = action.payload;
    },
    LastInvoiceId: (state, action) => {
      state.invoiceId = action.payload;
    },
    reset: () => intialState,
  },
});

export const {
  DataAddSales,
  selcetCustomer,
  selcetProduct,
  saleFinalize,
  saleCashReceived,
  saleChangeAmount,
  saleCard,
  saleCardAmount,
  saleMfsName,
  saleMfsAmount,
  totalReceived,
  totalChangeAmount,
  LastInvoiceId,
  reset,
} = salesSlice.actions;

export const salesReducer = salesSlice.reducer;
