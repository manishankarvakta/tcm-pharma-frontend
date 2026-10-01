import React, { useEffect, useRef, useState } from "react";
import "./PrintReceipt.css";
import logo from "../../../logo.png";
import logo1 from "../../../FINAL_LOGO.jpg";
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
  console.log(id);
  let invoice_id;
  if (id) {
    invoice_id = id;
  } else {
    invoice_id = invoiceId;
  }
  const [bill, setBill] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [delivery, setDelivery] = useState(false);
  const { data, isSuccess } = useSaleQuery(invoice_id);
  console.log(data);
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
  useEffect(() => {
    if (data?.delivery) {
      setDelivery(true);
      setDeliveryAddress(
        data?.delivery?.address ? data?.delivery?.address : ""
      );
      setDeliveryPhone(data?.delivery?.phone ? data?.delivery?.phone : "");
    }
  }, [data]);

  // console.log(invoice_id);
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
                <img src={logo1} alt="" width="180" className="logo" />
              </p>
              <h5 className="text-center">
                <b> TCM Model Pharmacy</b>
              </h5>
              <p className="text-center info header">
                <i>BIN 004601696-0102 | Mushak 6.3</i>
              </p>
              <p className="text-center info invoice">
                <b>Invoice No: {bill?.invoiceId}</b>
              </p>
              {/* {console.log(bill?.customerId)} */}
              <p className="info pt-2">
                Phone: {bill?.customerId?.phone}
                <span className="float-end">
                  Date:{" "}
                  {bill?.createdAt &&
                    format(new Date(bill?.createdAt), "MMMM d, yyyy")}
                </span>
              </p>
              <p className="info pt-2">Customer: {bill?.customerId?.name} </p>
              <p className="info pt-2">
                Biller: {bill?.billerId?.name}
                <span className="float-end">
                  Outlet: <b>TCM Model Pharmacy</b>
                </span>
              </p>
              {delivery && (
                <>
                  <p className="info pt-2">
                    Delivery Address:{deliveryAddress}
                  </p>
                  <p className="info pt-2">Delivery Phone:{deliveryPhone}</p>
                </>
              )}

              <p className="text-center pt-2 order_details">ORDER DETAILS</p>
              <table className="table px-2 d-flex-table">
                <thead>
                  <tr>
                    <td>SL</td>
                    <td colSpan="3">Item</td>
                    <td>Qty</td>
                    <td>Rate</td>
                    <td>VAT</td>
                    <td>Discount</td>
                    <td>
                      <span className="float-end">Total</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {/* {console.log(bill.products)} */}
                  {bill?.products ? (
                    bill?.products.map((item, i) => (
                      <tr className="d-print-table-row" key={item.id}>
                        <td>{i + 1}</td>
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
                          <span>{item?.discount}</span>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No Product in Purchase cart</td>
                    </tr>
                  )}
                  {bill?.returnProducts?.length > 0 && (
                    <>
                      <tr>
                        <th colSpan={3}>
                          <b>Return Products</b>
                        </th>
                        {bill?.returnInvoice?.invoiceId ? (
                          <td colSpan={5} className="text-end">
                            <b>Ref Invoice id:</b>
                            {bill?.returnInvoice?.invoiceId}
                          </td>
                        ) : (
                          <td colSpan={5} className="text-end">
                            <b>Void Return</b>
                          </td>
                        )}
                      </tr>
                      {bill?.returnProducts?.map((item) => (
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
                            {/* {itemVat(
                              item?.qty && item?.vat,
                              item?.qty,
                              item?.mrp
                            ).toFixed(2)} */}{" "}
                            -
                          </td>
                          <td>
                            <span className="float-end">
                              {(item?.qty * item?.mrp).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
              <p className="bill-info border-bottom border-bottom-dashed">
                Total Item:{bill?.products?.length}
                <span className="float-end">Total Qty:{bill?.totalItem}</span>
              </p>
              {bill?.returnCal?.totalItem > 0 && (
                <p className="bill-info border-bottom border-bottom-dashed">
                  Return Item:
                  <span className="float-end">
                    {bill?.returnCal?.totalItem}
                  </span>
                </p>
              )}
              <p className="bill-info border-bottom border-bottom-dashed">
                Total:
                <span className="float-end">
                  {parseFloat(bill?.total)?.toFixed(2)}
                </span>
              </p>
              {bill?.returnCal?.total > 0 && (
                <p className="bill-info border-bottom border-bottom-dashed">
                  Return Total:{" "}
                  <span className="float-end">
                    {bill?.returnCal?.total?.toFixed(2)}
                  </span>
                </p>
              )}
              <p className="bill-info border-bottom border-bottom-dashed">
                Due Adjustment:{" "}
                <span className="float-end">-{bill?.discount}</span>
              </p>
              {/* {bill?.promo_discount > 0 && (
                <p className="bill-info">
                  Promo Discount:{" "}
                  <span className="float-end">-{bill?.promo_discount}</span>
                </p>
              )} */}

              {/* <p className="bill-info border-bottom border-bottom-dashed">
                Vat:{" "}
                <span className="float-end">
                  +
                  {(
                    bill?.vat -
                    (bill?.returnCal?.vatAmount > 0 &&
                      bill?.returnCal?.vatAmount)
                  )?.toFixed(2)}
                </span>
              </p> */}
              {/* <p className="bill-info border-bottom border-bottom-dashed">
                Gross Total:{" "}
                <span className="float-end">
                  {bill?.returnCal?.grossTotal > 0 ? bill?.returnCal?.grossTotal : (parseFloat(
                    bill?.grossTotal -
                    (bill?.returnCal?.grossTotal > 0 &&
                      bill?.returnCal?.grossTotal)
                  )?.toFixed(2))}
                  {/* {parseFloat(
                    bill?.grossTotal -
                    (bill?.returnCal?.grossTotal > 0 &&
                      bill?.returnCal?.grossTotal)
                  )?.toFixed(2)} */}
              {/* </span>
              </p> */}
              <p className="bill-info border-bottom border-bottom-dashed">
                Net Amount:
                <b>
                  <span className="float-end border border-dark px-1">
                    {bill?.returnCal?.grossTotalRound > 0
                      ? bill?.returnCal?.grossTotalRound
                      : parseFloat(
                          bill?.grossTotalRound -
                            (bill?.returnCal?.grossTotalRound > 0 &&
                              bill?.returnCal?.grossTotalRound) -
                            parseFloat(bill?.discount)
                        )?.toFixed(2)}
                    {/* {parseFloat(
                    bill?.grossTotalRound -
                    (bill?.returnCal?.grossTotalRound > 0 &&
                      bill?.returnCal?.grossTotalRound)
                  )?.toFixed(2)} */}
                  </span>
                </b>
              </p>
              {/* {bill?.paidAmount?.cash > 0 && (
                <p className="bill-info border-bottom border-bottom-dashed">
                  Received Cash:
                  <span className="float-end">{bill?.paidAmount?.cash}</span>
                </p>
              )} */}
              {/* {bill?.paidAmount?.card?.amount > 0 && (
                <p className="bill-info">
                  Received{" "}
                  {bill?.paidAmount?.card?.name
                    ? bill?.paidAmount?.card?.name
                    : "Visa"}{" "}
                  Card :
                  <span className="float-end">
                    {bill?.paidAmount?.card.amount}
                  </span>
                </p>
              )} */}
              {/* {bill?.paidAmount?.mfs?.amount > 0 && (
                <p className="bill-info border-bottom border-bottom-dashed">
                  Received {bill?.paidAmount?.mfs?.name}:
                  <span className="float-end">
                    {bill?.paidAmount?.mfs?.amount}
                  </span>
                </p>
              )} */}
              {/* {bill?.paidAmount?.point > 0 && (
                <p className="bill-info border-bottom border-bottom-dashed">
                  Received Point:
                  <span className="float-end">{bill?.paidAmount?.point}</span>
                </p>
              )} */}

              <p className="bill-info border-bottom border-bottom-dashed">
                Total Received:
                <span className="float-end">{bill?.totalReceived}</span>
              </p>
              <p className="bill-info border-bottom border-bottom-dashed">
                Change Amount:{" "}
                <span className="float-end">{bill?.changeAmount}</span>
              </p>
              {/* <p className="bill-info text-center ">
                Previous Point: {bill?.point?.old} | New Point :
                {bill?.point?.new}
              </p> */}
              <p className="nb">
                বিঃদ্রঃ <br />
                ১. তাপ সংবেদনশীল সকল ঔষধ, সুগার টেস্ট স্ট্রিপ এবং ঔষধের কাটা
                পাতা অফেরতযোগ্য। <br />
                ২. ঔষধ ক্রয়ের সময় নিজ দায়িত্বে ঔষধের পরিমাণ এবং মেয়াদ
                উত্তীর্ণ তারিখ দেখে নিন।
                <br />
                ৩. ক্রয় কৃত পণ্য ৪৮ ঘণ্টার মধ্যে পরিবর্তনযোগ্য এবং সেলস স্লিপ
                সাথে আনতে হবে। <br />
                ******************************ধন্যবাদ******************************
              </p>
              {/* <p className="text-center bar-code">
                {bill?.invoiceId && (
                  <Barcode
                    value={bill?.invoiceId}
                    height="60"
                    width="2"
                    fontSize="10"
                  />
                )}
              </p> */}
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
