// import axios from "../../services/apiClient";
// import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
import Barcode from "react-barcode";
import Logo from "../../logo_pharma.jpg";

const AccountHeader = ({ account, format, title }) => {
  // console.log(account);
  return (
    <>
      <div className="row pt-3 pb-3 mb-5 border-bottom">
        <div className="col-7">
          <img src={Logo} height="70" alt="not Image" className="print-logo" />
        </div>

        <div className="col-5">
          <p className="p-0 m-0 text-end">
            <b>Hotline: </b> 01739921850
          </p>
          <p className="p-0 m-0 text-end">
            <small>H#6, R#27, Sector 7, Uttara, Dhaka - 1230</small>{" "}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 print-header-text">
          {account?.supplier ? (
            <p>
              <b>To</b>
              <br />
              Company : {account?.supplier?.company} <br />
              Name: {account?.supplier?.name} <br />
              Email: {account?.supplier?.email} <br />
              Phone: {account?.supplier?.phone} <br />
              Address: {account?.supplier?.address} <br />
            </p>
          ) : (
            <></>
          )}

          <p>
            <b>Form</b> <br />
            The Community Magasin <br />
            communitymagasin@gmail.com <br />
            +880 1747-563337
            <br />
            Uttara, Dhaka - 1230 <br />
          </p>
        </div>
        <div className="col-6 text-end">
          <h4>{title}</h4>
          <span className="ps-6 d-block">
            <p>
              Account No: {account?.acId}
              <br />
              {/* PO No: {account?.poNo?.poNo} */}
              {/* <br /> */}
              Account Date:{" "}
              {account?.createdAt &&
                format(new Date(account?.createdAt), "yyyy-MM-dd")}{" "}
              <br />
              Account Time:{" "}
              {account?.createdAt &&
                format(new Date(account?.createdAt), "h:m:s aaa")}
              <br />
              Account Head: {account?.accountHead?.name}
              <br />
            </p>
            <p className="text-end bar-code">
              <Barcode
                value={account?._id}
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

export default AccountHeader;
