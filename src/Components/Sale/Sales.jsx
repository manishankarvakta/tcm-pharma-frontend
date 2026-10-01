import { format } from "date-fns";
import { saveAs } from "file-saver";
import * as Icons from "heroicons-react";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useDeleteTempSaleMutation,
  useSaleExportByDateQuery,
} from "../../services/saleApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import AlertService from "../Utility/AlertService";
import "./sales.css";

const Sales = () => {
  const auth = signInUser();
  const { aamarId, storeSettings } = auth;
  const lang = useSelector((state) => state.languageReducer);

  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [warehouse, setWarehouse] = useState("allWh");

  const { data, isLoading, isFetching, isSuccess, refetch } =
    useSaleExportByDateQuery({
      startDate,
      endDate,
      warehouse,
      aamarId,
    });

  const user = signInUser();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportCSV, setExportCSV] = useState([]); // Ensure exportCSV is always an array
  const [whName, setWhName] = useState(" ");

  const [deleteSale] = useDeleteTempSaleMutation();

  useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);

  useEffect(() => {
    if (data) {
      setSales(data); // Update sales only when data is available
      setExportCSV(data || []); // Ensure exportCSV is an array, fallback to empty array
    }
  }, [isSuccess, isLoading, isFetching, data]);

  useEffect(() => {
    refetch();
  }, [startDate, endDate, warehouse]);

  useEffect(() => {
    if (user?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(user?.warehouse);
    }
  }, []);
  const { data: wh } = useWarehouseQuery(auth?.warehouse);

  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);

  const handleOnchangeWareHouse = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
    console.log("handle data:", e);
  };

  const handelDeleteSale = async (id) => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Sale?");
    if (confirmed) {
      const data = {
        _id: id,
        updateUser: user.id,
        status: "delete",
      };
      console.log(deleteSale(data));
    }
  };

  const columns = [
    { accessorKey: "invoiceId", header: "Invoice No" },
    { header: "Date", accessorKey: "date", size: 30 },
    { header: "Biller", accessorKey: "biller", size: 40 },
    { header: "Customer", accessorKey: "customer", size: 40 },
    { header: "Warehouse", accessorKey: "warehouse", size: 40 },
    { header: "Item No", accessorKey: "totalItem", size: 30 },
    { header: "Return Items", accessorKey: "returnItem", size: 30 },
    { header: "Total MRP", accessorKey: "mrpTotal", size: 30 },
    { header: "Return MRP", accessorKey: "returnMrp", size: 30 },
    { header: "Earning Discount", accessorKey: "earningDiscount", size: 30 },
    { header: "Return Total", accessorKey: "returnTotal", size: 30 },
    { header: "Gross Sales", accessorKey: "grossSale", size: 30 },
    { header: "Discount", accessorKey: "discount", size: 30 },
    { header: "Net Sales", accessorKey: "netSale", size: 30 },
    { header: "NetSale Round", accessorKey: "netSaleRound", size: 30 },
    { header: "Point Used", accessorKey: "pointUsed", size: 30 },
    { header: "Total Receivable", accessorKey: "totalReceivable", size: 30 },
    { header: "Total Received", accessorKey: "totalReceived", size: 30 },
    { header: "Change Amount", accessorKey: "changeAmount", size: 30 },
    { header: "Total Tp", accessorKey: "tpTotal", size: 30 },
    { header: "Return TP", accessorKey: "returnTp", size: 30 },
    { header: "Cash", accessorKey: "cash", size: 30 },
    { header: "Card", accessorKey: "card", size: 30 },
    { header: "MFS", accessorKey: "mfs", size: 30 },
    { header: "Status", accessorKey: "status", size: 30 },
  ];

  const headers = [
    { label: "Invoice No", key: "invoiceId" },
    { label: "Date", key: "date" },
    { label: "Biller", key: "biller" },
    { label: "Customer", key: "customer" },
    { label: "Warehouse", key: "warehouse" },
    { label: "Item No", key: "totalItem" },
    { label: "Return Items", key: "returnItem" },
    { label: "Total MRP", key: "mrpTotal" },
    { label: "Return MRP", key: "returnMrp" },
    { label: "Earning Discount", key: "earningDiscount" },
    { label: "Return Total", key: "returnTotal" },
    { label: "Gross Sales", key: "grossSale" },
    { label: "Discount", key: "discount" },
    { label: "Net Sales", key: "netSale" },
    { label: "NetSale Round", key: "netSaleRound" },
    { label: "Point Used", key: "pointUsed" },
    { label: "Total Reciveable", key: "totalReceivable" },
    { label: "Total Recieved", key: "totalReceived" },
    { label: "Change Amount", key: "changeAmount" },
    { label: "Total Tp", key: "tpTotal" },
    { label: "Return TP", key: "returnTp" },
    { label: "Cash", key: "cash" },
    { label: "Card", key: "card" },
    { label: "MFS", key: "mfs" },
    { label: "Status", key: "status" },
  ];
  const preHeader = [
    [`${storeSettings?.storeName || "No-Name"}`],
    [`${storeSettings?.address?.street || "No-Street"}`],
    [
      `${storeSettings?.address?.city || "No-City"}-${storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${auth?.aamarId || "No-Aamar Id"}`],
    [`Sales Details Report`],

    [], // Empty row for spacing
  ];
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
    const csvString = convertArrayOfObjectsToCSV(exportCSV, preHeader);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const today = new Date();
    const fileName = `Sales Report - [${today.toDateString()}].csv`;
    saveAs(blob, fileName); // Assuming `saveAs` is imported from 'file-saver'
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-SALE</title>
      </Helmet>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10">
            <Header title={lang?.allSales} />
            <div className="row">
              <div className="d-md-flex align-items-center justify-content-between mb-3 mt-2">
                <div className="d-md-flex align-items-center justify-content-between mb-md-3 mt-2 gap-2">
                  <div className="d-flex  gap-2">
                    <div className="col-md-auto w-sm-100">
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-auto w-sm-100">
                      <input
                        type="date"
                        className="form-control "
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {user?.type === "admin" && (
                    <div
                      className="mt-2 mt-md-0  mb-md-0 "
                      style={{
                        position: "relative",
                        zIndex: 100,
                        width:
                          window.innerWidth >= 1024
                            ? 280
                            : window.innerWidth >= 768
                              ? 280
                              : "100%", // Adjust width based on screen size
                      }}
                    >
                      <WareHouseDW
                        id="warehouse"
                        name="warehouse"
                        className="col-md-4 ms-2 z-999 position-absolute"
                        handleOnChange={handleOnchangeWareHouse}
                        MenuProps={{
                          container: document.body,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="d-md-flex align-items-center justify-content-between mb-3 mt-2 gap-2">
                  <div className="d-flex gap-2">
                    <div className="col-md-auto w-sm-100 ">
                      <Link
                        to="/articleSaleExport"
                        className="btn btn-dark w-sm-100"
                      >
                        {lang?.articleReport}
                      </Link>
                    </div>
                    <div className="col-md-auto w-sm-100 ">
                      <Link
                        to="/categorySaleExport"
                        className="btn btn-dark w-sm-100"
                      >
                        {lang?.categoryReport}
                      </Link>
                    </div>
                  </div>
                  <div className="col-auto mt-2 mt-md-0 w-sm-100">
                    {exportCSV.length > 0 ? (
                      <Button
                        className="btn btn-dark w-sm-100"
                        onClick={downloadCSV} // Trigger the downloadCSV function
                      >
                        <Icons.DownloadOutline
                          className="icon-trash text-warning"
                          size={22}
                        />{" "}
                        {lang?.downloadReport}
                      </Button>
                    ) : (
                      <button className="btn btn-dark w-sm-100" disabled>
                        {lang?.loadingCSV}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <MaterialReactTable
                  columns={columns}
                  data={sales}
                  state={{
                    isLoading: loading,
                  }}
                  initialState={{
                    density: "compact",
                    pagination: {
                      pageIndex: 0,
                      pageSize: 100,
                    },
                  }}
                  enableStickyHeader
                  enableRowNumbers
                  enableRowActions
                  positionActionsColumn="last"
                  renderRowActions={({ row }) => (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        gap: "0.5rem",
                      }}
                    >
                      <Link to={`/print/${row.original._id}`} target="_blank">
                        <Icons.EyeOutline className="icon-eye" size={22} />
                      </Link>
                      <Icons.TrashOutline
                        onClick={() => handelDeleteSale(row.original._id)}
                        className="icon-trash"
                        size={22}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
