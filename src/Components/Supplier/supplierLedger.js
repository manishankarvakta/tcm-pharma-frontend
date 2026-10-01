import React, { useEffect, useRef, useState } from "react";
// import { Button, Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import "./Supplier.css";
import * as Icons from "heroicons-react";
// import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import SideBar from "../Common/SideBar/SideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { notify } from "../Utility/Notify";
// import SearchProduct from "../Common/CustomSelect/SearchProduct";
import {
  // useSuppliersQuery,
  // useSupplierQuery,
  // useAddSupplierMutation,
  // useUpdateSupplierMutation,
  // useDeleteSupplierMutation,
  useSupplierLedgerQuery,
} from "../../services/supplierApi";
// import SupplierProductModal from "../Common/Modal/SupplierProductModal";
import PurchaseView from "../Common/Modal/PurchaseView";
import AccountView from "../Accounts/AccountView";
import RtvView from "../Common/Modal/RtvView";
import GrnView from "../Common/Modal/GrnView";
import { format } from "date-fns";
import LoadingModal from "../Common/Modal/LoadingModal";

const SupplierLedger = () => {
  let i = 1;
  const { id } = useParams();
  let navigate = useNavigate();
  const [supplier, setSupplier] = useState([]);
  const [recordId, setSRecordId] = useState("");
  const [loader, setLoader] = useState(true);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSupplierLedgerQuery(id);

  let balance = 0;
  let debit = 0;
  let credit = 0;

  console.log(id);
  console.log(data);
  const [show, setShow] = useState(false);
  const [showRtv, setShowRtv] = useState(false);
  const [showAc, setShowAc] = useState(false);
  const [showGrn, setShowGrn] = useState(false);

  // const [debit, setDebit] = useState(0);
  // const [credit, setCredit] = useState(0);

  const handleClose = () => {
    setShow(false);
    setShowAc(false);
    setShowGrn(false);
    setShowRtv(false);
  };
  // const handleShow = () => setShow(true);s
  const handleLoaderClose = () => setLoader(false);

  useEffect(() => {
    refetch();
  }, [start, end, id]);

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      setSupplier(data);
      handleLoaderClose();
    } else {
      console.log(error);
    }
  }, [isSuccess]);

  const handleViewDetails = (type, id) => {
    // if (type === "PO") {
    //   console.log("PO View");
    //   setSRecordId(id);
    //   setShow(true);
    // } else
    if (type === "Accounts") {
      console.log("Accounts View");
      setSRecordId(id);
      setShowAc(true);
    } else if (type === "GRN") {
      console.log("GRN View");
      setSRecordId(id);
      setShowGrn(true);
    } else if (type === "RTV") {
      console.log("RTV View");
      setSRecordId(id);
      setShowRtv(true);
    }
  };

  console.log(supplier);

  return (
    <div>
      <div className="container-fluid">
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
            <Header
              title={
                supplier?._id &&
                `Supplier Ledger: ${supplier.company} [${supplier.code}]`
              }
            ></Header>
            <div className="row my-3">
              <div className="col-md">
                <p>
                  <b>Company: </b>
                  {supplier.company}
                </p>
              </div>
              <div className="col-md col-6">
                <p>
                  <b>Name: </b>
                  {supplier.name}
                </p>
              </div>
              <div className="col-md col-6">
                <p>
                  <b>Email: </b>
                  {supplier.email}
                </p>
              </div>
              <div className="col">
                <p>
                  <b>Phone: </b>
                  {supplier.phone}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="thead">
                    <th>Type</th>
                    <th className="text-center">Document ID</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Debit</th>
                    <th className="text-center">Credit</th>
                    <th className="text-center">Balance</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Details</th>
                  </thead>
                  <tbody>
                    {}
                    {supplier?.records?.length > 0 ? (
                      supplier.records.map((record) => {
                        if (record?.type === "GRN") {
                          debit = (
                            parseFloat(debit) + parseFloat(record?.amount)
                          ).toFixed(2);
                        } else {
                          credit = (
                            parseFloat(credit) + parseFloat(record?.amount)
                          ).toFixed(2);
                        }
                        return (
                          <tr key={record._id}>
                            {/* {setCredit(onCredit + record?.amount)} */}
                            <td className="text-start">{record.type}</td>
                            <td className="text-center">{record.doc_id}</td>
                            <td className="text-center">
                              {format(
                                new Date(record?.createdAt),
                                "MM-dd-yyyy"
                              )}
                            </td>
                            <td className="text-center">
                              {record.type === "GRN" &&
                                parseFloat(record?.amount)?.toFixed(2)}
                            </td>
                            <td className="text-center">
                              {record.type === "Accounts" ||
                              record.type === "RTV"
                                ? parseFloat(record?.amount)?.toFixed(2)
                                : ""}
                            </td>
                            <td className="text-center">
                              {record.type !== "GRN"
                                ? (balance = (
                                    parseFloat(balance) -
                                    parseFloat(record?.amount)
                                  ).toFixed(2))
                                : (balance = (
                                    parseFloat(balance) +
                                    parseFloat(record?.amount)
                                  ).toFixed(2))}
                            </td>
                            <td className="text-end">{record.status}</td>
                            <td className="text-center">
                              {
                                <Icons.DocumentTextOutline
                                  size={22}
                                  onClick={() =>
                                    handleViewDetails(record.type, record._id)
                                  }
                                />
                              }
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12} className="text-center">No Records found</td>
                      </tr>
                    )}
                    <tr>
                      {/* <td ></td> */}
                      <th colSpan={3}>
                        <p className="text-end pe-4 m-0">
                          <b>Total: </b>
                        </p>
                      </th>
                      <th className="text-center">{debit}</th>
                      <th className="text-center">{credit}</th>
                      <th className="text-center">{balance}</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
      {/* PO */}
      <PurchaseView show={show} handleClose={handleClose} purchase={recordId} />
      {/* Accounts */}
      <AccountView
        show={showAc}
        handleClose={handleClose}
        accountId={recordId}
      />
      {/* RTV */}
      <RtvView show={showRtv} handleClose={handleClose} grn={recordId} />
      {/* GRN */}
      <GrnView show={showGrn} handleClose={handleClose} grn={recordId} />
    </div>
  );
};

export default SupplierLedger;
