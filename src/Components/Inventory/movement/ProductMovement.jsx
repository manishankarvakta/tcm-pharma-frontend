import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Header from "../../Common/Header/Header";
import SideBar from "../../Common/SideBar/SideBar";
import "../Inventory.css";

import { format } from "date-fns";
import { ArrowDown } from "heroicons-react";
import WareHouseDW from "../../Common/CustomSelect/WareHouseDW";
import LoadingModal from "../../Common/Modal/LoadingModal";
import { signInUser } from "../../Utility/Auth";
import ProcessMovement from "./parts/ProcessMovement";
import { useSelector } from "react-redux";

function ProductMovement() {
  let i = 1;

  const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate };
  const sortIcon = <ArrowDown />;
  const lang = useSelector((state) => state.languageReducer);

  const paginationComponentOptions = {
    rowsPerPageText: "Show Number of Row",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All Rows",
  };
  // const [startDate, setStartDate] = useState(
  //   format(new Date("10-15-2023"), "MM-dd-yyyy")
  // );
  // const [endDate, setEndDate] = useState(
  //   format(new Date("10-15-2023"), "MM-dd-yyyy")
  // );
  const auth = signInUser();
  const { aamarId, storeSettings } = auth;
  const [warehouse, setWarehouse] = useState("allWh");
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [inventory, setInventory] = useState([]);

  //   const { data, error, isLoading, isFetching, isSuccess, refetch } =
  //     useInventoryMovementQuery(
  //       {
  //         startDate,
  //         endDate,
  //       },
  //       {
  //         staleTime: 5000000, // 120 seconds
  //       }
  //     );

  //   console.log(startDate, endDate);
  //   console.log(error);
  //   console.log("data:", data);

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);
  const handleLoader = () => setLoader(true);

  //   useEffect(() => {
  //     refetch();
  //     // handleLoader();
  //     setInventory([]);
  //   }, [startDate, endDate]);

  //   useEffect(() => {
  //     handleLoaderClose();

  //     data?.data?.length > 0 && setInventory(data?.data);
  //     console.log("Time:", data?.time);
  //   }, [isSuccess, data]);

  useEffect(() => {
    if (auth?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(auth?.warehouse);
    }
  }, []);

  useEffect(() => {
    // refetch();
  }, [startDate, endDate, warehouse, aamarId]);

  const handleOnchangeWareHouseFrom = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
  };

  return (
    <div>
      <div className="container-fluid ">
        <LoadingModal
          title={"Please Wait"}
          onShow={loader}
          handleClose={handleLoaderClose}
        ></LoadingModal>
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.inventoryMovement}></Header>
            <div className="row mt-3">
              <div className="col-md-7">
                <form action="javasctipt:void(0)">
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
                    {auth?.type === "admin" && (
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
                          handleOnChange={handleOnchangeWareHouseFrom}
                          MenuProps={{
                            container: document.body,
                            PaperProps: {},
                          }}
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="col-md-5">
                <span className="float-end">
                  {/* <p>
                    Result Show from{" "}
                    <b>
                      {data?.start &&
                        format(new Date(data?.start), "dd MMM yyyy")}
                    </b>{" "}
                    to{" "}
                    <b>
                      {data?.end && format(new Date(data?.end), "dd MMM yyyy")}
                    </b>
                  </p> */}
                  {/* <ExportNav
                        data={data}
                        title="Inventory"
                        Routes={InventoryRoutes}
                      /> */}
                </span>
              </div>
            </div>
            <div
              className="wrapper  p-3 justify-content-center  h-75  d-flex "
              style={{ height: 200 }}
            >
              <ProcessMovement
                start={startDate}
                end={endDate}
                warehouse={warehouse}
                aamarId={aamarId}
                storeSettings={storeSettings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductMovement;
