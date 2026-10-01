import Header from "../Common/Header/Header";
import { useSelector } from "react-redux";
import ReportSideBar from "../Common/SideBar/ReportSideBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Import all report components
import CustomerWiseSalesReport from "./SalesReports/CustomerWiseSalesReport";
import DateWiseSalesReturnReport from "./SalesReports/DateWiseSalesReturnReport";
import BillerWiseSales from "./SalesReports/BillerWiseSales";
import ProductWisePurchase from "./ProductReports/ProductWisePurchase";
import SupplierWiseSales from "./SalesReports/supplierWiseSales";
import ProductWiseSales from "./ProductReports/ProductWiseSales";
import OutOfStockProducts from "./ProductReports/OutOfStockProducts";
import ProfitLossReport from "./profitLossReports/ProfitLossReport";


const Reports = () => {
  const { reportKey } = useParams();
  const lang = useSelector((state) => state.languageReducer);
  const [active, setActive] = useState(reportKey || "customerWiseSalesReport");

  useEffect(() => {
    setActive(reportKey || "customerWiseSalesReport");
  }, [reportKey]);

  const renderComponent = () => {
    switch (active) {
      // Sales Reports
      case "customerWiseSalesReport":
        return <CustomerWiseSalesReport />;
      case "billerWiseSales":
        return <BillerWiseSales />
      case "supplierWiseSales":
        return <SupplierWiseSales />

        // product reports
      case "productWisePurchase":
        return <ProductWisePurchase />
      case "productWiseSales":
        return <ProductWiseSales />
      case "outOfStockProducts":
        return <OutOfStockProducts />
      case "productWiseStock":
        return <OutOfStockProducts />
        
        case "profitLossReport":
          return <ProfitLossReport />
      default:
        return <CustomerWiseSalesReport />;
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* <div className="col-md-2">
            <SideBar></SideBar>
          </div> */}
          <div className="col-md-2">
            <ReportSideBar active={active} />
          </div>
          <div className="col-md-10">
            <Header title={lang?.allReports}></Header>

            {/* Components */}
            <div
              className="col-md-10 d-flex flex-column justify-content-center align-items-center text-center"
              style={{ height: "80vh" }}
            >
              <div>{renderComponent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
