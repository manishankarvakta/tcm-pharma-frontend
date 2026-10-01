/* eslint-disable react-hooks/exhaustive-deps */
import * as Icons from "heroicons-react";
import { useState } from "react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
// import CsvImporter from "../Common/CsvImporter/CsvImporter";
import { format } from "date-fns";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  // usePurchasesQuery,
  // useDeletePurchaseMutation,
  usePurchaseByDateQuery,
  useUpdatePurchaseStatusMutation,
} from "../../services/purchasApi";

import PurchaseView from "../Common/Modal/PurchaseView";
import { notify } from "../Utility/Notify";
// import LoadingModal from "../Common/Modal/LoadingModal";
// import { Spinner } from "react-bootstrap";
// import DatePicker from "react-datepicker";
import { MaterialReactTable } from "material-react-table";
import { useWarehouseQuery } from "../../services/warehouseApi";
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";
import AlertService from "../Utility/AlertService";

const Purchase = () => {
  const navigate = useNavigate();
  const timeElapsed = Date.now();
  const lang = useSelector((state) => state.languageReducer);

  const today = new Date(timeElapsed);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [warehouse, setWarehouse] = useState("allWh");
  const [exportCSV, setExportCSV] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loader, setLoader] = useState(true);
  const handleLoaderClose = () => setLoader(false);
  const [loading, setLoading] = useState(true);
  let i = 1;
  const [purchase, setPurchase] = useState([]);
  const [purchaseView, setPurchaseView] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const user = signInUser();
  const aamarId = user?.aamarId;
  const storeSettings = user?.storeSettings;
  // const [deletePurchase] = useDeletePurchaseMutation();
  const [deletePurchaseStatus] = useUpdatePurchaseStatusMutation();
  // const purchases = usePurchasesQuery();
  const { data, isSuccess, isFetching, isLoading, refetch } = usePurchaseByDateQuery({
    startDate,
    endDate,
    warehouse,
    aamarId,
  });
  useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);
  useEffect(() => {
    if (data) {
      setPurchase(data || []); // Update sales only when data is available
      setExportCSV(data || []); // Ensure exportCSV is an array, fallback to empty array
    }
  }, [isSuccess, isFetching, isLoading, data]);
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

  // useEffect(() => {
  //   if (data?.length > 0) {
  //     setPurchase(data);
  //
  //   }
  // }, [isSuccess, data]);

  useEffect(() => {
    let total = 0;
    data?.map((purchase) => {
      total =
        total +
        parseFloat(purchase?.total) -
        (purchase?.discount ? parseFloat(purchase?.discount) : 0) +
        (purchase?.shipping_cost ? parseFloat(purchase?.shipping_cost) : 0);
    });
    if (data?.length > 0) {
      setLoading(false);
      setTotalPurchase(total);
      setPurchase(data || []);
      setExportCSV(data || []);
    }
  }, [data, isSuccess, isFetching, isLoading]);

  useEffect(() => {
    isSuccess && isFetching && isLoading ? setLoader(false) : setLoader(true);
  }, [data, isSuccess, isFetching, isLoading]);

  const deleteHandler = async (id) => {
    try {
      const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Purchase?");
      if (confirmed) {
        setLoader(true);
        const res = await deletePurchaseStatus({
          poNo: id,
          status: "Canceled",
        });
        // const res = await deletePurchase(id);
        if (res) {
          // TODO::
          notify("Purchase Deleted Successful!", "success");
          // add error hendaler for delete error
          console.log(res);
          refetch();
        } else {
          console.log("Delete Operation Canceled by Purchase!");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handlePurchaseView = (id) => {
    // send purchese id to purchese view modal
    setPurchaseView(id);
    setShow(true);
  };
  const handlePurchaseUpdate = (purchase) => {
    //  console.log("clicked")
    if (purchase?.status === "Pending") {
      console.log("purchase-id", purchase?._id);
      navigate(`/purchase-update/${purchase._id}`);
    } else {
      notify("This Purchase Can not be Modified", "error");
    }
  };

  // console.log(purchase);

  const columns = [
    { accessorKey: "poNo", header: "Invoice ID" },
    { accessorKey: "date", header: "Date", size: 120 },
    { accessorKey: "user", header: "User", size: 30 },
    { accessorKey: "supplier", header: "Vendor", size: 30 },
    { accessorKey: "warehouse", header: "Warehouse", size: 60 },
    { accessorKey: "totalItem", header: "Items", size: 60 },
    { accessorKey: "total", header: "Total", size: 30 },
    { accessorKey: "discount", header: "Discount", size: 30 },
    { accessorKey: "grossTotal", header: "Gross Total", size: 30 },
    { accessorKey: "status", header: "Status", size: 30 },
  ];
  // const headers = [
  //   { label: "Invoice ID", key: "poNo" },
  //   { label: "Date", key: "date" },
  //   { label: "User", key: "user" },
  //   { label: "Vendor", key: "supplier" },
  //   { label: "Warehouse", key: "warehouse" },
  //   { label: "Items", key: "totalItem" },
  //   { label: "Total", key: "total" },
  //   { label: "Discount", key: "discount" },
  //   { label: "Gross Total", key: "grossTotal" },
  //   { label: "Status", key: "status" },
  // ];

  const materialReactTableContainer = {
    overflow: "visible",
    position: "relative", // If needed
  };

  // handle warehouse

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
      `${storeSettings?.address?.city || "No-City"}-${storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${user?.aamarId || "No-Aamar Id"}`],
    [`Purchase Report`],

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
            <Header title={lang?.purchase}></Header>
            <div className="row">
              {/* <div className="col-md-6"></div> */}

              <div>
                <div className=" d-md-flex align-items-center justify-content-between mb-3 mt-3">
                  {/* <b>Start:</b> */}
                  <div className="date-picker d-md-flex gap-2 mt-2 mb-2 align-items-center">
                    {/* <b>Start:</b> */}
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
                        className="mt-2 mt-md-0 mb-2 mb-md-0 "
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

                  <div className="d-flex justify-content-between gap-2 align-item-center">
                    <div className="">
                      <div className="btn-group d-grid gap-1" role="group">
                        <Link
                          to="/purchase-createSearch"
                          className="btn btn-dark btn-md btn-block float-end "
                        >
                          {lang?.createNewPurchase}
                        </Link>
                      </div>
                    </div>
                    <div className="col-auto">
                      {exportCSV.length > 0 ? (
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
                          data={exportCSV}
                          fileName={`Export Purchase Report - [${today.toDateString()}].csv`}
                        />
                      ) : (
                        <button className="btn btn-dark" disabled>
                          {lang?.loadingCSV}
                        </button>
                      )}

                      {/* <CSVLink
                        className="btn btn-dark"
                        data={exportCSV || ""}
                        asyncOnClick={true}
                        headers={headers}
                        filename={`Pharmacy Sales from [${startDate} to ${endDate}].csv`}
                      >
                        {exportCSV?.length === 0
                          ? `LoadingCsv...`
                          : "Export Purchase"}
                      </CSVLink> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 ">
                <div>
                  <MaterialReactTable
                    className={materialReactTableContainer}
                    columns={columns}
                    data={purchase}
                    state={{
                      isLoading: loading,
                    }}
                    // enableGrouping //Aggration
                    initialState={{
                      density: "compact",
                      pagination: {
                        pageIndex: 0,
                        pageSize: 100, // Rows per page
                      },
                    }}
                    enableStickyHeader //Enable Sticky Header
                    enableRowNumbers //Enable Row Numbers
                    enableRowActions //Enable Row Actions
                    positionActionsColumn="last" // Add action Column to the end
                    renderRowActions={({ row }) => (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          gap: "0.5rem",
                        }}
                      >
                        {/* {row?.original?.status === "Pending" && (
                          <Link to={`/create-grn/${purchase._id}`}>
                            <Icons.ArchiveOutline
                              className="icon-edit"
                              size={20}
                            ></Icons.ArchiveOutline>
                          </Link>
                        )} */}
                        {row?.original?.status === "Pending" && (
                          <Icons.PencilAltOutline
                            onClick={() => handlePurchaseUpdate(row?.original)}
                            className="icon-eye me-1"
                            size={20}
                          ></Icons.PencilAltOutline>
                        )}

                        <Icons.EyeOutline
                          onClick={() => handlePurchaseView(row?.original?._id)}
                          className="icon-eye me-1"
                          size={20}
                        ></Icons.EyeOutline>
                        {row?.original?.status === "Pending" && (
                          <Icons.TrashOutline
                            className="icon-trash"
                            onClick={() => deleteHandler(row?.original?._id)}
                            size={20}
                          ></Icons.TrashOutline>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <Toaster position="bottom-right" />
          </div>
        </div>
      </div>
      <PurchaseView
        show={show}
        handleClose={handleClose}
        purchase={purchaseView}
      ></PurchaseView>
    </div>
  );
};

export default Purchase;
