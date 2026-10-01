/* eslint-disable jsx-a11y/img-redundant-alt */
// import axios from "../../../../../services/apiClient";
// import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
import Barcode from "react-barcode";
import Logo from "../../../../../logo_pharma.jpg";
import { signInUser } from "../../../../Utility/Auth";

const GrnHeaderTpn = ({ grn, format, title }) => {
  const auth = signInUser();
  const { storeSettings } = auth;
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001/api";
  // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // const [supplier, setSupplier] = useState({});
  // const getSupplier = async () => {
  //   await axios
  //     .get(`${BASE_URL}/supplier/${grn?.supplier}`)
  //     .then((response) => setSupplier(response.data));
  // };
  // useEffect(() => {
  //   getSupplier();
  // }, [grn]);
  console.log(grn);
  return (
    <>
      {/* <h1>hi</h1> */}
      <div className="row pt-3 pb-3 mb-5 border-bottom">
        <div className="col-7">
          <img
            src={Logo}
            height="40"
            alt="not Image"
          />
        </div>

        <div className="col-5">
          <p className="p-0 m-0 text-end">
            <b>Hotline: </b> {storeSettings?.phone}
          </p>
          <p className="p-0 m-0 text-end">
            <small>
              {storeSettings?.address?.street},{storeSettings?.address?.state}-
              {storeSettings?.address?.zip}
            </small>{" "}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 print-header-text">
          <p>
            <b>To</b>
            <br />
            {grn?.tpnNo?.warehouseFrom?.company} <br />
            {grn?.tpnNo?.warehouseFrom?.name} <br />
            {grn?.tpnNo?.warehouseFrom?.phone} <br />
            {grn?.tpnNo?.warehouseFrom?.address} <br />
          </p>

          <p>
            <b>Form</b> <br />
            {storeSettings?.storeName || "Aamar Dokan"} <br />
            {storeSettings?.email} <br />
            {storeSettings?.phone} <br />
            {storeSettings?.address?.state},{storeSettings?.address?.country}{" "}
            <br />
          </p>
        </div>
        <div className="col-6 text-end">
          <h4>{title}</h4>
          <span className="ps-6 d-block">
            <p>
              GRN No: {grn?.grnNo}
              <br />
              TPN No: {grn?.tpnNo?.tpnNo}
              <br />
              TPN Date:{" "}
              {grn?.createdAt &&
                format(new Date(grn?.createdAt), "yyyy-MM-dd")}{" "}
              <br />
              TPN Time:{" "}
              {grn?.createdAt && format(new Date(grn?.createdAt), "h:m:s aaa")}
              <br />
            </p>
            <p className="text-end bar-code">
              <Barcode value={grn?._id} height="60" width="2" fontSize="10" />
            </p>
          </span>
        </div>
      </div>
    </>
  );
};

export default GrnHeaderTpn;
