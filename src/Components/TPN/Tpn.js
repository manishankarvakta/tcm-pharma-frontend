import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDeleteTpnMutation, useTpnByDateQuery } from "../../services/tpnApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Header from "../Common/Header/Header";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TpnView from "../Common/Modal/TpnView";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import "./Tpn.css";
import AlertService from "../Utility/AlertService";
import { useSelector } from "react-redux";

const Tpn = () => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const user = signInUser();
  const lang = useSelector((state) => state.languageReducer);

  const { aamarId } = user;
  const navigate = useNavigate();
  let i = 1;
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [tpnView, setTpnView] = useState("");
  const [totalTpn, setTotalTpn] = useState(0);
  const [warehouse, setWarehouse] = useState("allWh");

  // const [exportCSV, setExportCSV] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const { data, isSuccess, isLoading, isFetching, refetch } = useTpnByDateQuery({
    startDate,
    endDate,
    warehouse,
    aamarId,
  });

  useEffect(() => {
    let total = 0;
    data?.map((purchase) => {
      total = total + purchase?.total;
    });
    setTotalTpn(total);
    // setExportCSV(data);
  }, [data, isSuccess]);

  console.log("tpn data", data);
  // console.log("export csv", exportCSV);
  const [deleteTpn] = useDeleteTpnMutation();
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

  const navigateToCreateTPN = () => {
    navigate(`/tpn-out`);
  };
  const navigateToReceiveTpn = () => {
    navigate(`/tpn-received`);
  };
  const deleteHandler = async (id) => {
    try {
      const confirm = await AlertService.confirm("Are you Sure?", "Delete this tpn?");
      if (confirm) {

        const res = deleteTpn(id);
        if (res) {
          // TODO::
          notify("Tpn Deleted Successful!", "success");
          // add error hendaler for delete error
          console.log(res);
        } else {
          console.log("Delete Operation Canceled by Tpn!");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const tpnDetailsHandler = (id) => {
    if (!id) {
      console.error("Invalid ID:", id);
      return;
    }
    setTpnView(id);
    setShow(true);
  };
  // handle warehouse

  const handleOnchangeWareHouse = (e) => {
    console.log("Selected Warehouse:", e.option);
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
  // const header = [
  //   { label: "Rtv No", key: "rtvNo" },
  //   { label: "Supplier", key: "supplier" },
  //   { label: "Warehouse", key: "warehouse" },
  //   { label: "Date", key: "date" },
  //   { label: "Rtv By", key: "user" },
  //   { label: "Item No", key: "totalItem" },
  //   { label: "Total", key: "total" },
  // ];
  const header = [
    { label: "Tpn No", key: "tpnNo" },
    // { label: "Supplier", key: "supplier" },
    { label: "Warehouse To", key: "warehouseTo.name" },
    { label: "Warehouse From", key: "warehouseFrom.name" },
    { label: "Date", key: "createdAt" },
    { label: "Tpn By", key: "userId.name" },
    { label: "Item No", key: "totalItem" },
    { label: "Total", key: "total" },
  ];

  // Ensure Tpn is an array and map the necessary data
  const transformedTpnData = Array.isArray(Tpn)
    ? Tpn.map((row) => ({
      tpnNo: row?.tpnNo,
      supplier: row?.supplier?.company,
      warehouse: row?.warehouse,
      date: row?.date,
      user: row?.user,
      totalItem: row?.totalItem,
      total: row?.total,
    }))
    : []; // Return an empty array if Tpn is not an array

  // Create the final data array
  const csvData =
    transformedTpnData.length > 0
      ? [
        ...preHeader, // Include preHeader rows first
        header.map((col) => col.label), // Column headers
        ...transformedTpnData.map((row) => Object.values(row)), // Data rows
      ]
      : [];
  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.TPN}></Header>
            <div className="">
              <div className="">
                <div className="d-md-flex mt-4 mb-4 justify-content-between align-items-center">
                  {/* Sort date range */}
                  <div className="date-picker d-md-flex gap-2 mt-2 mb-2 align-items-center">
                    {/* <b>Start:</b> */}
                    <div className="date-picker d-flex gap-1 mt-2 mb-2 align-items-center">
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
                  <div className="d-flex justify-content-md-center align-items-center gap-2">
                    <Button
                      className="btn btn-dark float-end  "
                      onClick={() => navigateToCreateTPN()}
                    >
                      {lang?.createTpn}
                    </Button>
                    <div className="col-auto">
                      {csvData.length > 0 ? (
                        <CSVLink
                          className="btn btn-dark " // Add size-specific classes like 'btn-lg' or custom CSS
                          data={csvData}
                          asyncOnClick={true}
                          filename={`Tpn${startDate}_to_${endDate}.csv`}
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
                        <button className="btn btn-dark" disabled>
                          {lang?.loadingCSV}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">TPN ID</th>
                        <th scope="col">TPN Date</th>
                        <th scope="col">Warehouse From</th>
                        <th scope="col">Warehouse To</th>
                        <th scope="col">Prepared By</th>
                        <th scope="col">Total items</th>
                        <th scope="col">Total</th>
                        <th scope="col">Note</th>
                        <th scope="col">Status</th>
                        <th scope="col">ActionBtn</th>
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
                      ) : data && data.length > 0 ? (
                        data?.map(
                          (tpn, index) =>
                            tpn?._id && (
                              <tr key={tpn?._id || index}>
                                <th scope="row">{index + 1}</th>
                                <td>{tpn?.tpnNo}</td>
                                <td>
                                  {tpn?.createdAt &&
                                    format(
                                      new Date(tpn.createdAt),
                                      "MM/dd/yyyy"
                                    )}
                                </td>
                                <td>{tpn.warehouseFrom?.name}</td>
                                <td>{tpn.warehouseTo?.name}</td>
                                <td>{tpn?.userId?.name}</td>
                                <td>{tpn?.products?.length}</td>
                                <td>{tpn?.total.toFixed(2)}</td>
                                <td>{tpn?.note}</td>
                                <td>{tpn?.status}</td>
                                <td>
                                  <Icons.EyeOutline
                                    className="icon-eye"
                                    onClick={() => tpnDetailsHandler(tpn._id)}
                                    size={20}
                                  ></Icons.EyeOutline>
                                  <Icons.TrashOutline
                                    className="icon-trash"
                                    onClick={() => deleteHandler(tpn._id)}
                                    size={20}
                                  ></Icons.TrashOutline>
                                </td>
                              </tr>
                            )
                        )
                      ) : (
                        <tr>
                          <td colSpan={11} className="text-center">
                            No TPN Found
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={7} className="text-end">
                          Total:
                        </td>
                        <td>{totalTpn.toFixed(2)}</td>
                        <td colSpan={3}></td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TpnView show={show} handleClose={handleClose} tpn={tpnView}></TpnView>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Tpn;
