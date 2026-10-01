import axios from "../../services/apiClient";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Barcode from "react-barcode";
import Logo from "../../logo.svg";
import { signInUser } from "../Utility/Auth";

const AdjustHeader = ({ adjust, format, title }) => {
  const auth = signInUser();
  const {  storeSettings } = auth;
  // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // const [supplier, setSupplier] = useState({});
  // const getSupplier = async () => {
  //   await axios
  //     .get(`${BASE_URL}supplier/${grn?.supplier}`)
  //     .then((response) => setSupplier(response.data));
  // };
  // useEffect(() => {
  //   getSupplier();
  // }, [grn]);
  // console.log(grn?.supplier?.name);
  console.log(adjust);
  return (
    <>
      <div className="row pt-3 pb-3 mb-5 border-bottom">
        <div className="col-7">
          <img src={Logo} height="40" alt="not Image" />
        </div>

        <div className="col-5">
          <p className="p-0 m-0 text-end">
            <b>Hotline: </b> 01332553955
          </p>
          <p className="p-0 m-0 text-end">
            <small>H#6, R#27, Sector 7, Uttara, Dhaka - 1230</small>{" "}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 print-header-text">
          <p>
            <b>Form</b> <br />
            {storeSettings?.storeName || "No-Name"} <br />
            {storeSettings?.address?.street || "No-Street"} ,
            {storeSettings?.address?.city || "No-City"}, 
            {storeSettings?.address?.state || "No-State"}, 
            {storeSettings?.address?.post || "No-PostalCode"}, ,
          </p>
        </div>
        <div className="col-6 text-end">
          <h4>{title}</h4>
          <span className="ps-6 d-block">
            <p>
              Adjust No: {adjust?.adjustNo}
              <br />
              Adjust Date:{" "}
              {adjust?.createdAt &&
                format(new Date(adjust?.createdAt), "yyyy-MM-dd")}{" "}
              <br />
              Adjust Time:{" "}
              {adjust?.createdAt &&
                format(new Date(adjust?.createdAt), "h:m:s aaa")}
              <br />
            </p>
            <p className="text-end bar-code">
              <Barcode
                value={adjust?._id}
                height="60"
                width="2"
                fontSize="10"
              />
            </p>
          </span>
        </div>
      </div>
    </>
  );
};

export default AdjustHeader;
