import React, { useEffect, useState } from "react";
import "./PrintReceipt.css";
import logo from "../../../logo.png";
import Barcode from "react-barcode";
import { useParams } from "react-router-dom";
import {
  itemVat,
  itemVatTotal,
  toDecimal,
} from "../../Utility/PosCalculations";
import { format } from "date-fns";
import { User } from "heroicons-react";

const PrintReceipt = React.forwardRef(({ ...props }, ref) => {
  const { saleData, sales } = props;

  const [bill, setBill] = useState({});

  useEffect(() => {
    setBill(saleData);
  }, [saleData]);

  // console.log(bill);
  return (
    <div className="print-wrapper pt-5 mt-5">
      <div className=" print-area" ref={ref}>
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
                Invoice No: {bill.invoiceId}
              </p>
              <p className="info pt-2">
                Customer: {bill?.customerName}
                <span className="float-end">
                  {/* Date: {format(new Date(bill?.createdAt), "mm-dd-yyyy")} */}
                </span>
              </p>
              <p className="info pt-2">
                Biller: {bill?.billerName}
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
                  {bill.products ? (
                    bill.products.map((item) =>
                      item ? (
                        <tr className="d-print-table-row" key={item._id}>
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
                Total:{" "}
                <span className="float-end">
                  {parseFloat(bill?.total).toFixed(2)}
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
                  {parseFloat(bill?.total).toFixed(2)}
                </span>
              </p>
              <p className="bill-info">
                Gross Total (Rounding):{" "}
                <span className="float-end">{Math.round(bill?.total)}</span>
              </p>
              <p className="bill-info">
                Received Amount: [{bill?.paid_amount?.cash !== 0 && "Cash"}
                {bill?.paid_amount?.card[1] !== 0 &&
                  " | " + bill?.paid_amount?.card[0]}
                {bill?.paid_amount?.mfs[1] !== 0 &&
                  " | " + bill?.paid_amount?.mfs[0]}{" "}
                ]<span className="float-end">{bill?.total_received}</span>
              </p>
              <p className="bill-info">
                Change Amount:{" "}
                <span className="float-end">{bill?.change_amount}</span>
              </p>

              <p className="nb">
                N.B: <i>Sold products will not be returned after 24 hours</i>
              </p>
              <p className="text-center bar-code">
                <Barcode
                  value={bill?.invoiceId}
                  height="60"
                  width="2"
                  fontSize="10"
                />
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

export default PrintReceipt;
