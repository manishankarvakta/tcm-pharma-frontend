import React, { useState } from "react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
import * as Icons from "heroicons-react";
import CsvImporter from "../Common/CsvImporter/CsvImporter";
import { notify } from "../Utility/Notify";
import { Toaster } from "react-hot-toast";
import axios from "../../services/apiClient";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PurchaseView from "../Common/Modal/PurchaseView";
import { compareAsc, format } from "date-fns";
import {
  usePurchasesQuery,
  useDeletePurchaseMutation,
  usePurchaseByDateQuery,
  useUpdatePurchaseStatusMutation,
} from "../../services/purchasApi";
import LoadingModal from "../Common/Modal/LoadingModal";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";

const Purchase = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [deletePurchase] = useDeletePurchaseMutation();
  const [deletePurchaseStatus] = useUpdatePurchaseStatusMutation();
  // const purchases = usePurchasesQuery();
  const { data, isSuccess, refetch } = usePurchaseByDateQuery({
    startDate,
    endDate,
  });
  console.log("po", data);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loader, setLoader] = useState(true);
  const handleLoaderClose = () => setLoader(false);

  let i = 1;
  const [purchase, setPurchase] = useState([]);
  const [purchaseView, setPurchaseView] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);

  // console.log("Purchese View", purchaseView);

  useEffect(() => {
    data?.length > 0 ? setPurchase(data) : setPurchase([]);
  }, [data, isSuccess]);

  useEffect(() => {
    let total = 0;
    data?.map((purchase) => {
      total =
        total +
        parseFloat(purchase?.total) -
        (purchase?.discount ? parseFloat(purchase?.discount) : 0) +
        (purchase?.shipping_cost ? parseFloat(purchase?.shipping_cost) : 0);
    });
    setTotalPurchase(total);
  }, [data, isSuccess]);

  useEffect(() => {
    isSuccess ? setLoader(false) : setLoader(true);
  }, [data, isSuccess]);

  const deleteHandler = async (id) => {
    try {
      const confirm = window.confirm("Are you Sure? Delete this Purchase?");
      if (confirm) {
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
    if (purchase.status === "Pending") {
      console.log(purchase._id);
      navigate(`/purchase-update/${purchase._id}`);
    } else {
      notify("This Purchase Can not be Modified", "error");
    }
  };

  // console.log("purchaseView", purchaseView);
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
            <Header title="Purchase"></Header>
            <div className="row">
              <div className="col-md-6">
                {/* Sort date range */}
                <div className="date-picker d-flex mt-2 mb-2 align-items-center">
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
              </div>
              <div className="col-md-6">
                <Link
                  to="/purchase-createSearch"
                  className="btn btn-dark float-end m-3"
                >
                  Create New Purchase
                </Link>
              </div>

              <div className="col-md-12"></div>
              <div className="col-md-12">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PO</th>
                      <th>Date</th>
                      <th>Warehouse</th>
                      <th>Vendor</th>
                      {/* <th>PO By</th> */}
                      <th>Item No</th>
                      <th>Total</th>
                      <th>Discount</th>
                      <th>GrossTotal</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase?.length > 0 ? (
                      purchase?.map((po) => (
                        <tr key={po?._id}>
                          <th>{i++}</th>
                          <td>{po?.poNo}</td>
                          <td>{po?.date}</td>
                          <td>{po?.warehouse}</td>
                          <td>{po?.supplier}</td>
                          {/* <td>{po?.po_by}</td> */}
                          <td>{po?.totalItem}</td>
                          <td>{parseFloat(po?.total)}</td>
                          <td>{parseFloat(po?.discount)}</td>
                          <td>{parseFloat(po?.grossTotal)}</td>
                          <td>{po?.status}</td>
                          <td>
                            {po?.status === "Pending" && (
                              <Link to={`/create-grn/${purchase._id}`}>
                                <Icons.ArchiveOutline
                                  className="icon-edit"
                                  size={20}
                                ></Icons.ArchiveOutline>
                              </Link>
                            )}
                            {po?.status === "Pending" && (
                              <Icons.PencilAltOutline
                                onClick={() => handlePurchaseUpdate(po)}
                                className="icon-eye me-1"
                                size={20}
                              ></Icons.PencilAltOutline>
                            )}

                            <Icons.EyeOutline
                              onClick={() => handlePurchaseView(po?._id)}
                              className="icon-eye me-1"
                              size={20}
                            ></Icons.EyeOutline>
                            {po?.status === "Pending" && (
                              <Icons.TrashOutline
                                className="icon-trash"
                                onClick={() => deleteHandler(po?._id)}
                                size={20}
                              ></Icons.TrashOutline>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr colSpan={9}>No Purchase Found</tr>
                      // <tr>
                      //   <td colSpan={9} className="">
                      //     <p className="text-center mt-5 mb-5">
                      //       <Spinner animation="border" variant="dark" />
                      //       <br></br>
                      //       <b>Please Wait Purchase is Loading</b>
                      //     </p>
                      //   </td>
                      // </tr>
                    )}
                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td></td> */}
                        <td>Total :</td>
                        <td>{totalPurchase.toFixed(2)}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    }
                  </tbody>
                </table>
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
