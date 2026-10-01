import { format } from "date-fns";
import { saveAs } from "file-saver";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Helmet } from "react-helmet";

import { useSaleExportByDatePopularQuery } from "../../services/saleApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import Header from "../Common/Header/Header";
import PopularProductsSaleReportModal from "../Common/Modal/PopularProductsSaleReportModal";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";

const PopularProductDateWise = () => {
  const auth = signInUser();
  const storeSettings = auth?.storeSettings;
  const { data: wh } = useWarehouseQuery(auth?.warehouse);

  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [exportCSV, setExportCSV] = useState([]);
  const [sales, setSales] = useState([]);

  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);

  const headers = [
    { label: "article_code", key: "article_code" },
    { label: "name", key: "name" },
    { label: "tp", key: "tp" },
    { label: "mrp", key: "mrp" },
    { label: "totalSold", key: "totalSoldQuantity" },
  ];
  const [whName, setWhName] = useState(" ");

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleExportByDatePopularQuery({
      startDate,
      endDate,
    });
  console.log(data);

  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  useEffect(() => {
    setSales(data);
    console.log(data);
  }, [isSuccess, isFetching]);

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
          totalSoldQuantity: sale.totalSoldQuantity,
        },
      ];
    });
    setExportCSV(saleData);
    console.log("dates", saleData);
  }, [sales]);

  const handlePopularProductSoldReport = () => {
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
    const fileName = `Popular products Details Export - [${today.toDateString()}].csv`;
    saveAs(blob, fileName); // Assuming `saveAs` is imported from 'file-saver'
  };
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
    [`Popular Products Sales Report`],

    [], // Empty row for spacing
  ];
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-SALE-EXPORT-POPULAR-PRODUCTS</title>
      </Helmet>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Export Sales Popular Products"></Header>
            <div className="row">
              <div className="col-md-12">
                {/* Sort date range */}
                <div className=" d-md-flex justify-content-between mt-2">
                  {/* Date Range Pickers */}
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

                  {/* Buttons */}
                  <div className="d-flex gap-2 mt-2 mt-md-0 justify-content-md-end">
                    <Button
                      className="btn btn-dark"
                      onClick={handlePopularProductSoldReport}
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
                        : "Download Report"}
                    </Button>
                  </div>
                </div>

                <div className="col-md-6 mt-2 mb-2"></div>
              </div>
              <div className="col-md-12">
                <div className="table-responsive">
                  <Table hover className="mt-4">
                    <thead>
                      <tr>
                        {/* <th scope="col">#</th> */}
                        <th scope="col">article_code</th>
                        <th scope="col">name</th>
                        <th scope="col">tp</th>
                        <th scope="col">mrp</th>
                        <th scope="col">totalSold</th>
                        {/* <th scope="col">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {/* {console.log(sales)} */}
                      {sales ? (
                        sales?.length > 0 ? (
                          sales.map((sale) => (
                            <tr key={sale._id}>
                              {/* <th >{i++}</th> */}

                              <td>{sale.article_code}</td>
                              <td>{sale.name}</td>
                              <td>{sale.tp}</td>
                              <td>{sale.mrp}</td>
                              <td>{sale.totalSoldQuantity.toFixed(2)}</td>
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
                          <td colSpan={4}>Please Select a Supplier...</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopularProductsSaleReportModal
        onShow={onShow}
        handleClose={handleClose}
        data={data}
        startDate={startDate}
        endDate={endDate}
      ></PopularProductsSaleReportModal>
    </div>
  );
};

export default PopularProductDateWise;
