import React from 'react';
import { Route, Routes } from "react-router-dom";
import POS from "./Components/Pages/POS2/POS";
// import POS2 from "./Components/Pages/POS2/POS";
import Home from "./Components/Pages/Home/Home";
import NotFound from "./Components/Pages/NotFound/NotFound";
import AddUser from "./Components/User/AddUser";
import User from "./Components/User/User";
import UpdateUser from "./Components/User/UpdateUser";
import Products from "./Components/Product/Products";
import UserDetails from "./Components/User/UserDetails";
import AddProduct from "./Components/Product/AddProduct";
import UpdateProducts from "./Components/Product/UpdateProducts";
import Sales from "./Components/Sale/Sales";
import PrintReceipt from "./Components/Common/PrintReceipt/PrintReceipt";
import Categories from "./Components/Category/Categories";
import Brand from "./Components/Brand/Brand";
// import Update from "./Components/Brand/UpateBrand";
import UpdateBrand from "./Components/Brand/UpdateBrand";
import Dashboard from "./Components/Pages/DashBoard/Dashboard";
import { useEffect, useState } from "react";
import KeyPress from "./Components/Common/KeyPress/KeyPress";
import PrintTest from "./Components/Common/PrintReceipt/PrintTest";
import Login from "./Components/Pages/Login/Login";
import RequireAuth from "./Components/Utility/RequireAuth";
import RequireAdminAuth from "./Components/Utility/RequireAdminAuth";
import Customer from "./Components/Customer/Customer";
import Search from "./Components/Common/ProductSearch/search";
import Purchase from "./Components/Purchase/Purchase";
import Inventory from "./Components/Inventory/Inventory";
import Supplier from "./Components/Supplier/Supplier";
import DataTable from "./Components/Common/DataTable/DataTable";
import { ProgressBar } from "react-bootstrap";
import CategorySales from "./Components/Sale/CategorySales";
import PurchaseCreate from "./Components/Purchase/PurchaseCreate";
import UpdatePurchase from "./Components/Purchase/UpdatePurchase";
import GRN from "./Components/GRN/GRN";
import GRNCreate from "./Components/GRN/GRNCreate";
import InventorySession from "./Components/Inventory/InventorySession/InventorySession";
import Warehouse from "./Components/Warehouse/Warehouse";
import CreateSupplier from "./Components/Supplier/CreateSupplier";
import UpdateSupplier from "./Components/Supplier/UpdateSupplier";
import SupplierSelectByProduct from "./Components/Common/CustomSelect/SupplierSelectByProduct";
import AddCategory from "./Components/Category/AddCategory";
import UpdateCategory from "./Components/Category/UpdateCategory";
import UpdateWarehouse from "./Components/Warehouse/UpdateWarehouse";
import UpdateCustomer from "./Components/Customer/UpdateCustomer";
import Unit from "./Components/Unit/Unit";
import UpdateUnit from "./Components/Unit/UpdateUnit";

import Price from "./Components/Price/Price";

import ImportPrice from "./Components/Price/ImportPrice";
import ImportProduct from "./Components/Product/ImportProduct";
import PrintReceiptById from "./Components/Common/PrintReceipt/PrintReceiptById";
import Damage from "./Components/Damage/Damage";
import Rtv from "./Components/RTV/Rtv";
import CreateRtv from "./Components/RTV/CreateRtv";

import ExportSale from "./Components/Sale/ExportSale";
import { Helmet } from "react-helmet";
import ExportArticleSale from "./Components/Sale/ExportArticleSale";

// Junk Food Pos

import TakeAway from "./Components/Pages/TakeAway/TakeAway";
import Cogs from "./Components/Cogs/Cogs";
import DeleteSale from "./Components/Sale/DeleteSale";
import InventoryInit from "./Components/Inventory/InventoryInit";
import InventoryImport from "./Components/Inventory/InventoryImport";
import InventoryExport from "./Components/Inventory/InventorySession/InventoryExport";
import Exports from "./Components/Exports/Exports";
import DamageCreate from "./Components/Damage/DamageCreate";
import Ecom from "./Components/Ecom/Pages/Ecom/Ecom";
import EcomSaleUpdate from "./Components/Ecom/Pages/EcomUpdate/EcomSaleUpdate";
import EcomSaleProcess from "./Components/Ecom/Pages/EcomUpdate/EcomSaleProcess";
import EcomSaleDeliver from "./Components/Ecom/Pages/EcomUpdate/EcomSaleDeliver";
import InventoryAdjust from "./Components/Inventory/InventoryAdjust";
import CategorySale from "./Components/Sale/CategorySale";
import SupplierProductSale from "./Components/Sale/SupplierProductSale";
import PurchaseUpdate from "./Components/Purchase/PurchaseUpdate";
import Tpn from "./Components/TPN/Tpn";
import CreateTpn from "./Components/TPN/CreateTpn";
import ReceiveTPN from "./Components/TPN/ReceiveTPN";
import CreateTpnNew from "./Components/TPN/CreateTpnNew";
import AllCategorySale from "./Components/Sale/AllCategorySale";
import RequireAdminEcomAuth from "./Components/Utility/RequireAdminEcomAuth";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route
            path="/unitdw"
            element={<SelectUnit mc={undefined} handleOnchange={undefined} />}
          /> */}
            {/* <Route path="/pos-test" element={<POStest />} /> */}
            <Route path="/home" element={<Home />} />
            {/* <Route
            path="/selectBrand"
            element={<SelectBrand mc={undefined} handleOnchange={undefined} />}
          /> */}
            {/* <Route
            path="/categorybyMC"
            element={
              <CategorySelectByMC
                handleOnChange={undefined}
                name={undefined}
                value={undefined}
              />
            }
          /> */}
            {/* <Route
            path="/warehouseDW"
            // element={<WareHouseDW handleOnchange={"ho"} />}
          /> */}
            {/* <Route
            path="/customerDW"
            element={<SelectCustomer handleOnchange={"ho"} />}
          /> */}
            {/* <Route path="/search" element={<SearchProduct />} /> */}
            <Route path="/table" element={<DataTable />} />
            <Route path="/progress" element={<ProgressBar />} />
            {/* <Route
            path="/supplier-product"
            element={<SupplierSelectByProduct />}
          /> */}
            {/* <Route
            path="/pos"
            element={
              <RequireAuth>
                <POS />
              </RequireAuth>
            }
          /> */}
            <Route
                path="/pos"
                element={
                    <RequireAuth>
                        <POS />
                    </RequireAuth>
                }
            />
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
                    <RequireAuth>
                        <Cogs />
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
                    <RequireAdminAuth>
                        <Dashboard />
                    </RequireAdminAuth>
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
            {/* <Route path="/users" element={<User />} />
          <Route path="/users/edit/:id" element={<UpdateUser />} /> */}
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
                    <RequireAdminAuth>
                        <UserDetails />
                    </RequireAdminAuth>
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
                    <RequireAdminAuth>
                        <UpdateUser />
                    </RequireAdminAuth>
                }
            />
            <Route
                path="/product"
                element={
                    <RequireAdminAuth>
                        <Products />
                    </RequireAdminAuth>
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
                    <RequireAdminAuth>
                        <Categories />
                    </RequireAdminAuth>
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
                    <RequireAdminAuth>
                        <Brand />
                    </RequireAdminAuth>
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
                    <RequireAdminAuth>
                        <Unit />
                    </RequireAdminAuth>
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
                    <RequireAdminAuth>
                        <Customer />
                    </RequireAdminAuth>
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
            <Route
                path="/exports"
                element={
                    <RequireAdminAuth>
                        <Exports />
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

            {/* <Route path="/purchase-create" element={<PurchaseCreate />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/sale" element={<PrintReceipt />} />
            {/* <Route
            path="/print"
            element={<PrintReceipt invoiceId="62757c6dbc14617b6facc688" />}
          /> */}
            <Route path="/print/:id" element={<PrintReceiptById />} />
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
            {/* <Route path="/keypress" element={<KeyPress />} />
          <Route path="/print-test" element={<PrintTest />} />
          <Route path="/toast" element={<Toast />} />
          <Route path="/csvImporter" element={<CsvImporter />} /> */}
            {/* <Route path="/searchProduct" element={<SearchProduct />} /> */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AdminRoutes;