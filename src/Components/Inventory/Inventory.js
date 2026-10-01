import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useState } from "react";
import {
  useInventoriesQuery,
  useInventoryCountQuery,
} from "../../services/inventoryApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Header from "../Common/Header/Header";
import InventoryViewModal from "../Common/Modal/InventoryViewModal";

import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import "./Inventory.css";
import { useSelector } from "react-redux";
// import useInventory from '../Hooks/useInventory';

const Inventory = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  let i = 1;
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const lang = useSelector((state) => state.languageReducer);

  // const [inventories, setInventories] = useState([]);
  const [warehouse, setWarehouse] = useState("allWh");

  const [whName, setWhName] = useState(" ");
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const [onShow, setOnShow] = useState(false);
  const [onExportShow, setOnExportShow] = useState(false);
  const [code, setCode] = useState("");
  const todayStr = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);



  const handleClose = () => setOnShow(false);
  const handleExportClose = () => setOnExportShow(false);

  const { data, error, isLoading, isFetching, isSuccess, refetch } = useInventoriesQuery({
    aamarId,
    warehouse,
    q,
  });

  console.log("warehouse", warehouse, data);
  useEffect(() => {
    console.log("Warehouse Changed:", warehouse);
    refetch();
  }, [warehouse, refetch]);



  // console.log("data:", data);

  // get totel product count
  const pageCountQuery = useInventoryCountQuery();
  useEffect(() => {
    const { data } = pageCountQuery;
    // console.log(data);
    setPageCount(data);
  }, [pageCountQuery]);

  const handleSearch = (e) => {
    setQ(e.target.value);
    refetch();
  };
  // console.log(data);
  const handlePageClick = (data) => {
    setPageNo(data.selected + 1);
    // console.log(data);
    // setPageNo(getPageNumber);
    refetch();
  };

  const handleDataLimit = (e) => {
    setSize(parseInt(e.target.value));
    // setPageNo(getPageNumber);
    refetch();
  };

  const handleViewInventory = (code) => {
    // console.log(code);
    setCode(code);
    setOnShow(true);
  };
  const handelExportModal = () => {
    // console.log("hello");
    setOnExportShow(true);
  };
  // console.log(data, error, isSuccess, pageNo, size, q);

  // Columns for MaterialReactTable
  const columns = [
    { accessorKey: "article_code", header: "Article Code", size: 120 },
    { accessorKey: "name", header: "Name", size: 160 },
    { accessorKey: "groupName", header: "Group", size: 140 },
    {
      accessorKey: "openingQty",
      header: "Opening Stock",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    {
      accessorKey: "totalQty",
      header: "Purchase/GRN Qty",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    {
      accessorKey: "salesReturnQty",
      header: "Sales Return Qty",
      Cell: ({ cell }) => Math.abs(parseFloat(cell.getValue() || 0).toFixed(2)), // Ensure positive
    },
    {
      accessorKey: "adjustQty",
      header: "Receive Adjustment",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2)
    },
    {
      accessorKey: "availableQty",
      header: "Available Stock",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    {
      accessorKey: "soldQty",
      header: "Sale Qty",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    {
      accessorKey: "rtvQty",
      header: "RTV Qty",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    {
      accessorKey: "tpnQty",
      header: "TPN Qty",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2)
    },
    {
      accessorKey: "damageQty",
      header: "Damage Qty",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    {
      accessorKey: "otherAdjustQty",
      header: "Issue Adjustment",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2)
    },
    {
      accessorKey: "currentQty",
      header: "Closing Stock",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    {
      accessorKey: "tp",
      header: "TP",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
    // {
    //   accessorKey: "mrp",
    //   header: "MRP",
    //   Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2)
    // },
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },
  ];

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
    refetch();
  };

  const preHeader = [
    [`${auth?.storeSettings?.storeName || "No-Name"}`],
    [`${auth?.storeSettings?.address?.street || "No-Street"}`],
    [
      `${auth?.storeSettings?.address?.city || "No-City"}-${auth?.storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${auth?.aamarId || "No-Aamar Id"}`],
    [`Inventory Report`],

    [], // Empty row for spacing
  ];


  // console.log(("DATA", data));
  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.productsInventory}></Header>
            <div className="mt-3 mb-2 d-flex flex-wrap align-items-center gap-3">
              {auth?.type === "admin" && (
                <div
                  className="mt-2 mt-md-0 mb-md-0"
                  style={{
                    position: "relative",
                    zIndex: 100,
                    width: 280,
                  }}
                >
                  <WareHouseDW
                    id="warehouse"
                    name="warehouse"
                    handleOnChange={handleOnchangeWareHouse}
                    MenuProps={{
                      container: document.body,
                    }}
                  />
                </div>
              )}
              {/* <div className="d-flex align-items-center gap-2">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: "160px" }}
                />
                <span className="text-muted">to</span>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: "160px" }}
                />
              </div> */}
            </div>

            {/* Table */}
            <div className="text-center py-2">
              <MaterialReactTable
                columns={columns}
                data={data || []}
                state={{ isLoading: isLoading || isFetching }}
                // enableRowSelection
                enableRowVirtualization // Enables row virtualization
                positionToolbarAlertBanner="bottom"
                initialState={{
                  density: "compact",
                  pagination: { pageSize: 18 },
                }}
                renderTopToolbarCustomActions={() => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "1rem",
                      p: "1rem",
                      flexWrap: "wrap",
                      // Responsive styling for small devices
                      "@media (max-width: 600px)": {
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        p: "0.3rem",
                      },
                    }}
                  >
                    <CsvDownloader
                      preheader={preHeader}
                      buttonName={
                        <span className="download-text">
                          {lang?.downloadInventoryData}
                        </span>
                      }
                      data={data || []}
                      fileName={`Export Inventory - [${today?.toDateString()}].csv`}
                      sx={{
                        padding: { xs: "0.4rem 0.8rem", sm: "0.5rem 1rem" },
                      }}
                    />
                  </Box>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <InventoryViewModal
        onShow={onShow}
        handleClose={handleClose}
        code={code}
      />
      {/* <ExportInventory
        pageCountQuery={pageCountQuery?.data}
        onShow={onExportShow}
        handleClose={handleExportClose}
      /> */}
    </div>
  );
};

export default Inventory;
