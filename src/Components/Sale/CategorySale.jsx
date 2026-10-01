import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";

import { Helmet } from "react-helmet";
import { useSaleExportByDateAndCatQuery } from "../../services/saleApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import CategorySelectByMC from "../Common/CustomSelect/categorySelectByMC";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";

const CategorySale = () => {
  const user = signInUser();
  const aamarId = user?.aamarId;
        const lang = useSelector((state) => state.languageReducer);
  
  const storeSettings = user?.storeSettings;
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [sales, setSales] = useState([]);
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const [exportCSV, setExportCSV] = useState([]);
  const [scValue, setScValue] = useState("");
  const [cat, setCat] = useState("All");
  const [catName, setCatName] = useState("");
  const [warehouse, setWarehouse] = useState("allWh");

  // Custom hook for fetching sales data based on date range and category
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleExportByDateAndCatQuery({
      startDate,
      endDate,
      cat,
      warehouse,
      aamarId,
    });

  // Refetch data when startDate, endDate, or category changes
  useEffect(() => {
    refetch();
  }, [startDate, endDate, cat, warehouse]);
  console.log("data", data);

  // Set sales data once successfully fetched
  useEffect(() => {
    if (isSuccess) {
      setSales(data || []);
    }
  }, [isSuccess, data]);

  // Format sales data for CSV export
  useEffect(() => {
    let saleData = [];
    sales?.map((sale) => {
      saleData = [
        ...saleData,
        {
          article_code: sale.article_code,
          name: sale.name,
          tp: sale.tp,
          mrp: sale.mrp,
          totalQuantity: sale.totalQuantity,
          total: sale.total,
        },
      ];
    });
    setExportCSV(saleData);
    console.log("salesData", saleData);
  }, [sales]);
  // useEffect(() => {
  //   refetch();
  // }, [startDate, endDate, warehouse]);
  useEffect(() => {
    if (user?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(user?.warehouse);
    }
  }, []);

  // CSV headers configuration
  const headers = [
    { label: "article_code", key: "article_code" },
    { label: "name", key: "name" },
    { label: "tp", key: "tp" },
    { label: "mrp", key: "mrp" },
    { label: "totalQuantity", key: "totalQuantity" },
    { label: "total", key: "total" },
  ];

  // Handle category selection
  const handleOnchangeCategory = (e) => {
    setScValue(e.option);
    setCat(e.option);
    console.log(e.option);
    setCatName(e.label);
  };

  // Calculate totals (TP, MRP, Total, Total Quantity)
  const totalTP = sales
    ?.reduce((sum, sale) => sum + (parseFloat(sale.tp) || 0), 0)
    .toFixed(2);
  const totalMRP = sales
    ?.reduce((sum, sale) => sum + (parseFloat(sale.mrp) || 0), 0)
    .toFixed(2);
  const totalQuantity = sales?.reduce(
    (sum, sale) => sum + (parseInt(sale.totalQuantity) || 0),
    0
  );
  const total = sales
    ?.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0)
    .toFixed(2);
  const handleOnchangeWareHouse = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
    // console.log("handle data:", e);
  };
  const [whName, setWhName] = useState(" ");

  const { data: wh } = useWarehouseQuery(user?.warehouse);

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
    [`Aamar Id-${user?.aamarId || "No-Aamar Id"}`],
    [`Category Sales Report`],

    [], // Empty row for spacing
  ];

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-SALE-EXPORT-CATEGORY-WISE</title>
      </Helmet>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10">
            <Header title={lang?.exportSalesCategoryWise} />
            <div className="row py-4">
              <div className="d-md-flex justify-content-between align-items-center">
                {/* Left-side date range and category filter */}
                <div className="d-md-flex align-items-center gap-2">
                  {/* Start Date */}
                  <div className="d-flex gap-2">
                    <div className="d-flex align-items-center">
                      {/* <label className="me-2">Start Date:</label> */}
                      <DatePicker
                        selected={new Date(startDate)}
                        className="form-control"
                        onChange={(date) =>
                          setStartDate(format(new Date(date), "MM-dd-yyyy"))
                        }
                      />
                    </div>

                    {/* End Date */}
                    <div className="d-flex align-items-center">
                      {/* <label className="me-2">End Date:</label> */}
                      <DatePicker
                        selected={new Date(endDate)}
                        className="form-control"
                        onChange={(date) =>
                          setEndDate(format(new Date(date), "MM-dd-yyyy"))
                        }
                      />
                    </div>
                  </div>

                  {/* Category filter */}
                  <div
                    className="mt-2 mt-md-0"
                    style={{
                      width:
                        window.innerWidth >= 1024
                          ? 200
                          : window.innerWidth >= 768
                          ? 200
                          : "100%", // Adjust width based on screen size
                    }}
                  >
                    <CategorySelectByMC
                      scValue={scValue}
                      handleOnChangeCategory={handleOnchangeCategory}
                    />
                  </div>
                  <div
                    className="mt-2 mt-md-0 mb-2 mb-md-0 "
                    style={{
                      width:
                        window.innerWidth >= 1024
                          ? 280
                          : window.innerWidth >= 768
                          ? 280
                          : "100%", // Adjust width based on screen size
                    }}
                  >
                    {/* <b>Warehouse:</b> */}

                    <WareHouseDW
                      id="warehouse"
                      name="warehouse"
                      className="col-md-4 ms-2 z-999 position-absolute"
                      handleOnChange={handleOnchangeWareHouse}
                      MenuProps={{
                        container: document.body,
                        PaperProps: {},
                      }}
                    />
                  </div>
                </div>

                {/* Right-side export button */}
                <div className="me-2">
                  {exportCSV.length > 0 ? (
                    <CsvDownloader
                      preheader={preHeader}
                      buttonName={
                        <span>
                          <Icons.DownloadOutline
                            className="icon-trash text-warning"
                            size={22}
                          />
                          {lang?.downloadReport}
                        </span>
                      }
                      data={exportCSV}
                      fileName={`Export Category sales Report - [${today.toDateString()}].csv`}
                    />
                  ) : (
                    <button className="btn btn-dark" disabled>
                      {lang?.LoadingCSV}
                    </button>
                  )}

                  {/* <CSVLink
                    className="btn btn-dark"
                    data={exportCSV}
                    asyncOnClick={true}
                    headers={headers}
                    filename={`categoryWiseSale-${startDate}to${endDate}-${catName}`}
                  >
                    {exportCSV.length === 0
                      ? "Loading CSV..."
                      : "Export Sales Report"}
                  </CSVLink> */}
                </div>
              </div>
            </div>

            {/* Sales Table */}
            <div className="row">
              <div className="col-md-12">
                <Table hover className="mt-2">
                  <thead>
                    <tr>
                      <th>Article Code</th>
                      <th>Name</th>
                      <th>TP</th>
                      <th>MRP</th>
                      <th>Total Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales ? (
                      sales.length > 0 ? (
                        sales.map((sale) => (
                          <tr key={sale._id}>
                            <td>{sale.article_code}</td>
                            <td>{sale.name}</td>
                            <td>{sale.tp}</td>
                            <td>{sale.mrp}</td>
                            <td>{sale.totalQuantity}</td>
                            <td>{sale.total?.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center pe-20"
                            style={{ height: "50vh" }}
                          >
                            No products found
                          </td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan={6}>Please Select a Category...</td>
                      </tr>
                    )}
                  </tbody>
                  {/* Totals Row */}
                  <tfoot>
                    <tr className="bg-dark text-light">
                      <td></td>
                      <td className="py-3">
                        <strong>Total</strong>
                      </td>
                      <td className="py-3">
                        <strong>{totalTP}</strong>
                      </td>
                      <td className="py-3">
                        <strong>{totalMRP}</strong>
                      </td>
                      <td className="py-3">
                        <strong>{totalQuantity}</strong>
                      </td>
                      <td className="py-3">
                        <strong>{total}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySale;
