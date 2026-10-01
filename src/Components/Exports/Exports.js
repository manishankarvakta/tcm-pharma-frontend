import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useBrandsExportQuery } from "../../services/brandApi";
import { useGenericsExportQuery } from "../../services/genericApi";
import { useGroupsExportQuery } from "../../services/groupApi";
import {
  useProductPopularQuery,
  useProductsExportQuery,
} from "../../services/productApi";
import { useSalesQuery } from "../../services/saleApi";
import { useSupplierExportQuery } from "../../services/supplierApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import Header from "../Common/Header/Header";
import BrandDetailsExportModal from "../Common/Modal/BrandDetailsExportModal";
import COGS from "../Common/Modal/COGS";
import GenericDetailsExportModal from "../Common/Modal/GenericDetailsExportModal";
import GroupDetailsExportModal from "../Common/Modal/GroupDetailsExportModal";
import PopularProductExport from "../Common/Modal/PopularProductExport";
import ProductDetailsExportModal from "../Common/Modal/ProductDetailsExportModal";
import SupplierDetailsExportModal from "../Common/Modal/SupplierDetailsExportModal";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";

const Exports = () => {
  const auth = signInUser();
  const { aamarId, storeSettings } = auth;
  const [onShow, setOnShow] = useState(false);
    const lang = useSelector((state) => state.languageReducer);
  
  const [onShowSupplier, setOnShowSupplier] = useState(false);
  const [onShowCategory, setOnShowCategory] = useState(false);
  const [onShowSale, setOnShowSale] = useState(false);
  const [onShowPrice, setOnShowPrice] = useState(false);
  const [onShowPopular, setOnShowPopular] = useState(false);
  const [salesExport, setSalesExport] = useState([]);
  const [testExport, setTestExport] = useState(false);
  const { data: wh, refetch } = useWarehouseQuery(auth?.warehouse);

  const handleClose = () => setOnShow(false);
  const handleCloseSupplier = () => setOnShowSupplier(false);
  const handleCloseCategory = () => setOnShowCategory(false);
  const handleClosePrice = () => setOnShowPrice(false);
  const handleCloseSale = () => setOnShowSale(false);
  const handleClosePopularSale = () => setOnShowPopular(false);
  const handleCloseTest = () => setTestExport(false);

  const [onShowGroup, setOnShowGroup] = useState(false);
  const handleCloseGroup = () => setOnShowGroup(false);

  const [onShowGeneric, setOnShowGeneric] = useState(false);
  const handleCloseGeneric = () => setOnShowGeneric(false);

  const [onShowBrand, setOnShowBrand] = useState(false);
  const handleCloseBrand = () => setOnShowBrand(false);

  const { data, isSuccess } = useProductsExportQuery({ aamarId });
  const { data: supplier, isSuccess: supplierSuccess } = useSupplierExportQuery(
    { aamarId }
  );
  const { data: group, isSuccess: groupSuccess } = useGroupsExportQuery({
    aamarId,
  });
  const { data: generic, isSuccess: genericSuccess } = useGenericsExportQuery({
    aamarId,
  });
  const { data: brand, isSuccess: brandSuccess } = useBrandsExportQuery({
    aamarId,
  });
  // const { data: category, isSuccess: categorySuccess } =
  //   useCategoriesExportQuery();
  // const { data: price, isSuccess: priceSuccess } = usePricesExportQuery();
  const { data: popular, isSuccess: popularSuccess } = useProductPopularQuery({
    aamarId,
  });
  // const { data: test, isSuccess: testSuccess } = useSupplierTestQuery("62e91c15666a53f12aa41591");
  const sales = useSalesQuery({ aamarId });
  console.log("data", data);
  console.log("supplier", supplier);
  console.log("group", group);
  console.log("brand", brand);
  // console.log("category", category)
  // console.log("price", price)
  console.log("popular", popular);

  useEffect(() => {
    let products = [];

    // for (const sale in sales?.data) {
    //   //   if (sale?.products !== null) {
    //   //     sale?.products?.map((product) => {
    //   //       products = [
    //   //         ...products,
    //   //         {
    //   //           article_code: product?.article_code,
    //   //           mrp: product?.mrp,
    //   //           qty: product?.qty,
    //   //           //   date: format(
    //   //           //     sale?.createdAt ? sale.createdAt : new Date(2023, 1, 1),
    //   //           //     "MM/dd/yyyy"
    //   //           //   ),
    //   //         },
    //   //       ];
    //   //     });
    //   //   }
    //   console.log(sale[products]);
    //   console.log("COGS", products);
    // }
    let i = 1;
    sales?.data?.map((sale) => {
      if (sale?.products !== null) {
        sale?.products?.map((product) => {
          if (product.article_code) {
            products = [
              ...products,
              {
                invoiceId: sale?.invoiceId ? sale.invoiceId : __dirname,
                article_code: product?.article_code,
                mrp: product?.mrp,
                qty: product?.qty,
                date: format(new Date(sale?.createdAt), "MM/dd/yyyy"),
              },
            ];
          }
        });
      }
      // console.log(i++);
      // console.log("COGS", products);
      setSalesExport(products);
    });
    console.log("Loop Complete");
  }, [sales.isSuccess]);

  const handleProductExport = () => {
    console.log("hello");
    setOnShow(true);
    console.log(onShow);
  };

  const handleSupplierExport = () => {
    setOnShowSupplier(true);
    console.log("hello1");
  };

  // const handleCategoryExport = () => {
  //   setOnShowCategory(true);
  // };
  const handleGroupExport = () => {
    // setOnShowCategory(true);
    setOnShowGroup(true);
  };
  const handleGenericExport = () => {
    // setOnShowCategory(true);
    setOnShowGeneric(true);
  };
  const handleBrandExport = () => {
    // setOnShowCategory(true);
    setOnShowBrand(true);
  };
  const handlePriceTableExport = () => {
    // console.log(price)
    setOnShowPrice(true);
  };
  const handlePopularProductsExport = () => {
    // console.log(price)
    setOnShowPopular(true);
  };
  const handleProductMatching = () => {
    // console.log(price)
    // setOnShowPopular(true)
    setTestExport(true);
  };
  const handleSaleExport = () => {
    // console.log(price)
    setOnShowSale(true);
  };
  const [whName, setWhName] = useState(" ");

  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  const preHeader = [
    [`${storeSettings?.storeName || "No-Name"}`],
    [`${storeSettings?.address?.street || "No-Street"}`],
    [
      `${storeSettings?.address?.city || "No-City"}-${
        storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${auth?.aamarId || "No-Aamar Id"}`],

    [], // Empty row for spacing
  ];

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.exports}></Header>
            <div className="row mt-3">
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.products}</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleProductExport()}
                    >
                      Export Product Details
                    </Button>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.supplier}</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleSupplierExport()}
                    >
                      Export Supplier Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.group}</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleGroupExport()}
                    >
                      Export Group Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.generic}</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleGenericExport()}
                    >
                      Export Generic Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.brand}</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleBrandExport()}
                    >
                      Export Brand Details
                    </Button>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-4">
                <div>
                  <h4>Category</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleCategoryExport()}
                    >
                      Export Category Details
                    </Button>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-md-4">
                <div>
                  <h4>Price Table</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handlePriceTableExport()}
                    >
                      Export Price Details
                    </Button>
                  </div>
                </div>
              </div> */}
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.popularProducts}</h4>
                  <div>
                    {/* <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handlePopularProductsExport()}
                    >
                      Export Popular Products
                    </Button> */}
                    <Link
                      to="/popular"
                      className="btn btn-dark mb-2 float-start me-2"
                    >
                      Export Popular Report
                    </Link>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-4">
                <div>
                  <h4>Category Sales Report</h4>
                  <Link
                    to="/categorySaleExport"
                    className="btn btn-dark mb-2 float-start me-2"
                  // onClick={() => setShow(true)}
                  >
                    Export Category Sales Report
                  </Link>
                </div>
              </div> */}
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.supplierSalesReport}</h4>
                  <Link
                    to="/supplierSaleExport"
                    className="btn btn-dark mb-2 float-start me-2"
                  >
                    Export Supplier Sales Report
                  </Link>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.allCategorySalesReport}</h4>
                  <Link
                    to="/allCategorySales"
                    className="btn btn-dark mb-2 float-start me-2"
                    // onClick={() => setShow(true)}
                  >
                    All Category Sales Report
                  </Link>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div>
                  <h4>{lang?.sampleImportFiles}</h4>
                  <a
                    target="_blank"
                    href="https://drive.google.com/drive/folders/1-l43dT25zMnhiLWO2ku_fg_7FVXlO_lO?usp=drive_link"
                    className="btn btn-dark mb-2 float-start me-2"
                    rel="noreferrer"
                    // onClick={() => setShow(true)}
                  >
                    Sample Import Files
                  </a>
                </div>
              </div>
              {/* <div className="col-md-4">
                <div>
                  <h4>Product Matching</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleProductMatching()}
                    >
                      Export Popular Products
                    </Button>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-md-4">
                <div>
                  <h4>COGS</h4>
                  <div>
                    <Button
                      className="btn btn-dark mb-2 float-start me-2"
                      onClick={() => handleSaleExport()}
                    >
                      Export Lifetime Sales
                    </Button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <ProductDetailsExportModal
        preheader={preHeader}
        onShow={onShow}
        handleClose={handleClose}
        exportProduct={data}
      ></ProductDetailsExportModal>

      <SupplierDetailsExportModal
        preheader={preHeader}
        onShow={onShowSupplier}
        handleClose={handleCloseSupplier}
        exportSupplier={supplier}
      ></SupplierDetailsExportModal>

      <GroupDetailsExportModal
        preheader={preHeader}
        onShow={onShowGroup}
        handleClose={handleCloseGroup}
        exportGroup={group}
      ></GroupDetailsExportModal>

      <GenericDetailsExportModal
        preheader={preHeader}
        onShow={onShowGeneric}
        handleClose={handleCloseGeneric}
        exportGeneric={generic}
      ></GenericDetailsExportModal>

      <BrandDetailsExportModal
        preheader={preHeader}
        onShow={onShowBrand}
        handleClose={handleCloseBrand}
        exportBrand={brand}
      ></BrandDetailsExportModal>

      <COGS
        exportProduct={salesExport}
        handleClose={handleCloseSale}
        onShow={onShowSale}
      />

      {/* <CategoryExportModal
        onShow={onShowCategory}
        handleClose={handleCloseCategory}
        exportCategory={category}
      ></CategoryExportModal> */}
      {/* <PriceExportModal
        onShow={onShowPrice}
        handleClose={handleClosePrice}
        exportPrice={price}
      ></PriceExportModal> */}
      <PopularProductExport
        preheader={preHeader}
        onShow={onShowPopular}
        handleClose={handleClosePopularSale}
        exportPopular={popular}
      ></PopularProductExport>
      {/* <SupllierMatchedProduct
        onShow={testExport}
        handleClose={handleCloseTest}
        exportPopular={test}
      >
      </SupllierMatchedProduct> */}
    </div>
  );
};

export default Exports;
