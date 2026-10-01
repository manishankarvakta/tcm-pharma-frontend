import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import categoryApi from "../services/categoryApi";
import customerApi from "../services/customerApi";
import productApi from "../services/productApi";
import SearchApi from "../services/searchApi";
import userApi from "../services/userApi";
// import companyApi from "../services/companyApi";
// import DamageApi from "../services/damagApi";
import DamageApi from "../services/damageApi";
// import inventoryApi from "../services/inventoryApi";
import grnApi from "../services/grnApi";
import priceApi from "../services/priceApi";
import purchasApi from "../services/purchasApi";
import rtvApi from "../services/rtvApi";
import saleApi from "../services/saleApi";
import supplierApi from "../services/supplierApi";
// import tpnApi from "../services/tpnApi";
import { accountReducer } from "../features/accountSlice";
import { adjustReducer } from "../features/adjustSlice";
import { importReducer } from "../features/importSlice";
import { damageReducer } from "../features/damageSlice";
import { ecomSalesReducer } from "../features/ecomSalesSlice";
import { grnReducer } from "../features/grnSlice";
import { posReducer } from "../features/posSlice";
import { priceUpdateReducer } from "../features/priceUpdateSlice";
import { productAddReducer } from "../features/productAddSlice";
import { productPriceReducer } from "../features/productPriceSlice";
import { purchaseReducer } from "../features/purchaseSlice";
import { rtvReducer } from "../features/rtvSlice";
import { smsReducer } from "../features/smsSlice";
import { supplierProductsReducer } from "../features/supplierSlice";
import { tpnReducer } from "../features/tpnSlice";
import { voidReducer } from "../features/voidSlice";
import { languageReducer } from "../features/languageSlice";
import accountApi from "../services/accountApi";
import accountHeadApi from "../services/accountHeadApi";
import brandApi from "../services/brandApi";
import ecomSaleApi from "../services/ecomApi";
import genericApi from "../services/genericApi";
import groupApi from "../services/groupApi";
import InventoryApi from "../services/inventoryApi";
import InventoryCountApi from "../services/inventoryCountApi";
import SettingsApi from "../services/settingsApi";
import tpnApi from "../services/tpnApi";
import unitApi from "../services/unitApi";
import warehouseApi from "../services/warehouseApi";
import ReportsApi from "../services/reportsApi";
import AdjustApi from "../services/adjustApi";
import stockLedgerApi from "../services/stockLedgerApi";

// Combine all reducers
const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [warehouseApi.reducerPath]: warehouseApi.reducer,
  [SearchApi.reducerPath]: SearchApi.reducer,
  [supplierApi.reducerPath]: supplierApi.reducer,
  [priceApi.reducerPath]: priceApi.reducer,
  [grnApi.reducerPath]: grnApi.reducer,
  [purchasApi.reducerPath]: purchasApi.reducer,

  // [companyApi.reducerPath]: companyApi.reducer,
  [DamageApi.reducerPath]: DamageApi.reducer,
  [InventoryApi.reducerPath]: InventoryApi.reducer,
  [InventoryCountApi.reducerPath]: InventoryCountApi.reducer,
  [rtvApi.reducerPath]: rtvApi.reducer,
  [saleApi.reducerPath]: saleApi.reducer,
  [ecomSaleApi.reducerPath]: ecomSaleApi.reducer,
  [tpnApi.reducerPath]: tpnApi.reducer,
  [unitApi.reducerPath]: unitApi.reducer,
  [ReportsApi.reducerPath]: ReportsApi.reducer,
  // [warehouseApi.reducerPath]: warehouseApi.reducer,
  [brandApi.reducerPath]: brandApi.reducer,
  [SettingsApi.reducerPath]: SettingsApi.reducer,
  [groupApi.reducerPath]: groupApi.reducer,
  [genericApi.reducerPath]: genericApi.reducer,
  [accountHeadApi.reducerPath]: accountHeadApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [stockLedgerApi.reducerPath]: stockLedgerApi.reducer,
  [AdjustApi.reducerPath]: AdjustApi.reducer,
  supplierProductsReducer,
  grnReducer,
  importReducer,
  adjustReducer,
  posReducer,
  voidReducer,
  tpnReducer,
  purchaseReducer,
  rtvReducer,
  damageReducer,
  smsReducer,
  productPriceReducer,
  ecomSalesReducer,
  priceUpdateReducer,
  productAddReducer,
  accountReducer,
  languageReducer,
});

// Redux Persist Config
const persistConfig = {
  key: "AamarDokan",
  storage,
  whitelist: [
    "languageReducer",
    "importReducer",
    "voidReducer",
    "accountReducer",
    "posReducer",
  ], // Add reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warnings for non-serializable actions
    })
      .concat(userApi.middleware)
      .concat(categoryApi.middleware)
      .concat(productApi.middleware)
      .concat(customerApi.middleware)
      .concat(warehouseApi.middleware)
      .concat(unitApi.middleware)
      .concat(brandApi.middleware)
      .concat(SettingsApi.middleware)
      .concat(groupApi.middleware)
      .concat(genericApi.middleware)
      .concat(supplierApi.middleware)
      .concat(priceApi.middleware)
      .concat(SearchApi.middleware)
      .concat(purchasApi.middleware)
      .concat(saleApi.middleware)
      .concat(ecomSaleApi.middleware)
      .concat(tpnApi.middleware)
      .concat(DamageApi.middleware)
      .concat(rtvApi.middleware)
      .concat(grnApi.middleware)
      .concat(InventoryApi.middleware)
      .concat(priceApi.middleware)
      .concat(InventoryCountApi.middleware)
      .concat(accountHeadApi.middleware)
      .concat(accountApi.middleware)
      .concat(ReportsApi.middleware)
      .concat(stockLedgerApi.middleware)
      .concat(AdjustApi.middleware),


  // .concat(companyApi.middleware)
  // .concat(tpnApi.middleware).concat(unitApi.middleware)
  // .contcat(customerApi.middleware),
});

export const persistor = persistStore(Store);

export default Store;
