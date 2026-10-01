/* eslint-disable react-hooks/exhaustive-deps */
import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  // useRtvPagenationQuery,
  useDeleteRtvMutation,
  useRtvByDateQuery,
  // useRtvesQuery,
  useRtvCountQuery,
} from "../../services/rtvApi";
import Header from "../Common/Header/Header";
import RtvView from "../Common/Modal/RtvView";
import SideBar from "../Common/SideBar/SideBar";
import { notify } from "../Utility/Notify";
// import ReactPaginate from "react-paginate";
// import useInventory from "../Hooks/useInventory";
import axios from "../../services/apiClient";
import DatePicker from "react-datepicker";
import { useWarehouseQuery } from "../../services/warehouseApi";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { signInUser } from "../Utility/Auth";
import AlertService from "../Utility/AlertService";
import { useSelector } from "react-redux";

const Rtv = () => {
  const user = signInUser();
  const lang = useSelector((state) => state.languageReducer);

  const { aamarId } = user;
  const [exportCSV, setExportCSV] = useState([]);
  const [deleteRtv] = useDeleteRtvMutation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let i = 1;
  const [rtv, setRtv] = useState([]);
  const [grnView, setGrnView] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const [totalRtv, setTotalRtv] = useState(0);

  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [warehouse, setWarehouse] = useState("allWh");
  const { data, isSuccess, isLoading, isFetching, refetch } = useRtvByDateQuery({
    startDate,
    endDate,
    warehouse,
    aamarId,
  });
  // const { data, isSuccess, isFetching, refetch } = useRtvPagenationQuery({
  //   page,
  //   size,
  //   q,
  // });
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // const { updateInventoryInOnRTVDel } = useInventory();
  useEffect(() => {
    if (data) {
      setRtv(data);
    }
  }, [data, isSuccess, isFetching]);
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

  console.log("RVT DATA", rtv);
  useEffect(() => {
    let total = 0;

    data?.map((rtv) => {
      total += rtv?.total || 0;
    });

    setTotalRtv(total);
    setExportCSV(data || []);
  }, [data, isSuccess]);
  // console.log(data);
  // console.log("exportCSV", exportCSV);
  // console.log("rtv total", totalRtv);



  const handelDeleteGrn = async (id) => {
    try {
      let newIn = [];
      /// axios diye data from data get
      const result = await axios.get(`${BASE_URL}/rtv/${id}`);
      // console.log(result.data.products)
      if (result?.data?.products?.length > 0) {
        result?.data?.products?.map((pro) => {
          newIn = [
            ...newIn,
            {
              article_code: pro?.article_code,
              qty: pro?.qty,
              // priceId: pro?.priceId,
              name: pro?.name,
            },
          ];
        });
      }
      const confirmed = await AlertService.confirm("Are you Sure?", "Delete this RTV?");

      if (confirmed) {
        const res = await deleteRtv(id);
        if (res) {
          // TODO::
          // // UPDATE INVENTORY
          // const inventory = await updateInventoryInOnRTVDel(newIn);
          // console.log(inventory)

          notify("RTV Deleted Successful!", "error");
          // add error hendaler for delete error
          console.log(res);
        } else {
          console.log("Delete Operation Canceled!");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      }
  };

  const handleGrnView = (id) => {
    // console.log(id);
    setGrnView(id);
    setShow(true);
  };

  // search and Pagenation funcation
  const pageCountQuery = useRtvCountQuery({ aamarId });
  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
  }, [pageCountQuery]);

  const handleDataLimit = (e) => {
    setSize(parseInt(e.target.value));
    setPageNo(getPageNumber);
    refetch();
  };

  // console.log(pageCount, size);
  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  };

  const handleSearch = (e) => {
    setQ(e.target.value);
    refetch();
  };
  const headers = [
    { label: "Rtv No", key: "rtvNo" },
    { label: "Supplier", key: "supplier.company" },
    { label: "Warehouse", key: "warehouse" },
    { label: "Date", key: "date" },
    { label: "Rtv By", key: "user" },
    { label: "Item No", key: "totalItem" },
    { label: "Total", key: "total" },
  ];

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
  // Define your dynamic preheader rows with store information
  const preHeader = [
    [`${user?.storeSettings?.storeName || "No-Name"}`],
    [`${user?.storeSettings?.address?.street || "No-Street"}`],
    [
      `${user?.storeSettings?.address?.city || "No-City"}-${user?.storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${user?.aamarId || "No-Aamar Id"}`],
    [`RTV Report`],

    [], // Empty row for spacing
  ];

  // Define the header for the RTV data
  const header = [
    { label: "Rtv No", key: "rtvNo" },
    { label: "Supplier", key: "supplier" },
    { label: "Warehouse", key: "warehouse" },
    { label: "Date", key: "date" },
    { label: "Rtv By", key: "user" },
    { label: "Item No", key: "totalItem" },
    { label: "Total", key: "total" },
  ];

  // Ensure rtv is an array and map the necessary data
  const transformedRtvData = Array.isArray(rtv)
    ? rtv.map((row) => ({
      rtvNo: row?.rtvNo,
      supplier: row?.supplier?.company || row?.supplier || "",
      warehouse: row?.warehouse,
      date: row?.date,
      user: row?.user,
      totalItem: row?.totalItem,
      total: row?.total,
    }))
    : []; // Return an empty array if rtv is not an array

  // Create the final data array
  const csvData =
    transformedRtvData.length > 0
      ? [
        ...preHeader, // Include preHeader rows first
        header.map((col) => col.label), // Column headers
        ...transformedRtvData.map((row) => Object.values(row)), // Data rows
      ]
      : [];

  return (
    <>
      <div>
        <div className="container-fluid ">


          <div className="row">
            <div className="col-md-2">
              <SideBar></SideBar>
            </div>
            <div className="col-md-10">
              <Header title={lang?.returnToVendor}></Header>
              <div className="d-md-flex align-items-center justify-content-between ">
                {/* Sort date range */}
                <div className="d-md-flex align-items-center gap-2 ">
                  <div className="date-picker d-flex gap-2 mt-2 mb-2 align-items-center">
                    {/* <b>Start:</b> */}
                    <DatePicker
                      selected={new Date(startDate)}
                      className="form-control me-2"
                      onChange={(date) =>
                        setStartDate(format(new Date(date), "MM-dd-yyyy"))
                      }
                    />
                    <span width="10px"></span>
                    {/* <b>End:</b> */}
                    <DatePicker
                      selected={new Date(endDate)}
                      className="form-control"
                      onChange={(date) =>
                        setEndDate(format(new Date(date), "MM-dd-yyyy"))
                      }
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

                <div className="d-flex  align-items-center">
                  <div className="">
                    <Link
                      to="/rtv-create"
                      className="btn btn-dark float-end m-3"
                    >
                      {lang?.createNewRTV}
                    </Link>
                  </div>

                  <div className="col-auto">
                    {csvData.length > 0 ? (
                      <CSVLink
                        className="btn btn-dark " // Add size-specific classes like 'btn-lg' or custom CSS
                        data={csvData}
                        asyncOnClick={true}
                        filename={`RTV_Report_${startDate}_to_${endDate}.csv`}
                      // style={{
                      //   // padding: "10px 20px", // Add sufficient padding
                      //   fontSize: "16px", // Adjust font size
                      //   display: "inline-block", // Ensure proper inline-block display
                      // }}
                      >
                        <Icons.DownloadOutline
                          className="icon-trash text-warning"
                          size={22}
                        />{" "}
                        {lang?.downloadReport}
                      </CSVLink>
                    ) : (
                      <button className="btn btn-dark " disabled>
                        {lang?.loadingCSV}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                {/* <div className="col-md-12"></div> */}
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th className="text-nowrap">Rtv NO</th>
                          <th>Supplier</th>
                          <th>Warehouse</th>
                          <th>Date</th>
                          <th className="text-nowrap">Rtv By</th>
                          <th className="text-nowrap">Item No</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading || isFetching ? (
                          Array(10)
                            .fill(0)
                            .map((_, index) => (
                              <tr key={index}>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton width={40} height={20} />
                                </td>
                              </tr>
                            ))
                        ) : rtv?.length > 0 ? (
                          rtv?.map((item, index) => (
                            <tr key={item._id}>
                              <th>{index + 1}</th>
                              <td>{item?.rtvNo}</td>
                              <td>{item?.supplier?.company || item?.supplier}</td>
                              <td>{item?.warehouse}</td>
                              <td>{item?.date}</td>
                              <td>{item?.user}</td>
                              <td>{item?.totalItem != null ? Number(item.totalItem).toFixed(2) : "0.00"}</td>
                              <td>{item?.total != null ? Number(item.total).toFixed(2) : "0.00"}</td>
                              <td>
                                <Icons.EyeOutline
                                  onClick={() => handleGrnView(item._id)}
                                  className="icon-eye me-1"
                                  size={20}
                                ></Icons.EyeOutline>
                                {/* <Link to={``}>
                                  <Icons.PencilAltOutline
                                    className="icon-edit"
                                    size={20}
                                  ></Icons.PencilAltOutline>
                                </Link> */}
                                <Icons.TrashOutline
                                  className="icon-trash"
                                  onClick={() => handelDeleteGrn(item?._id)}
                                  size={20}
                                ></Icons.TrashOutline>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">
                              No Return Found
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan="7" className="text-end">
                            Total:
                          </td>
                          <td>{totalRtv.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <Toaster position="bottom-right" />
            </div>
          </div>
        </div>
        <RtvView show={show} handleClose={handleClose} grn={grnView}></RtvView>
      </div>
    </>
  );
};

export default Rtv;
