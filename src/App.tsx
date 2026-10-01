import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import POS from "./Components/Pages/POS/POS";
// import POS2 from "./Components/Pages/POS2/POS";
import Categories from "./Components/Category/Categories";
import PrintReceipt from "./Components/Common/PrintReceipt/PrintReceipt";
import Home from "./Components/Pages/Home/Home";
import NotFound from "./Components/Pages/NotFound/NotFound";
import AddProduct from "./Components/Product/AddProduct";
import Products from "./Components/Product/Products";
import UpdateProducts from "./Components/Product/UpdateProducts";
import Sales from "./Components/Sale/Sales";
import AddUser from "./Components/User/AddUser";
import UpdateUser from "./Components/User/UpdateUser";
import User from "./Components/User/User";
import UserDetails from "./Components/User/UserDetails";
// import CsvImporter from "./Components/Common/CsvImporter/CsvImporter0";
// import Toast from "./Components/Common/Toast/Toast";
import Brand from "./Components/Brand/Brand";
// import Update from "./Components/Brand/UpateBrand";
import UpdateBrand from "./Components/Brand/UpdateBrand";
import Dashboard from "./Components/Pages/DashBoard/Dashboard";
// import { useEffect, useState } from "react";
// import KeyPress from "./Components/Common/KeyPress/KeyPress";
// import PrintTest from "./Components/Common/PrintReceipt/PrintTest";
import Customer from "./Components/Customer/Customer";
import Login from "./Components/Pages/Login/Login";
import RequireAdminAuth from "./Components/Utility/RequireAdminAuth";
import RequireAuth from "./Components/Utility/RequireAuth";
// import Search from "./Components/Common/ProductSearch/search";
import { ProgressBar } from "react-bootstrap";
import DataTable from "./Components/Common/DataTable/DataTable";
import Inventory from "./Components/Inventory/Inventory";
import Purchase from "./Components/Purchase/Purchase";
import PurchaseCreate from "./Components/Purchase/PurchaseCreate";
import CategorySales from "./Components/Sale/CategorySales";
import Supplier from "./Components/Supplier/Supplier";
// import UpdatePurchase from "./Components/Purchase/UpdatePurchase";
import GRN from "./Components/GRN/GRN";
import GRNCreate from "./Components/GRN/GRNCreate";
import InventorySession from "./Components/Inventory/InventorySession/InventorySession";
import CreateSupplier from "./Components/Supplier/CreateSupplier";
import UpdateSupplier from "./Components/Supplier/UpdateSupplier";
import Warehouse from "./Components/Warehouse/Warehouse";
// import SupplierSelectByProduct from "./Components/Common/CustomSelect/SupplierSelectByProduct";
import AddCategory from "./Components/Category/AddCategory";
import UpdateCategory from "./Components/Category/UpdateCategory";
import UpdateCustomer from "./Components/Customer/UpdateCustomer";
import Unit from "./Components/Unit/Unit";
import UpdateUnit from "./Components/Unit/UpdateUnit";
import UpdateWarehouse from "./Components/Warehouse/UpdateWarehouse";

import Price from "./Components/Price/Price";

// import SearchProduct from "./Components/Common/CustomSelect/SearchProduct";
// import SelectCustomer from "./Components/Common/CustomSelect/selectCustomer";
// import WareHouseDW from "./Components/Common/CustomSelect/WareHouseDW";
// import CategorySelectByMC from "./Components/Common/CustomSelect/categorySelectByMC";
// import SelectBrand from "./Components/Common/CustomSelect/selectBrand";
// import SelectUnit from "./Components/Common/CustomSelect/selectUnit";
import ImportPrice from "./Components/Price/ImportPrice";
import ImportProduct from "./Components/Product/ImportProduct";
// import PrintReceiptById from "./Components/Common/PrintReceipt/PrintReceiptById";
import Damage from "./Components/Damage/Damage";
import CreateRtv from "./Components/RTV/CreateRtv";
import Rtv from "./Components/RTV/Rtv";

import { Helmet } from "react-helmet";
import ExportArticleSale from "./Components/Sale/ExportArticleSale";
import ExportSale from "./Components/Sale/ExportSale";

// Junk Food Pos

import Cogs from "./Components/Cogs/Cogs";
import Exports from "./Components/Exports/Exports";
import InventoryImport from "./Components/Inventory/InventoryImport";
import InventoryInit from "./Components/Inventory/InventoryInit";
import InventoryExport from "./Components/Inventory/InventorySession/InventoryExport";
import TakeAway from "./Components/Pages/TakeAway/TakeAway";
import DeleteSale from "./Components/Sale/DeleteSale";
// import DamageCreate from "./Components/Damage/DamageCreate";
import Ecom from "./Components/Ecom/Pages/Ecom/Ecom";
import EcomSaleDeliver from "./Components/Ecom/Pages/EcomUpdate/EcomSaleDeliver";
import EcomSaleProcess from "./Components/Ecom/Pages/EcomUpdate/EcomSaleProcess";
import EcomSaleUpdate from "./Components/Ecom/Pages/EcomUpdate/EcomSaleUpdate";
import InventoryAdjust from "./Components/Inventory/InventoryAdjust";
import PurchaseUpdate from "./Components/Purchase/PurchaseUpdate";
import CategorySale from "./Components/Sale/CategorySale";
import SupplierProductSale from "./Components/Sale/SupplierProductSale";
import CreateTpn from "./Components/TPN/CreateTpn";
import ReceiveTPN from "./Components/TPN/ReceiveTPN";
import Tpn from "./Components/TPN/Tpn";
// import CreateTpnNew from "./Components/TPN/CreateTpnNew";
import AccountHeads from "./Components/AccountHeads/AccountHeads";
import AddAccountHead from "./Components/AccountHeads/AddAccountHead";
import UpdateAccountHead from "./Components/AccountHeads/UpdateAccountHead";
import Adjust from "./Components/Adjust/Adjust";
import CreateAdjust from "./Components/Adjust/CreateAdjust";
import Accounts from "./Components/Accounts/Accounts";
import AddAccount from "./Components/Accounts/AddAccount";
import AddAccountExpense from "./Components/Accounts/AddAccountExpense";
import AddAfterSale from "./Components/Accounts/AddAfterSale";
import ImportBrand from "./Components/Brand/parts/ImportBrand";
import PrintReceiptByIdNew from "./Components/Common/PrintReceipt/PrintReceiptByIdNew";
import DamageCreate from "./Components/Damage/DamageCreate";
import Generic from "./Components/Generic/Generic";
import ImportGeneric from "./Components/Generic/parts/ImportGeneric";
import Group from "./Components/Group/Group";
import ImportGroup from "./Components/Group/Parts/ImportGroup";
import ProductLedger from "./Components/Product/ProductLedger";
import PurchaseCreateSearch from "./Components/Purchase/PurchaseCreateSearch";
import AllCategorySale from "./Components/Sale/AllCategorySale";
import PopularProductDateWise from "./Components/Sale/PopularProductDateWise";
import SmsPage from "./Components/SMS/SmsPage";
import ImportSupplier from "./Components/Supplier/ImportSupplier";
import RequireAdminAuthManager from "./Components/Utility/RequireAdminAuthManager";
import RequireAdminAuthSupervisor from "./Components/Utility/RequireAdminAuthSupervisor";
import RequireAdminEcomAuth from "./Components/Utility/RequireAdminEcomAuth";
import RequireOnlyAdminAuth from "./Components/Utility/RequireOnlyAdminAuth";
// import ProcessMovement from "./Components/Inventory/movement/parts/ProcessMovement";
import ImportCustomer from "./Components/Customer/ImportCustomer";
import ProductMovement from "./Components/Inventory/movement/ProductMovement";
import StockLedger from "./Components/Inventory/StockLedger";
import Settings from "./Components/Settings/Settings";
import SupplierLedger from "./Components/Supplier/supplierLedger";
import Profile from "./Components/User/Profile";
import Reports from "./Components/Report/Reports";
import BackupRestore from "./Components/Settings/BackupRestore";
import { useSessionCheck } from "./Components/Hooks/useSessionCheck";

import { Toaster } from "react-hot-toast";

function App() {
  useSessionCheck();
  return (
    // <Router basename="pos-client-type" />
    <div className="App">
      <Toaster position="bottom-center" reverseOrder={false} />
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS</title>
      </Helmet>
      <div className="AppGlass">
        <Routes>
        {/* <Route path="" element={<Login />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/table" element={<DataTable />} />
          <Route path="/progress" element={<ProgressBar />} />
          <Route
            path="/pos"
            element={
              <RequireAuth>
                <POS />
              </RequireAuth>
            }
          />
          {/* <Route
            path="/void"
            element={
              <RequireAuth>
                <VoidReturn />
              </RequireAuth>
            }
          /> */}
          <Route
            path="/inventory-session"
            element={
              <RequireAuth>
                <InventorySession />
              </RequireAuth>
            }
          />
          <Route
            path="/inventory-init"
            element={
              <RequireAuth>
                <InventoryInit />
              </RequireAuth>
            }
          />
          <Route
            path="/cogs"
            element={
              <RequireAdminAuthManager>
                <Cogs />
              </RequireAdminAuthManager>
            }
          />
          <Route
            path="/sms"
            element={
              <RequireAuth>
                <SmsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/group"
            element={
              <RequireAuth>
                <Group />
              </RequireAuth>
            }
          />
          <Route
            path="/generic"
            element={
              <RequireAuth>
                <Generic />
              </RequireAuth>
            }
          />
          <Route
            path="/inventory-export"
            element={
              <RequireAdminAuth>
                <InventoryExport />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/inventory-import"
            element={
              <RequireAdminAuth>
                <InventoryImport />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/inventory-adjust"
            element={
              <RequireAdminAuth>
                <InventoryAdjust />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/delete"
            element={
              <RequireAdminAuth>
                <DeleteSale />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/user"
            element={
              <RequireAdminAuth>
                <User />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/user/:id"
            element={
              <RequireAuth>
                <UserDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/user/add"
            element={
              <RequireAdminAuth>
                <AddUser />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/user/update/:id"
            element={
              <RequireOnlyAdminAuth>
                <UpdateUser />
              </RequireOnlyAdminAuth>
            }
          />

          {/* account routes */}
          <Route
            path="/accountheads"
            element={
              <RequireOnlyAdminAuth>
                <AccountHeads />
              </RequireOnlyAdminAuth>
            }
          />
          <Route
            path="/addAccountHead"
            element={
              <RequireOnlyAdminAuth>
                <AddAccountHead />
              </RequireOnlyAdminAuth>
            }
          />
          <Route
            path="/accountheads/update/:id"
            element={
              <RequireOnlyAdminAuth>
                <UpdateAccountHead />
              </RequireOnlyAdminAuth>
            }
          />
          <Route
            path="/accounts"
            element={
              <RequireOnlyAdminAuth>
                <Accounts />
              </RequireOnlyAdminAuth>
            }
          />
          <Route
            path="/addAfterSale"
            element={
              <RequireOnlyAdminAuth>
                <AddAfterSale />
              </RequireOnlyAdminAuth>
            }
          />
          <Route
            path="/addAccount"
            element={
              <RequireOnlyAdminAuth>
                <AddAccount />
              </RequireOnlyAdminAuth>
            }
          />
          <Route
            path="/addAccountExpense"
            element={
              <RequireOnlyAdminAuth>
                <AddAccountExpense />
              </RequireOnlyAdminAuth>
            }
          />
          <Route
            path="/product"
            element={
              <RequireAdminAuthSupervisor>
                <Products />
              </RequireAdminAuthSupervisor>
            }
          />
          <Route
            path="/product/ledger/:productId"
            element={
              <RequireAdminAuthSupervisor>
                <ProductLedger />
              </RequireAdminAuthSupervisor>
            }
          />
          <Route
            path="/price/import"
            element={
              <RequireAdminAuth>
                <ImportPrice />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/product/import"
            element={
              <RequireAdminAuth>
                <ImportProduct />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/group/import"
            element={
              <RequireAdminAuth>
                <ImportGroup />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/generic/import"
            element={
              <RequireAdminAuth>
                <ImportGeneric />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/brand/import"
            element={
              <RequireAdminAuth>
                <ImportBrand />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/supplier/import"
            element={
              <RequireAdminAuth>
                <ImportSupplier />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/product/add"
            element={
              <RequireAdminAuth>
                <AddProduct />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/product/update/:id"
            element={
              <RequireAdminAuth>
                <UpdateProducts />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/ecom"
            element={
              <RequireAdminEcomAuth>
                <Ecom />
              </RequireAdminEcomAuth>
            }
          />
          <Route
            path="/ecom/orderinfoupdate/:id"
            element={
              <RequireAdminAuth>
                <EcomSaleUpdate />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/ecom/orderinfoprocess/:id"
            element={
              <RequireAdminAuth>
                <EcomSaleProcess />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/ecom/orderinfodeliver/:id"
            element={
              <RequireAdminAuth>
                <EcomSaleDeliver />
              </RequireAdminAuth>
            }
          />

          <Route
            path="/price/add"
            element={
              <RequireAdminAuth>
                <Price />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/sales"
            element={
              <RequireAdminAuth>
                <Sales />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/category-sales"
            element={
              <RequireAdminAuth>
                <CategorySales />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/category"
            element={
              <RequireAdminAuthSupervisor>
                <Categories />
              </RequireAdminAuthSupervisor>
            }
          />
          <Route
            path="/category/addCategory"
            element={
              <RequireAdminAuth>
                <AddCategory />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/category/update/:id"
            element={
              <RequireAdminAuth>
                <UpdateCategory />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/brand"
            element={
              <RequireAdminAuthSupervisor>
                <Brand />
              </RequireAdminAuthSupervisor>
            }
          />

          <Route
            path="/brand/update/:id"
            element={
              <RequireAdminAuth>
                <UpdateBrand />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/unit"
            element={
              <RequireAdminAuthSupervisor>
                <Unit />
              </RequireAdminAuthSupervisor>
            }
          />

          <Route
            path="/unit/update/:id"
            element={
              <RequireAdminAuth>
                <UpdateUnit />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/create-supplier"
            element={
              <RequireAdminAuth>
                <CreateSupplier />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/update-supplier/:id"
            element={
              <RequireAdminAuth>
                <UpdateSupplier />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/customer"
            element={
              <RequireAdminAuthSupervisor>
                <Customer />
              </RequireAdminAuthSupervisor>
            }
          />
          <Route
            path="/customer/importCustomer"
            element={
              <RequireAdminAuthSupervisor>
                <ImportCustomer />
              </RequireAdminAuthSupervisor>
            }
          />

          <Route
            path="/customer/update/:id"
            element={
              <RequireAdminAuth>
                <UpdateCustomer />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/supplier"
            element={
              <RequireAdminAuth>
                <Supplier />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/supplier-ledger/:id"
            element={
              <RequireAdminAuth>
                <SupplierLedger />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/tpn"
            element={
              <RequireAdminAuth>
                <Tpn />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/tpn-out"
            element={
              <RequireAdminAuth>
                <CreateTpn />
              </RequireAdminAuth>
            }
          />
          {/* <Route
            path="/tpn-out"
            element={
              <RequireAdminAuth>
                <CreateTpnNew />
              </RequireAdminAuth>
            }
          /> */}
          <Route
            path="/tpn-received"
            element={
              <RequireAdminAuth>
                <ReceiveTPN />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/purchase"
            element={
              <RequireAdminAuth>
                <Purchase />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/purchase-create"
            element={
              <RequireAdminAuth>
                <PurchaseCreate />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/purchase-createSearch"
            element={
              <RequireAdminAuth>
                <PurchaseCreateSearch />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/purchase-update/:id"
            element={
              <RequireAdminAuth>
                <PurchaseUpdate />
              </RequireAdminAuth>
            }
          />
          {/* 
          <Route
            path="/update-purchase/:id"
            element={
              <RequireAdminAuth>
                <UpdatePurchase />
              </RequireAdminAuth>
            }
          /> */}
          <Route
            path="/grn"
            element={
              <RequireAdminAuth>
                <GRN />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/grn-create"
            element={
              <RequireAdminAuth>
                <GRNCreate />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequireAdminAuth>
                <Inventory />
              </RequireAdminAuth>
            }
          />
          {/* <Route
            path="/inventory-movement"
            element={
              <RequireAdminAuth>
                <ProductMovement />
              </RequireAdminAuth>
            }
          /> */}
          <Route
            path="/stock-ledger"
            element={
              <RequireAdminAuth>
                <StockLedger />
              </RequireAdminAuth>
            }
          />

          {/* <Route
            path="/exports"
            element={
              <RequireAdminAuth>
                <Exports />
              </RequireAdminAuth>
            }
          />*/}

           {/* Reports */}
           <Route
             path="/reports"
             element={<Navigate to="/reports/customerWiseSalesReport" replace />}
           />
           <Route
             path="/reports/:reportKey"
             element={
               <RequireAuth>
                 <Reports />
               </RequireAuth>
             }
           />
          <Route path="/login" element={<Login />} />
          <Route path="/sale" element={<PrintReceipt />} />
          {/* <Route
            path="/print"
            element={<PrintReceipt invoiceId="62757c6dbc14617b6facc688" />}

          /> */}
          <Route path="settings" element={<Settings />} />
          <Route path="/settings/backup" element={<RequireAdminAuth><BackupRestore /></RequireAdminAuth>} />
          <Route path="/print/:id" element={<PrintReceiptByIdNew />} />
          {/* <Route path="/print/:id" element={<PrintReceiptById />} /> */}
          <Route path="/warehouse" element={<Warehouse />} />
          <Route
            path="/warehouse/update/:id"
            element={
              <RequireAdminAuth>
                <UpdateWarehouse />
              </RequireAdminAuth>
            }
          />

          {/* Damage router */}
          <Route
            path="/damage"
            element={
              <RequireAdminAuth>
                <Damage />
              </RequireAdminAuth>
            }
          />

          <Route
            path="/damagecreate"
            element={
              <RequireAdminAuth>
                <DamageCreate />
              </RequireAdminAuth>
            }
          />

          {/* Adjust */}
          <Route path="adjust" element={<Adjust />} />
          <Route path="create-adjust" element={<CreateAdjust />} />

          {/* Rtv router */}
          <Route
            path="/rtv-create"
            element={
              <RequireAdminAuth>
                <CreateRtv />
              </RequireAdminAuth>
            }
          />

          <Route
            path="/rtv"
            element={
              <RequireAdminAuth>
                <Rtv />
              </RequireAdminAuth>
            }
          />

          <Route
            path="/categorySaleExport"
            element={
              <RequireAdminAuth>
                <CategorySale />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/supplierSaleExport"
            element={
              <RequireAdminAuth>
                <SupplierProductSale />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/popular"
            element={
              <RequireAdminAuth>
                <PopularProductDateWise />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/saleExport"
            element={
              <RequireAdminAuth>
                <ExportSale />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/articleSaleExport"
            element={
              <RequireAdminAuth>
                <ExportArticleSale />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/allCategorySales"
            element={
              <RequireAdminAuth>
                <AllCategorySale />
              </RequireAdminAuth>
            }
          />

          <Route
            path="/takeAway"
            element={
              <RequireAdminAuth>
                <TakeAway />
              </RequireAdminAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
