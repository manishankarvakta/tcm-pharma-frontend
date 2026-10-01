import React, { useEffect, useRef, useState } from "react";
import "./PrintReceipt.css";
import logo from "../../../logo.png";
import Barcode from "react-barcode";
import * as Icons from "heroicons-react";
import { useParams } from "react-router-dom";
import {
  itemVat,
  itemVatTotal,
  toDecimal,
} from "../../Utility/PosCalculations";
import { format } from "date-fns";
import { useSaleQuery } from "../../../services/saleApi";
import { notify } from "../../Utility/Notify";
import { useReactToPrint } from "react-to-print";

const PrintReceiptById = React.forwardRef(({ ...props }) => {
  const printContent = useRef();
  const { invoiceId } = props;
  const { id } = useParams();
  let invoice_id;
  if (id) {
    invoice_id = id;
  } else {
    invoice_id = invoiceId;
  }
  const [bill, setBill] = useState({});
  const { data, isSuccess } = useSaleQuery(invoice_id);
  const handlePrint = useReactToPrint({
    content: () => printContent.current,
    onAfterPrint: () => {
      notify("Bill Printed Successful!", "success");
    },
    // onBeforePrint: handleOnBeforeGetContent,
  });
  useEffect(() => {
    setBill(data);
  }, [isSuccess]);

  console.log(invoice_id);
  console.log(bill);
  const onClose = () => {
    window.opener = null;
    window.open("", "_self");
    window.close();
  };
  return (
    <div className="print-wrapper pt-5 mt-5">
      <div className="d-flex justify-content-center">
        <button className="btn btn-dark me-3" onClick={handlePrint}>
          <Icons.PrinterOutline className="me-2" size={18} /> Print Bill
        </button>
        <button className="btn btn-outline-dark" onClick={onClose}>
          <Icons.X className="me-2" size={18} />
          Cancle
        </button>
      </div>
      <div className=" print-area" ref={printContent}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <p className="text-center">
                <img src={logo} alt="" width="180" className="logo" />
              </p>
              <h5 className="text-center">
                <b> The Community Magasin</b>
              </h5>
              <p className="text-center info header">
                <i>BIN 004601696-0102 | Mushak 6.3</i>
              </p>
              <p className="text-center info invoice">
                Invoice No: {bill?.invoiceId}
              </p>
              <p className="info pt-2">
                Customer: {bill?.customerId?.phone}
                <span className="float-end">
                  Date:{" "}
                  {bill?.createdAt &&
                    format(new Date(bill?.createdAt), "MM-dd-yyyy")}
                </span>
              </p>
              <p className="info pt-2">
                Biller: {bill?.billerId?.name}
                <span className="float-end">
                  Outlet: <b>TCM Model Pharmacy</b>
                </span>
              </p>

              <p className="text-center pt-2 order_details">ORDER DETAILS</p>
              <table className="table px-2 d-flex-table">
                <thead>
                  <tr>
                    <td colSpan="3">Item</td>
                    <td>Qty</td>
                    <td>Rate</td>
                    <td>VAT</td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  {/* {console.log(bill.products)} */}
                  {bill?.products ? (
                    bill?.products.map((item) =>
                      item ? (
                        <tr className="d-print-table-row" key={item.id}>
                          <td
                            colSpan="3"
                            style={{
                              textTransform: "capitalize",
                              fontSize: ".7em",
                            }}
                          >
                            {item?.name.toLowerCase().substring(0, 30)}
                            {item?.name.length > 30 ? "..." : ""}
                          </td>
                          <td>{item?.qty}</td>
                          <td>{item?.mrp}</td>
                          <td>
                            {itemVat(
                              item?.qty && item?.vat,
                              item?.qty,
                              item?.mrp
                            ).toFixed(2)}
                          </td>
                          <td>
                            <span className="float-end">
                              {itemVatTotal(
                                item?.vat,
                                item?.qty,
                                item?.mrp
                              ).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="7">Loading ...</td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="7">Loading ...</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className="bill-info">
                Total Item: <span className="float-end">{bill?.totalItem}</span>
              </p>
              <p className="bill-info">
                Total:{" "}
                <span className="float-end">
                  {parseFloat(bill?.total)?.toFixed(2)}
                </span>
              </p>
              <p className="bill-info">
                Discount: <span className="float-end">{bill?.discount}</span>
              </p>
              <p className="bill-info">
                Vat:{" "}
                <span className="float-end">
                  {parseFloat(bill?.vat).toFixed(2)}
                </span>
              </p>
              <p className="bill-info">
                Gross Total:{" "}
                <span className="float-end">
                  {parseFloat(bill?.grossTotal)?.toFixed(2)}
                </span>
              </p>
              <p className="bill-info">
                Gross Total (Rounding):
                <span className="float-end">{bill?.grossTotalRound}</span>
              </p>
              <p className="bill-info">
                Received Amount: [{bill?.paidAmount?.cash !== 0 && "Cash"}
                {bill?.paidAmount?.card[1] !== 0 &&
                  " | " + bill?.paidAmount?.card[0]}
                {bill?.paidAmount?.mfs[1] !== 0 &&
                  " | " + bill?.paidAmount?.mfs[0]}{" "}
                ]<span className="float-end">{bill?.totalReceived}</span>
              </p>
              <p className="bill-info">
                Change Amount:{" "}
                <span className="float-end">{bill?.changeAmount}</span>
              </p>
              <p className="bill-info text-center">
                Previous Point: {bill?.point?.old} | New Point :
                {bill?.point?.new}
              </p>
              <p className="nb">
                N.B: <i>Sold products will not be returned after 24 hours</i>
              </p>
              <p className="text-center bar-code">
                {bill?.invoiceId && (
                  <Barcode
                    value={bill?.invoiceId}
                    height="60"
                    width="2"
                    fontSize="10"
                  />
                )}
              </p>
              <p className="text-center info footer">www.tcm-bd.com</p>
              <p className="text-center info">
                <b>Hot Line: 01742225636</b>
              </p>
              <p className="text-center info ">
                <i>Thank you for shopping with us.</i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PrintReceiptById;
