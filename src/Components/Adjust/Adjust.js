import axios from "../../services/apiClient";
import Swal from "sweetalert2";
import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  useAdjustByDateQuery,
  useDeleteAdjustMutation
} from "../../services/adjustApi";
import Header from "../Common/Header/Header";
import AdjustViewModal from "../Common/Modal/AdjustViewModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import "./Adjust.css";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import { useSelector } from "react-redux";

const Adjust = () => {
  const auth = signInUser();
  const aamarId = auth?.aamarId;
  let i = 1;
    const lang = useSelector((state) => state.languageReducer);
  
  const BASE_URL =
    (process.env.REACT_APP_API_URL || "http://localhost:5006/api").replace(
      /\/$/,
      ""
    ) + "/";
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [warehouse, setWarehouse] = useState("allWh");
  const [adjust, setAdjust] = useState([]);



  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);

  const { data, isLoading, isSuccess, isFetching, refetch } =
    useAdjustByDateQuery({
      startDate,
      endDate,
      aamarId,
      warehouse
    });
  // console.log("adjust", data);

  const [deleteAdjust] = useDeleteAdjustMutation();
  // const data = []


  const adjustDetailsHandler = async (id) => {
    // console.log("adjust id", id);
    const adjust = await axios.get(`${BASE_URL}adjust/${id}`);
    // console.log(adjust.data);
    setAdjust(adjust.data);
    setOnShow(true);
  };

  useEffect(() => {
    if (auth?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(auth?.warehouse);
    }
  }, [refetch]);

  useEffect(() => {
    refetch();
  }, [startDate, endDate, warehouse, aamarId]);

  const deleteHandler = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you Sure?",
        text: "Delete this Adjust?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // setLoader(true);
        const res = await deleteAdjust(id);
        // console.log(res);
        if (res.data) {
          notify("Adjust Delete successful", "success");
        } else {
          notify("Delete Operation Canceled!", "error");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setLoader(false);
    }
  };

  const handleOnchangeWareHouseFrom = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
  };
  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-12 col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-12 col-md-10">
            <Header title={lang?.adjust}></Header>
            <div className="row">
              <div className="col-12 d-flex justify-content-end mb-2 mt-2">
                <Button
                  className="btn btn-dark me-2"
                  onClick={() => {
                    navigate("/create-adjust");
                  }}
                >
                  {lang?.createAdjust}
                </Button>
              </div>
              <div className="col-12">
                <div className="col-12 col-md-6 mb-3">
                  {/* Sort date range */}
                  <div className="date-picker d-flex justify-content-start  flex-row align-items-center gap-2">
                    <DatePicker
                      selected={new Date(startDate)}
                      className="form-control  m"
                      onChange={(date) =>
                        setStartDate(format(new Date(date), "MM-dd-yyyy"))
                      }
                    />
                    <span width="10px"></span>
                    <DatePicker
                      selected={new Date(endDate)}
                      className="form-control"
                      onChange={(date) =>
                        setEndDate(format(new Date(date), "MM-dd-yyyy"))
                      }
                    />
                    <div>
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
                          <WareHouseDW
                            id="warehouse"
                            name="warehouse"
                            handleOnChange={handleOnchangeWareHouseFrom}
                            className="form-control "
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Adjust ID</th>
                        <th scope="col">Adjust Date</th>
                        <th scope="col">Prepared By</th>
                        <th scope="col">Total items</th>
                        <th scope="col">Reason</th>
                        <th scope="col">Warehouse</th>
                        <th scope="col">Total</th>
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
                                <Skeleton width={40} height={20} />
                              </td>
                            </tr>
                          ))
                      ) : data?.length > 0 ? (
                        data?.map((adjust) => (
                          <tr key={adjust._id}>
                            <th scope="row">{i++}</th>
                            <td>{adjust?.adjustNo}</td>
                            <td>
                              {adjust?.createdAt &&
                                format(
                                  new Date(adjust.createdAt),
                                  "MM/dd/yyyy"
                                )}
                            </td>
                            <td>{adjust?.userId?.name}</td>
                            <td>{adjust?.products?.length}</td>
                            <td>{adjust.note}</td>
                            <td>{adjust?.warehouse?.name}</td>
                            <td>{adjust?.total?.toFixed(2)}</td>
                            <td>{adjust.status}</td>
                            <td>
                              <Icons.EyeOutline
                                className="icon-eye"
                                onClick={() => adjustDetailsHandler(adjust._id)}
                                size={20}
                              ></Icons.EyeOutline>
                              {adjust.status !== "Canceled" &&
                                auth?.type === "admin" && (
                                  <Icons.TrashOutline
                                    className="icon-trash"
                                    onClick={() => deleteHandler(adjust._id)}
                                    size={20}
                                  />
                                )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="text-center">No adjust Found</td>
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
      <AdjustViewModal
        onShow={onShow}
        handleClose={handleClose}
        adjust={adjust}
      ></AdjustViewModal>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Adjust;
