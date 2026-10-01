import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  lang: "en",
  country: "USA",
  aamarID: "Aamar ID",
  dashboard: "Dashboard",
  pos: "POS",
  sales: "Sales",
  customers: "Customers",
  accounts: "Accounts",
  accountHead: "Accounts Head",
  transaction: "Transaction",
  products: "Products",
  allProducts: "All Products",
  group: "Group",
  generics: "Generics",
  brand: "Brand",
  procurement: "Procurement",
  purchase: "Purchase",
  GRN: "GRN",
  RTV: "RTV",
  TPN: "TPN",
  supplier: "Supplier",
  inventory: "Inventory",
  inventories: "Inventories",
  movement: " Movement",
  damage: " Damage",
  exports: "Exports",
  settings: "Settings",
  profileSetting: "Profile Settings",
  users: "Users",
  warehouse: "Warehouse",
  sms: "SMS",
  storeSetting: "Store Settings",
  adjust: "Adjustment",
  createAdjust: "Create Adjustment",
};

export const languageSlice = createSlice({
  name: "language",
  initialState: initialState,
  reducers: {
    selectLanguage: (state, action) => {
      console.log(action.payload);
      return action.payload; // Mutating the `language` property inside the state object
    },
    resetLanguage: () => initialState,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export const { selectLanguage, resetLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;
