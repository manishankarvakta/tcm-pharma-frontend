import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";
const user = signInUser();
const initialState = {
  name: "",
  article_code: "",
  company: null,
  group: null,
  generic: null,
  brand: null,
  category: null,
  subCategory: null,
  brandName: "",
  tp: 0,
  mrp: 0,
  profit: 0,
  details: "",
  unit: "",
  alert_qty: 0,
  pcsBox: 0,
  size: "",
  product_type: "",
  minQty: 0,
  maxQty: 0,
  vat: 0,
  vat_method: false,
  discount: 0,
  discount_type: false,
  hide_website: true,
  photo: "",
  type: "LOCAL",
  aamarId: user?.aamarId,
  shipping_method: "cod",
  status: "active",
  supplier: null,
};
export const productAddSlice = createSlice({
  name: "productAdd",
  initialState: initialState,
  reducers: {
    selectSupplier: (state, action) => {
      return { ...state, supplier: action.payload };
    },
    selectGroup: (state, action) => {
      return { ...state, group: action.payload };
    },
    selectGeneric: (state, action) => {
      return { ...state, generic: action.payload };
    },
    selectBrand: (state, action) => {
      return { ...state, brand: action.payload };
    },
    selectBrandName: (state, action) => {
      return { ...state, brandName: action.payload };
    },
    selectCategory: (state, action) => {
      return { ...state, category: action.payload };
    },
    selectAamarId: (state, action) => {
      return { ...state, aamarId: action.payload };
    },
    selectSubCategory: (state, action) => {
      return { ...state, subCategory: action.payload };
    },
    selectUnit: (state, action) => {
      return { ...state, unit: action.payload };
    },
    productName: (state, action) => {
      const brand = (action.payload || "").trim();
      const size = (state.size || "").trim();
      const newName = size ? `${brand} ${size}` : brand;
      return { ...state, name: newName.replace(/\s+/g, " ") };
    },
    productNameSize: (state, action) => {
      const brand = (state.brandName || "").trim();
      const size = (action.payload || "").trim();
      const newName = brand ? `${brand} ${size}` : size;
      return { ...state, name: newName.replace(/\s+/g, " ") };
    },
    sizeInput: (state, action) => {
      return { ...state, size: action.payload };
    },
    productTypeInput: (state, action) => {
      return { ...state, product_type: action.payload };
    },
    selectType: (state, action) => {
      return { ...state, type: action.payload };
    },
    pcsBoxInput: (state, action) => {
      return { ...state, pcsBox: action.payload };
    },
    tpInput: (state, action) => {
      return {
        ...state,
        tp: action.payload,
        profit:
          action.payload > 0
            ? parseInt(
                ((parseInt(state?.mrp > 0 ? state?.mrp : 0) -
                  parseInt(action.payload > 0 ? action.payload : 0)) /
                  parseInt(action.payload)) *
                  100
              )
            : 0,
      };
    },
    mrpInput: (state, action) => {
      return {
        ...state,
        mrp: action.payload,
        profit:
          state?.tp > 0
            ? parseInt(
                ((parseInt(action.payload > 0 ? action.payload : 0) -
                  parseInt(state?.tp > 0 ? state?.tp : 0)) /
                  parseInt(state?.tp)) *
                  100
              )
            : 0,
      };
    },
    profitInput: (state, action) => {
      return { ...state, profit: action.payload };
    },
    minQtyInput: (state, action) => {
      return { ...state, minQty: action.payload };
    },
    maxQtyInput: (state, action) => {
      return { ...state, maxQty: action.payload };
    },
    alertQtyInput: (state, action) => {
      return { ...state, alert_qty: action.payload };
    },
    vatInput: (state, action) => {
      return { ...state, vat: action.payload };
    },
    selectVatMethod: (state, action) => {
      return { ...state, vat_method: action.payload };
    },
    inputShippingMethod: (state, action) => {
      return { ...state, shipping_method: action.payload };
    },
    discountInput: (state, action) => {
      return { ...state, discount: action.payload };
    },
    selectDiscountType: (state, action) => {
      return { ...state, discount_type: action.payload };
    },
    selectStatus: (state, action) => {
      return { ...state, status: action.payload };
    },
    inputProductDetails: (state, action) => {
      return { ...state, details: action.payload };
    },
    inputProductCode: (state, action) => {
      return { ...state, article_code: action.payload };
    },
    inputName: (state, action) => {
      return { ...state, name: action.payload };
    },
    inputAll: (state, action) => {
      state = action.payload;
      return {
        ...state,
        name: action.payload?.name ? action.payload.name.replace(/\s+/g, " ") : "",
        profit:
          state?.tp > 0
            ? parseInt(
                ((parseInt(state?.mrp > 0 ? state?.mrp : 0) -
                  parseInt(state?.tp > 0 ? state?.tp : 0)) /
                  parseInt(state?.tp)) *
                  100
              )
            : 0,
      };
      // return { ...state};
    },
    inputMulti: (state, action) => {
      return {
        ...state,
        brand: 0,
        mrp: 0,
        profit: 0,
        details: "",
        alert_qty: 0,
        pcsBox: 0,
        size: "",
        minQty: 0,
        maxQty: 0,
        vat: 0,
        vat_method: false,
        discount: 0,
        discount_type: false,
      };
    },
    resetProductAdd: () => initialState,
  },
});
export const {
  selectSupplier,
  selectGroup,
  selectGeneric,
  selectBrand,
  selectBrandName,
  selectCategory,
  selectSubCategory,
  productName,
  productNameSize,
  selectUnit,
  sizeInput,
  productTypeInput,
  selectType,
  pcsBoxInput,
  tpInput,
  mrpInput,
  profitInput,
  minQtyInput,
  maxQtyInput,
  alertQtyInput,
  vatInput,
  selectVatMethod,
  inputShippingMethod,
  discountInput,
  selectDiscountType,
  selectStatus,
  inputProductDetails,
  inputProductCode,
  inputName,
  inputAll,
  inputMulti,
  resetProductAdd,
} = productAddSlice.actions;
export const productAddReducer = productAddSlice.reducer;
