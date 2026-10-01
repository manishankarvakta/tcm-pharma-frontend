import { format } from "date-fns";
import { saveAs } from "file-saver";
import * as Icons from "heroicons-react";

import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Helmet } from "react-helmet";
import { useSaleExportByDateAndSupplierQuery } from "../../services/saleApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import Header from "../Common/Header/Header";
import SupplierWiseSaleReportModal from "../Common/Modal/SupplierWiseSaleReportModal";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";

const SupplierProductSale = () => {
  const auth = signInUser();
  const storeSettings = auth?.storeSettings;
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [sales, setSales] = useState([]);
  const [exportCSV, setExportCSV] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState({});
  const [supplierName, setSupplierName] = useState([]);

  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleExportByDateAndSupplierQuery({
      startDate,
      endDate,
      supplier,
    });

  console.log("sales", sales);

  useEffect(() => {
    refetch();
  }, [startDate, endDate, data]);

  useEffect(() => {
    setSales(data);
    // console.log(data);
  }, [isSuccess, isFetching])

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
          totalQuantity: sale?.totalQuantity,
        },
      ];
    });
    setExportCSV(saleData);
    console.log("dates", saleData);
  }, [sales]);
  const [whName, setWhName] = useState(" ");

  const { data: wh } = useWarehouseQuery(auth?.warehouse);

  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  const preheader = [
    [`${storeSettings?.storeName || "No-Name"}`],
    [`${storeSettings?.address?.street || "No-Street"}`],
    [
      `${storeSettings?.address?.city || "No-City"}-${
        storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${auth?.aamarId || "No-Aamar Id"}`],
    [`Supplier Products Sales Report`],

    [], // Empty row for spacing
  ];
  const headers = [
    { label: "article_code", key: "article_code" },
    { label: "name", key: "name" },
    { label: "tp", key: "tp" },
    { label: "mrp", key: "mrp" },
    { label: "totalQuantity", key: "totalQuantity" },
  ];
  const handleVendorChange = (e) => {
    console.log(e);
    setSupplier(e.option);
    setSupplierName(e.code);
    setSupplierInfo(e);
  };
  const handleSupplierSaleReport = () => {
    setOnShow(true);
  };
  // Convert array of objects to CSV format including preheader
  const convertArrayOfObjectsToCSV = (array, preheader) => {
    if (!array || !array.length) return null;

    const headers = Object.keys(array[0]);
    const csvData = [
      ...preheader.map((row) => row.join(",")), // Add preheader rows
      headers.join(","), // Add header row
      ...array.map((row) =>
        headers
          .map((fieldName) => JSON.stringify(row[fieldName]) || "")
          .join(",")
      ),
    ];

    return csvData.join("\r\n");
  };

  const downloadCSV = () => {
    const csvString = convertArrayOfObjectsToCSV(exportCSV, preheader);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const today = new Date();
    const fileName = `Supplier wise sales Details Export - [${today.toDateString()}].csv`;
    saveAs(blob, fileName); // Assuming `saveAs` is imported from 'file-saver'
  };
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-SALE-EXPORT-SUPPLIER-WISE</title>
      </Helmet>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Export Sales Supplier Wise"></Header>
            <div className="row">
              <div className="col-md-12">
                {/* Sort date range */}
                <div className=" d-md-flex justify-content-between mt-2">
                  <div className="d-flex gap-2">
                    <DatePicker
                      selected={new Date(startDate)}
                      className="form-control "
                      onChange={(date) =>
                        setStartDate(format(new Date(date), "MM-dd-yyyy"))
                      }
                    />

                    <DatePicker
                      selected={new Date(endDate)}
                      className="form-control"
                      onChange={(date) =>
                        setEndDate(format(new Date(date), "MM-dd-yyyy"))
                      }
                    />
                  </div>

                  <div className="d-flex gap-2 mt-2 mt-md-0 justify-content-md-end">
                    <Button
                      className="btn btn-dark "
                      onClick={() => handleSupplierSaleReport()}
                    >
                      <Icons.Printer size={18} className="me-2" />
                      Print Report
                    </Button>
                    <Button
                      className="btn btn-dark"
                      onClick={downloadCSV}
                      disabled={!exportCSV || exportCSV.length === 0}
                    >
                      <Icons.DownloadOutline
                        className="icon-trash text-warning"
                        size={22}
                      />
                      {exportCSV.length === 0
                        ? "Loading CSV..."
                        : "Download CSV"}
                    </Button>
                  </div>
                </div>
                <div className="col-md-6 mt-2 mb-2">
                  {/* <input className="form-control me-2"></input> */}
                  <SelectSupplier
                    supplier_code={setSupplier}
                    handleOnchange={(e) => handleVendorChange(e)}
                  ></SelectSupplier>
                </div>
              </div>
              <div className="col-md-12">
                <Table hover className="mt-4">
                  <thead>
                    <tr>
                      {/* <th scope="col">#</th> */}
                      <th scope="col">article_code</th>
                      <th scope="col">name</th>
                      <th scope="col">tp</th>
                      <th scope="col">mrp</th>
                      <th scope="col">totalQuantity</th>

                      {/* <th scope="col">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(sales)} */}
                    {sales ? (
                      sales?.length > 0 ? (
                        sales.map((sale) => (
                          <tr key={sale._id ?? sale.article_code}>
                            {/* <th >{i++}</th> */}

                            <td>{sale.article_code}</td>
                            <td>{sale.name}</td>
                            <td>{sale.tp}</td>
                            <td>{sale.mrp}</td>
                            <td>{sale?.totalQuantity.toFixed(2) || ""}</td>
                            {/* 
                                                <td>{sale.price}</td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No product found</td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan={8}>Please Select a Supplier...</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SupplierWiseSaleReportModal
        onShow={onShow}
        handleClose={handleClose}
        data={sales}
        supplierInfo={supplierInfo}
        startDate={startDate}
        endDate={endDate}
      ></SupplierWiseSaleReportModal>
    </div>
  );
};

export default SupplierProductSale;
