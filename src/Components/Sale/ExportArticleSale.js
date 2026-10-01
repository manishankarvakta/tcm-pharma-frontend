import { format } from "date-fns";
import * as Icons from "heroicons-react";

import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Helmet } from "react-helmet";
import { useSaleArticelExportByDateQuery } from "../../services/saleApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import "./sales.css";
import { useSelector } from "react-redux";

const ExportArticleSale = () => {
  const user = signInUser();
  const aamarId = user?.aamarId;
  const storeSettings = user?.storeSettings;
        const lang = useSelector((state) => state.languageReducer);
  
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [q, setQ] = useState("");
  const [warehouse, setWarehouse] = useState("allWh");
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleArticelExportByDateQuery({
      startDate,
      endDate,
      q,
      warehouse,
      aamarId,
    });

  // console.log(startDate, endDate, data);
  // console.log(q);
  // const { adjustInventorySaleDel } = useInventory();
  const [articleSale, setArticleSale] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    refetch();
  }, [startDate, endDate, q, warehouse]);

  useEffect(() => {
    if (user?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(user?.warehouse);
    }
  }, []);
  console.log("data", data);

  useEffect(() => {
    let articleSales = [];
    console.log("article", data);

    // (product = [...product, sale.products])
    // console.log(sale?.products);
    let product = [];
    data?.map((sale) => {
      if (sale.products?.length > 0) {
        sale?.products?.map((product) => {
          // console.log(product);
          articleSales = [
            ...articleSales,
            {
              invoice_no: sale?.invoiceId,
              date:
                sale?.createdAt &&
                format(new Date(sale?.createdAt), "MM/dd/yyyy"),
              // Product Loop
              code: product.article_code,
              name: product.name,

              tp: product.tp,
              // priceId: product.priceId,
              mrp: product.mrp,
              vat: product.vat,
              qty: product.qty,
              total: (
                product.qty * product.mrp +
                product.vat * product.qty
              ).toFixed(2),
            },
          ];
        });
      }
      if (sale.returnProducts?.length > 0) {
        sale?.returnProducts?.map((product) => {
          // console.log(product);
          articleSales = [
            ...articleSales,
            {
              invoice_no: sale?.invoiceId,
              date:
                sale?.createdAt &&
                format(new Date(sale?.createdAt), "MM/dd/yyyy"),
              // Product Loop
              code: product.article_code,
              tp: parseFloat(product.tp),
              priceId: product.priceId,
              mrp: product.mrp,
              name: product.name,
              vat: product.vat ? product.vat : 0,
              qty: `-${parseInt(product.qty)}`,
              total: `-${(
                parseFloat(product.qty) * parseFloat(product.tp)
              ).toFixed(2)}`,
            },
          ];
        });
      }
    });
    console.log("product", articleSales);
    setArticleSale(articleSales);
  }, [isSuccess, isFetching, data]);

  const articleHeaders = [
    { label: "Invoice No", key: "invoice_no" },
    { label: "Date", key: "date" },
    { label: "code", key: "code" },
    { label: "name", key: "name" },
    { label: "qty", key: "qty" },
    { label: "Tp", key: "tp" },

    { label: "Mrp", key: "mrp" },
    { label: "Vat", key: "vat" },
    { label: "Total", key: "total" },
  ];

  // let exportData = [];
  // useEffect(() => {
  //   if (articleSale.length > 0) {
  //     // let expD = articleSale;
  //     setExportData(articleSale);
  //   }
  // }, [articleSale,isSuccess]);
  useEffect(() => {
    if (isSuccess) {
      setExportData(articleSale || []);
    }
  }, [isSuccess, articleSale]);
  const filterByArticleCode = (code) => {
    setQ(code);
    refetch();
  };
  // invoice id, article code, name, qty, mrp, tp, vat, total

  // const handleOnBiller = (e) => {
  //   setBillerSelect(e.target.value);
  // };
  const handleOnchangeWareHouse = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
    console.log("handle data:", e);
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
    [`Article Sales Report`],

    [], // Empty row for spacing
  ];
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-Sale-Export</title>
      </Helmet>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.exportSales}></Header>
            <div className="row">
              <div className="col-md-12">
                {/* Sort date range */}
                <div className=" d-md-flex justify-content-between mt-2">
                  <div className="d-md-flex align-items-center justify-content-center gap-2">
                    <div className="d-flex gap-2">
                      <div className="date-picker d-flex mt-2 mb-2 align-items-center">
                        <DatePicker
                          selected={new Date(startDate)}
                          className="form-control me-2"
                          onChange={(date) =>
                            setStartDate(format(new Date(date), "MM-dd-yyyy"))
                          }
                        />
                      </div>

                      <div className="date-picker d-flex mt-2 mb-2 align-items-center">
                        <DatePicker
                          selected={new Date(endDate)}
                          className="form-control"
                          onChange={(date) =>
                            setEndDate(format(new Date(date), "MM-dd-yyyy"))
                          }
                        />
                      </div>
                    </div>

                    <div className="">
                      <input
                        className="form-control"
                        type="text"
                        name="product"
                        placeholder="article code"
                        onChange={(e) => filterByArticleCode(e.target.value)}
                      />
                    </div>
                    {user?.type === "admin" && (
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
                    )}
                  </div>
                  <div className="d-flex me-2">
                    {exportData.length > 0 ? (
                      <CsvDownloader
                        preheader={preHeader}
                        buttonName={
                          <span>
                            <Icons.DownloadOutline
                              className="icon-trash text-warning"
                              size={22}
                            />{" "}
                            {lang?.downloadReport}
                          </span>
                        }
                        data={exportData}
                        fileName={`Export Article sales Report - [${today.toDateString()}].csv`}
                      />
                    ) : (
                      <button className="btn btn-dark" disabled>
                        Loading CSV...
                      </button>
                    )}

                    {/* <CSVLink
                      filename={`Sales Report- ${startDate} to ${endDate}.csv`}
                      className="btn btn-dark float-end my-2 mr-2"
                      data={exportData}
                      asyncOnClick={true}
                      headers={articleHeaders}
                    >
                      {exportData?.length === 0
                        ? "Loading csv..."
                        : "Export Article Sales Report"}
                    </CSVLink> */}
                  </div>
                </div>
              </div>
            </div>

            {/* <Link to="/category-sales" className="btn btn-dark float-end my-2  mx-2">Category Sales </Link> */}
            <div className="table-responsive mt-4">
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col">Invoice ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">MRP</th>
                    <th scope="col">TP</th>
                    <th scope="col">Qty</th>
                    <th scope="col">VAT</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log("exportData", exportData)}
                  {exportData ? (
                    exportData.map((product) => (
                      <tr key={product.code}>
                        <th scope="row">{product.invoice_no}</th>
                        <td>{product.date}</td>
                        <td>{product?.code}</td>
                        <td>{product?.name}</td>
                        <td>{product?.mrp}</td>
                        <td>{product?.tp}</td>
                        <td>{product?.qty}</td>
                        <td>{product?.vat}</td>
                        <td>{product?.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        Loading...
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportArticleSale;
