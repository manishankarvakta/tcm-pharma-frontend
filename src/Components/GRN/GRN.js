import * as Icons from "heroicons-react";
import { useState } from "react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
// import CsvImporter from "../Common/CsvImporter/CsvImporter";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Toaster } from "react-hot-toast";

import { Link } from "react-router-dom";
import { notify } from "../Utility/Notify";
// import PurchaseView from "../Common/Modal/PurchaseView";
import { format, isToday } from "date-fns";
// import useInventory from "../Hooks/useInventory";
import {
  useDeleteGrnMutation,
  useGrnByDateQuery,
  // useGrnsQuery,
  // useGrnPagenationQuery,
  useGrnCountQuery
} from "../../services/grnApi";
import GrnView from "../Common/Modal/GrnView";
// import ReactPaginate from "react-paginate";
// import { Spinner } from "react-bootstrap";
// import LoadingModal from "../Common/Modal/LoadingModal";
// import DatePicker from "react-datepicker";
import { MaterialReactTable } from "material-react-table";
import { useWarehouseQuery } from "../../services/warehouseApi";
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";
import AlertService from "../Utility/AlertService";

function isCurrentDate(dbDate) {
  const result = isToday(new Date(dbDate));
  // console.log(result);
  return result;
}

const GRN = () => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const user = signInUser();
  const { aamarId } = user;
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [warehouse, setWarehouse] = useState("allWh");
  const [deleteGrn] = useDeleteGrnMutation();
  const [show, setShow] = useState(false);
  // const [delProducts, setDelProducts] = useState([]);
  // const { updateInventoryOUTOnGRNDel } = useInventory();
  const lang = useSelector((state) => state.languageReducer);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const [totalGrn, setTotalGrn] = useState(0);
  // const [totalGrn, setTotalGrn] = useState(0);
  const [shippingCostTotal, setShippingCostTotal] = useState(0);
  const [grnTotal, setGrnTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [exportCSV, setExportCSV] = useState([]);

  const [loading, setLoading] = useState(true);
  // const handleLoaderClose = () => setLoader(false);

  const [grn, setGrn] = useState([]);
  const [grnView, setGrnView] = useState([]);
  // console.log(startDate, endDate);
  const { data, isSuccess, isFetching, isLoading, refetch } = useGrnByDateQuery({
    startDate,
    endDate,
    warehouse,
    aamarId
  });
  // const [updateInventoryOUTOnGRNDel] = useInventory;

  // console.log('Data ', data)

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);
  useEffect(() => {
    if (data?.length > 0) {
      setGrn(data);
      setLoading(false);
    }
  }, [data, isSuccess, isFetching, isLoading]);
  useEffect(() => {
    if (data) {
      setGrn(data); // Update sales only when data is available
      setExportCSV(data || []); // Ensure exportCSV is an array, fallback to empty array
    }
  }, [isSuccess, isFetching, isLoading, data]);

  useEffect(() => {
    let totalGrnSum = 0;
    let discountTotalSum = 0;
    let shippingCostTotalSum = 0;
    let grandTotal = 0;

    data?.forEach((grnItem) => {
      const grnAmount = parseFloat(grnItem.total) || 0;
      const discount = parseFloat(grnItem.discount) || 0;
      const shippingCost = parseFloat(grnItem.shipping_cost) || 0;

      totalGrnSum += grnAmount;
      discountTotalSum += discount;
      shippingCostTotalSum += shippingCost;
      grandTotal += grnAmount - discount + shippingCost;
    });

    setGrnTotal(totalGrnSum.toFixed(2));
    setDiscountTotal(discountTotalSum.toFixed(2));
    setShippingCostTotal(shippingCostTotalSum.toFixed(2));
    setTotalGrn(grandTotal.toFixed(2));
  }, [data, isSuccess, isFetching, isLoading]);

  useEffect(() => {
    let total = 0;

    data?.forEach((grn) => {
      const grnTotal = parseFloat(grn?.total) || 0;
      const discount = grn?.discount ? parseFloat(grn.discount) : 0;
      const shippingCost = grn?.shipping_cost
        ? parseFloat(grn.shipping_cost)
        : 0;

      total += grnTotal - discount + shippingCost;
    });

    setTotalGrn(total);
  }, [data, isSuccess, isFetching, isLoading]);

  useEffect(() => {
    refetch();
  }, [startDate, endDate, warehouse]);

  useEffect(() => {
    if (data?.length > 0) {
      setGrn(data);
      setExportCSV(data);
    }
  }, [isSuccess, isFetching, isLoading, data]);

  useEffect(() => {
    if (user?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(user?.warehouse);
    }
  }, []);

  // useEffect(() => {
  //   grn > 0 ? setLoading(false) : setLoading(true);
  // }, [grn]);
  // console.log(purchase)
  // console.log(grn);

  // const handelDeleteGrn = async (id) => {
  //   try {
  //     let newIn = [];
  //     /// axios diye data from data get
  //     const result = await axios.put(`${BASE_URL}/grn/${id}`);
  //     // console.log(result.data.products);
  //     if (result?.data?.products?.length > 0) {
  //       result?.data?.products?.map((pro) => {
  //         newIn = [
  //           ...newIn,
  //           {
  //             article_code: pro?.article_code,
  //             qty: pro?.qty,
  //             priceId: pro?.priceId,
  //             name: pro?.name,
  //           },
  //         ];
  //       });

  //       // setDelProducts(newIn);
  //       // console.log(newIn)
  //     }
  //     const confirm = window.confirm("Are you Sure? Delete this GRN?");

  //     if (confirm) {
  //       // setLoader(true);
  //       const res = await deleteGrn(id);
  //       if (res) {
  //         // console.log(delProducts);

  //         // // // UPDATE INVENTORY
  //         // const inventory = await updateInventoryOUTOnGRNDel(newIn);
  //         // console.log(inventory);
  //         // if(inventory){}
  //         // console.log(newIn);
  //         // console.log(inventory?.data);
  //         notify("GRN Deleted Successful!", "success");

  //         // add error hendaler for delete error
  //         // console.log(res);
  //         // } else {
  //         //   console.log("Delete Operation Canceled by Purchas!");
  //         //   return;
  //       } else {
  //         // setDelProducts([])
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     // setLoader(false);
  //   }
  // };

  const handelDeleteGrn = async (data) => {
    try {
      const confirmed = await AlertService.confirm("Are you Sure?", "Delete this GRN?");

      if (confirmed) {
        setLoader(true);
        const res = await deleteGrn(data);
        if (res) {
          refetch();
          notify("GRN Deleted Successful!", "success");
        } else {
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handleGrnView = (id) => {
    // console.log(id);
    setGrnView(id);
    setShow(true);
  };
  const handlePurchaseUpdate = (id) => {
    // console.log(id);
    setGrnView(id);
    setShow(true);
  };

  const pageCountQuery = useGrnCountQuery({ aamarId });

  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
  }, [pageCountQuery]);

  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  };

  const columns = [
    { accessorKey: "refNo", header: "PO/TPN" },
    { accessorKey: "grnNo", header: "GRN NO" },
    { accessorKey: "date", header: "Date", size: 120 },
    { accessorKey: "user", header: "User", size: 30 },
    { accessorKey: "supplier", header: "Vendor", size: 30 },
    { accessorKey: "warehouse", header: "Warehouse", size: 30 },
    { accessorKey: "totalItem", header: "Items", size: 60 },
    { accessorKey: "total", header: "Total", size: 30 },
    { accessorKey: "shipping_cost", header: "Shipping Cost", size: 30 },
    { accessorKey: "discount", header: "Discount", size: 30 },
    {
      accessorFn: (row) =>
        (
          parseFloat(row?.total) -
          (row?.discount ? parseFloat(row?.discount) : 0) +
          (row?.shipping_cost ? parseFloat(row?.shipping_cost) : 0)
        ).toFixed(2),
      header: "Net Total",
      size: 30
    },
    { accessorKey: "status", header: "Status", size: 30 }
  ];

  const headers = [
    { label: "Ref No", key: "refNo" },
    { label: "GRN No", key: "grnNo" },
    { label: "Date", key: "date" },
    { label: "User", key: "user" },
    { label: "Vendor", key: "supplier" },
    { label: "Warehouse", key: "warehouse" },
    { label: "Gross Total", key: "grossTotal" },
    { label: "Total Item", key: "totalItem" },
    { label: "Total", key: "total" },
    { label: "Shipping Cost", key: "shipping_cost" },
    { label: "Discount", key: "discount" },
    { label: "Status", key: "status" }
  ];

  const materialReactTableContainer = {
    overflow: "visible",
    position: "relative" // If needed
  };

  console.log("GRN DATA::>", grn);
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
    [`${user?.storeSettings?.storeName || "No-Name"}`],
    [`${user?.storeSettings?.address?.street || "No-Street"}`],
    [
      `${user?.storeSettings?.address?.city || "No-City"}-${user?.storeSettings?.address?.post || "No-PostalCode"
      }`
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${user?.aamarId || "No-Aamar Id"}`],
    [`GRN Report`],

    [] // Empty row for spacing
  ];

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.goodsReceiveNote}></Header>

            <div className="row">
              <div className="col-md-12">
                <div className=" d-md-flex align-items-center justify-content-between">
                  {/* <b>Start:</b> */}
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
                                : "100%" // Adjust width based on screen size
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
                            PaperProps: {}
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between gap-2 align-item-center">
                    <div className="">
                      <div class="btn-group d-grid gap-1" role="group">
                        <Link
                          to="/grn-create"
                          className="btn btn-dark btn-md btn-block float-end "
                        >
                          {lang?.createNewGrn}
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
              <div
                className="col-md-12 mt-2 mt-md-0"
                style={{
                  position: "relative", // Ensure z-index is applied
                  zIndex: 10, // Set your desired z-index value
                }}
              >
                <div>
                  <MaterialReactTable
                    className={materialReactTableContainer}
                    columns={columns}
                    data={grn}
                    state={{
                      isLoading: loading
                    }}
                    // enableGrouping //Aggregation
                    initialState={{
                      density: "compact",
                      pagination: {
                        pageIndex: 0,
                        pageSize: 100 // Rows per page
                      }
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
                          gap: "0.5rem"
                        }}
                      >
                        {row?.original?.status === "Pending" && (
                          <Icons.PencilAltOutline
                            onClick={() =>
                              handlePurchaseUpdate(row?.original?._id)
                            }
                            className="icon-eye me-1"
                            size={20}
                          />
                        )}

                        <Icons.EyeOutline
                          onClick={() => handleGrnView(row?.original?._id)}
                          className="icon-eye me-1"
                          size={20}
                        />

                        {isCurrentDate(row?.original?.date) &&
                          row?.original?.status === "Pending" && (
                            <Icons.TrashOutline
                              className="icon-trash"
                              onClick={() =>
                                handelDeleteGrn({
                                  _id: row?.original?._id,
                                  poNo: row?.original?.refNo
                                })
                              }
                              size={20}
                            />
                          )}
                      </div>
                    )}
                  />
                  <div className=" col-12 container-fluid row py-4 text-end">
                    <div className="col-md-3"></div>
                    <div className="col-md-2 col-3">
                      <strong>GRN Total:</strong> {grnTotal}
                    </div>
                    <div className="col-3">
                      <strong>Shipping Cost Total:</strong> {shippingCostTotal}
                    </div>
                    <div className="col-md-2 col-3">
                      <strong>Discount Total:</strong> {discountTotal}
                    </div>
                    <div className="col-md-2 col-3">
                      <strong>Net Total:</strong> {totalGrn?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Toaster position="bottom-right" />
          </div>
        </div>
      </div>
      <GrnView show={show} handleClose={handleClose} grn={grnView}></GrnView>
    </div>
  );
};

export default GRN;
