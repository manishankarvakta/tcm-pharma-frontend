import { Box, Button, TextField } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useState } from "react";
import { useStockLedgerQuery } from "../../services/inventoryApi"; // Ensure this matches export
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import Header from "../Common/Header/Header";

import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { startOfMonth, endOfMonth, format } from "date-fns";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import "./Inventory.css";

const StockLedger = () => {
  const auth = signInUser();
  const { aamarId, storeSettings } = auth;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({
      startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [warehouse, setWarehouse] = useState("allWh");



  const { data, isError, isLoading, isFetching, refetch } = useStockLedgerQuery({
    aamarId,
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: search,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    warehouseId: warehouse !== "allWh" ? warehouse : undefined
  });

  console.log("stock--data", data);



  // Columns for MaterialReactTable
  const columns = [
    {
        accessorKey: "date",
        header: "Date",
        size: 150,
        Cell: ({ cell }) => new Date(cell.row.original.createdAt).toLocaleString(),
    },
    { accessorKey: "productId.name", header: "Product", size: 160 },
    { accessorKey: "productId.article_code", header: "Article Code", size: 120 },
    { accessorKey: "warehouseId.name", header: "Warehouse", size: 120 }, // Fixed accessor to warehouseId.name based on populate
    {
        accessorKey: "openingBalance",
        header: "Opening",
        size: 100,
        Cell: ({ cell }) => <span style={{fontWeight:'bold'}}>{parseFloat(cell.getValue() || 0).toFixed(2)}</span>,
    },
    {
        accessorKey: "action",
        header: "Action",
        size: 80,
        Cell: ({ cell }) => (
            <span
              className={`badge ${
                cell.getValue() === "IN" ? "bg-success" : "bg-danger"
              }`}
            >
              {cell.getValue()}
            </span>
        ),
    },
    {
      accessorKey: "transactionType",
      header: "Type",
      size: 140,
      Cell: ({ cell }) => (
        <span
          className="badge bg-secondary"
          style={{ textTransform: "capitalize" }}
        >
          {cell.getValue()?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Qty",
      size: 100,
      Cell: ({ cell }) => <span style={{fontWeight:'bold'}}>{parseFloat(cell.getValue() || 0).toFixed(2)}</span>,
    },
    {
        accessorKey: "balanceAfter", 
        header: "Closing",
        size: 100,
        Cell: ({ cell }) => <span style={{fontWeight:'bold'}}>{parseFloat(cell.getValue() || 0).toFixed(2)}</span>,
    },
    { accessorKey: "referenceType", header: "Ref Type", size: 100 },
    // { accessorKey: "referenceId", header: "Ref ID", size: 150 },
    { accessorKey: "notes", header: "Notes", size: 200 },
    { accessorKey: "createdBy", header: "Created By", size: 120 },
  ];

  const preHeader = [
    [`${storeSettings?.storeName || "No-Name"}`],
    [
      `${storeSettings?.address?.street || "No-Street"} ,${
        storeSettings?.address?.city || "No-City"
      }, ${storeSettings?.address?.state || "No-State"}, ${
        storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    ["Stock Ledger Report"],
  ];

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Stock Ledger"></Header>

            {/* Filters */}
             <div className="d-flex gap-3 mb-3 flex-wrap align-items-end mt-3">
                <TextField 
                    label="Search (Name, Article)" 
                    variant="outlined" 
                    size="small" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div style={{ width: 220 }}>
                    <WareHouseDW
                        id="warehouse"
                        name="warehouse"
                        handleOnChange={(e) => setWarehouse(e.option === "no-warehouse" ? "allWh" : e.option)}
                    />
                </div>
                <TextField
                    label="Start Date"
                    type="date"
                    name="startDate"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                />
                <TextField
                    label="End Date"
                    type="date"
                    name="endDate"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                />
                <Button variant="contained" onClick={() => refetch()}>Apply Filter</Button>
            </div>

            {/* Table */}
            <div className="text-center mt-2">
              <MaterialReactTable
                columns={columns}
                data={data?.data || []}
                manualPagination
                rowCount={data?.total || 0}
                onPaginationChange={setPagination}
                state={{ pagination, isLoading: isLoading || isFetching }}
                enableRowVirtualization
                positionToolbarAlertBanner="bottom"
                initialState={{
                  density: "compact",
                }}
                renderTopToolbarCustomActions={() => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "1rem",
                      p: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <CsvDownloader
                      preheader={preHeader}
                      buttonName="Download Ledger"
                      data={data?.data || []}
                      fileName={`StockLedger-${format(new Date(), "yyyy-MM-dd")}.csv`}
                    />
                  </Box>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockLedger;
