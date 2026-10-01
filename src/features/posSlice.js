import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";

const user = signInUser();

const intialState = {
  invoiceId: "10000001",
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
  disPercent: 0,
  disTaka: 0,
  billerId: user?.id,
  customerId: "62e301c1ee6c8940f6ac1515",
  customerPhone: "--",
  customerName: "Walkway Customer",
  updateUser: user?.id,
  status: "complete",
};

const discountPercentCalculation = (disPercent, products) => {
  let total = 0;
  products.map((pro) => {
    total = total + parseFloat(pro.qty) * parseFloat(pro.mrp);
  });
  const discount = parseFloat(total * (disPercent / 100)).toFixed(2);
  return { discount };
};

const discountTakaCalculation = (disTaka, products) => {
  let total = 0;
  products.map((pro) => {
    total = total + parseFloat(pro.qty) * parseFloat(pro.mrp);
  });

  const discountTaka = parseFloat((parseInt(disTaka) / total) * 100).toFixed(2);
  const percent = parseFloat(discountTaka);
  console.log("Discount Percentage", typeof percent, percent);
  return percent;
};

export const posSlice = createSlice({
  name: "posSales",
  initialState: intialState,

  reducers: {
    selectInvoiceId: (state, action) => {
      return {
        ...state,
        invoiceId: action.payload,
      };
    },
    AllSaleDataVoid: (state, action) => {
      state = action.payload;
      return {
        ...state,
      };
    },
    selcetBiller: (state, action) => {
      return { ...state, billerId: action.payload };
    },
    selecetDisPercent: (state, action) => {
      const { discount } = discountPercentCalculation(
        action.payload,
        state.products
      );
      return {
        ...state,
        disPercent: action.payload,
        discount: discount,
      };
    },
    selecetDisTaka: (state, action) => {
      console.log("TK Value", action.payload);
      const discountPercent = discountTakaCalculation(
        action.payload,
        state.products
      );

      console.log("TK Value", discountPercent);
      return {
        ...state,
        discount: action.payload,
        disPercent: discountPercent,
      };
    },
    selcetCustomer: (state, action) => {
      // console.log("Add Customer", action.payload);
      // const newPoint = state.point.new + action.payload.point;
      return {
        ...state,
        customerId: action.payload.customerId,
        point: {
          old: action.payload.point,
          new: state.todayPoint + action.payload.point,
        },
        customerPhone: action.payload.phone,
        customerName: action.payload.name,
      };
    },
    selectWarehouse: (state, action) => {
      return {
        ...state,
        warehouse: action.payload,
      };
    },
    selectAamarId: (state, action) => {
      return {
        ...state,
        aamarId: action.payload,
      };
    },
    selcetProductsCart: (state, action) => {
      return {
        ...state,
        products: action.payload,
      };
    },
    saleFinalize: (state, action) => {
      // console.log(action.payload);
      // console.log(
      //   state.point.old,
      //   action.payload.newPoint,
      //   state.paidAmount.point
      // );
      const pointToday = Math.floor(action.payload.grossTotalRound / 100);
      const newPoint =
        Number(state.point.old) + pointToday - state.paidAmount.point;
      return {
        ...state,
        totalItem: action.payload.totalItem,
        total: action.payload.total,
        vat: action.payload.vatAmount,
        grossTotal: action.payload.grossTotal,
        grossTotalRound: action.payload.grossTotalRound,
        // discount: action.payload.discount,

        changeAmount:
          state.totalReceived +
          action.payload.reTotal -
          action.payload.grossTotalRound,
        point: {
          ...state.point,
          new: newPoint,
        },
        todayPoint: pointToday,
        returnCal: {
          ...state.returnCal,
          totalItem: parseFloat(action.payload.reTotalItem),
          total: action.payload.reTotal,
          grossTotalRound: action.payload.reGrossTotalRound,
          grossTotal: action.payload.reGrossTotal,
          point: action.payload.rePoint,
          vat: action.payload.reVat,
        },
      };
    },

    salesReturnCal: (state, action) => {
      return {
        ...state,
        returnCal: {
          ...state.returnCal,
          totalItem: parseFloat(action.payload.totalItem),
          total: action.payload.total,
          grossTotalRound: action.payload.grossTotalRound,
          grossTotal: action.payload.grossTotal,
          point: action.payload.newPoint,
          vat: action.payload.vatAmount,
        },
      };
    },
    salesPromoPrice: (state, action) => {
      return {
        ...state,
        promo_discount: action.payload,
      };
    },
    salesAmountRecived: (state, action) => {
      return {
        ...state,
        totalReceived: action.payload.totalRecivedAmount,
        changeAmount: action.payload.changeAmount - state.promo_discount,
      };
    },

    saleCash: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          cash: action.payload,
        },
      };
    },
    saleCardName: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          card: { ...state.paidAmount.card, name: action.payload },
        },
      };
    },
    saleCardAmount: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          card: { ...state.paidAmount.card, amount: action.payload },
        },
      };
    },
    saleMfsName: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          mfs: { ...state.paidAmount.mfs, name: action.payload },
        },
      };
    },
    saleMfsAmount: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          mfs: { ...state.paidAmount.mfs, amount: action.payload },
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
    saleDiscount: (state, action) => {
      return {
        ...state,
        discount: action.payload,
      };
    },
    // saleDiscountPercent: (state, action) => {
    //   const { grossTotal, grossTotalRound } = totalDiscount(action.payload, state.products)
    //   return {
    //     ...state,
    //     discountPercent: action.payload,
    //     grossTotal: grossTotal,
    //     grossTotalRound: grossTotalRound
    //   };
    // },
    saleReturnProducts: (state, action) => {
      return {
        ...state,
        returnProducts: action.payload,
      };
    },
    saleReturnInfo: (state, action) => {
      return {
        ...state,
        returnInvoice: action.payload.returnInvoice,
        customerId: action.payload.customerId,
        customerPhone: action.payload.customerPhone,
        customerName: action.payload.customerName,
        point: {
          ...state.point,
          old: action.payload.customerPoint,
        },
      };
    },
    saleReturnQty: (state, action) => {
      let seletedItem = state.returnProducts.filter(
        (item) => item.article_code === action.payload.id
      );
      let restItem = state.returnProducts.filter(
        (item) => item.article_code !== action.payload.id
      );
      seletedItem = {
        ...seletedItem,
        qty: action.payload.qty,
      };
      restItem = { ...restItem, seletedItem };
      const returnItems = restItem.sort((a, b) => a.order - b.order);
      return {
        ...state,
        returnProducts: returnItems,
      };
    },
    saleReset: () => intialState,

    resetReturn: (state, action) => {
      state.returnProducts = [];
    },
    // DataAddSales: (state, action) => {
    //   state.warehouse = action.payload;
    //   state.source = action.payload;
    //   state.invoiceId = action.payload;
    //   state.return_products = action.payload;
    //   state.paidAmount = action.payload;
    //   state.billerId = action.payload;
    //   state.status = action.payload;
    // },
    // selcetProduct: (state, action) => {
    //   state.products = action.payload;
    // },
    // saleFinalize: (state, action) => {
    //   state.saleFinalize = action.payload;
    // },

    // saleCashReceived: (state, action) => {
    //   state.cashReceived = action.payload;
    // },

    // totalReceived: (state, action) => {
    //   state.amountTotalReceived = action.payload;
    // },
    // totalChangeAmount: (state, action) => {
    //   state.changeAmount = action.payload;
    // },
    // LastInvoiceId: (state, action) => {
    //   state.invoiceId = action.payload;
    // },
    // reset: () => intialState,
  },
});

export const {
  selcetBiller,
  selecetDisPercent,
  selecetDisTaka,
  selcetCustomer,
  AllSaleDataVoid,
  selcetProductsCart,
  saleFinalize,
  salesAmountRecived,
  saleCash,
  saleCardName,
  saleCardAmount,
  saleMfsName,
  saleMfsAmount,
  salePointAmount,
  saleDiscount,
  // saleDiscountPercent,
  saleNewPoint,
  saleReset,
  selectInvoiceId,
  saleReturnProducts,
  saleReturnInfo,
  saleReturnQty,
  salesPromoPrice,
  salesReturnCal,
  resetReturn,
  selectWarehouse,
} = posSlice.actions;

export const posReducer = posSlice.reducer;
