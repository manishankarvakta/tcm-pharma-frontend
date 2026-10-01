import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";
const user = signInUser();

export const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    name: "",
    email: "",
    code: "",
    company: "",
    products: [],
    address: "",
    type: "",
    phone: "",
    status: "",
    aamarId: user?.aamarId,
  },
  reducers: {
    
    supplierProducts: (state, action) => {
      state.products = action.payload;

    },
    DataAddSuppliers: (state, action) => {
      state.name = action.payload;
      state.email = action.payload;
      state.code = action.payload;
      state.company = action.payload;
      state.address = action.payload;
      state.type = action.payload;
      state.phone = action.payload;
      state.status = action.payload;
    },
  },
});

export const { supplierProducts, DataAddSuppliers } = supplierSlice.actions;
export const supplierProductsReducer = supplierSlice.reducer;
