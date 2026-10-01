/* eslint-disable react-hooks/exhaustive-deps */
import * as Icons from "heroicons-react";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import powered from "../../../../logo-dark.svg";
import { signInUser } from "../../../Utility/Auth";

import { useDispatch, useSelector } from "react-redux";
import {
  saleCardAmount,
  saleCardName,
  saleCash,
  saleMfsAmount,
  saleMfsName,
  salePointAmount,
  salesAmountRecived,
  selcetBiller,

  // saleDiscountPercent,
  selecetDisPercent,
  selecetDisTaka,
} from "../../../../features/posSlice";
import { notify } from "../../../Utility/Notify";

const PosFinalizes = React.forwardRef(
  ({
    customer,
    handlePrintBill,
    billPrintButton,
    returnCal,
    returnProducts,
    discountCheckbox,
    isBill,
    setBill,
  }) => {
    const dispatch = useDispatch();
    const saleCal = useSelector((state) => state.posReducer);
    const user = signInUser();

    const [cashRe, setCashRe] = useState(0);
    const [profit, setProfit] = useState(0);
    const [profitPercent, setProfitPercent] = useState(0);

    // console.log(saleCal?.products?.length);

    const checkCOGS = () => {
      let profit = 0;
      let total = 0;
      let totalMrp = 0;
      let profitPercent = 0;
      let cashReceived = 0;
      saleCal?.products.map((pro) => {
        profit = profit + (pro.qty * pro.mrp - pro.qty * pro.tp);
        total = total + pro.qty * pro.tp;
        totalMrp = totalMrp + pro.qty * pro.mrp;
      });
      if (profit > 0) {
        profitPercent = ((totalMrp - total) / total) * 100;
      }
      cashReceived = totalMrp - saleCal?.discount;
      setCashRe(cashReceived);
      setProfit(profit);
      // console.log(profit)
      // console.log(total)
      // console.log(profitPercent)
      setProfitPercent(profitPercent);
    };

    useEffect(() => {
      checkCOGS();
    }, [saleCal?.products]);
    /**
     * TOTAL CALCULATIONS
     */
    const totalCalculation = () => {
      const cash = saleCal?.paidAmount.cash;
      const usePointAmount = saleCal?.paidAmount.point;
      const mfs = saleCal?.paidAmount.mfs.amount;
      const card = saleCal?.paidAmount.card.amount;
      const promo_discount = saleCal?.promo_discount;
      const totalRecivedAmount =
        parseInt(cash) +
        parseInt(card) +
        parseInt(mfs) +
        parseInt(usePointAmount);
      const changeAmount =
        parseInt(totalRecivedAmount) -
        parseInt(saleCal?.grossTotalRound) +
        parseInt(saleCal?.discount);

      // console.log(promo_discount);
      dispatch(selcetBiller(user.id));
      dispatch(salesAmountRecived({ totalRecivedAmount, changeAmount }));
    };

    useEffect(() => {
      totalCalculation();
    }, [
      saleCal?.paidAmount.cash,
      saleCal?.paidAmount.point,
      saleCal?.paidAmount.mfs.amount,
      saleCal?.paidAmount.card.amount,
      saleCal?.discount,
      saleCal?.products,
      saleCal?.grossTotalRound,
    ]);

    // console.log(saleCal?.returnCal);

    const handlePercentageDiscount = (e) => {
      console.log(e.target.value);
      if (profitPercent >= e.target.value) {
        dispatch(selecetDisPercent(e.target.value));
      } else {
        notify("Discount exceeds profit", "error");
      }
    };

    // Taka dis
    const handleTakaDiscount = (e) => {
      if (e.target.value < profit) {
        dispatch(
          selecetDisTaka(parseInt(e.target.value > 0 ? e.target.value : 0))
        );
      } else {
        notify("Discount exceeds profit", "error");
      }
    };

    const handleCashReceived = (e) => {
      dispatch(saleCash(e.target.value > 0 ? e.target.value : 0));
    };
    return (
      <div className="card sticky-md-top">
        <div className="card-body mb-0 ">
          <h5 className="card-title">Finalize Sale</h5>
          <hr />
          <form id="finalizeForm" onSubmit={handlePrintBill}>
            <p className="card-text">
              <span className="">
                <b>Total Qty: </b> {saleCal?.totalItem}
              </span>
              <span className="float-end">
                <b>Total Item: </b> {saleCal?.products?.length}
              </span>
            </p>
            {saleCal?.returnCal?.totalItem > 0 && (
              <p className="card-text">
                <b>Return Item: </b>{" "}
                <span className="float-end">
                  {" "}
                  {parseFloat(saleCal?.returnCal.totalItem)?.toFixed(2)}
                </span>
              </p>
            )}

            <p className="card-text">
              <b>Total: </b>
              <span className="float-end">
                {" "}
                {parseFloat(saleCal?.total).toFixed(2)}
                BDT
              </span>
            </p>
            {saleCal?.returnCal?.total > 0 && (
              <p className="card-text">
                <b>Return Total: </b>
                <span className="float-end">
                  {" "}
                  {parseFloat(saleCal?.returnCal.total).toFixed(2)}BDT
                </span>
              </p>
            )}
            {/* <p className="card-text">
            <b>Discount Amount: </b>{" "}
            <span className="float-end"> {sales.discount} BDT</span>
          </p> */}
            {/* <p className="card-text">
              <b>Vat/Tax Amount: </b>{" "}
              <span className="float-end">
                {" "}
                {parseFloat(saleCal?.vat - saleCal?.returnCal.vat)?.toFixed(2)}
                BDT
              </span>
            </p> */}
            <p className="card-text">
              <b>Gross Total: </b>
              <span className="float-end">
                {parseFloat(saleCal?.grossTotal)?.toFixed(2)}
                BDT
              </span>
            </p>
            <p className="card-text">
              <b>Gross Total(Round): </b>
              <b>
                <span className="float-end fs-5">
                  {parseFloat(saleCal?.grossTotalRound)?.toFixed(2)}
                  BDT
                </span>
              </b>
            </p>
            <div className="card-text align-middle">
              <div className="row">
                <div className="col-md-6">
                  <b>Cash Received: </b>
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    onChange={(e) => handleCashReceived(e)}
                    id="cashAmount"
                    defaultValue={0}
                    min={0}
                    value={saleCal?.paidAmount.cash}
                    className="form-control float-end col-7"
                  />
                </div>
              </div>
            </div>
            <div className="card-text align-middle py-2">
              <div className="row">
                <div className="col-md-3">
                  <b>Card: </b>
                </div>
                <div className="col-md-5">
                  <Form.Select
                    name="cardType"
                    onChange={(e) => dispatch(saleCardName(e.target.value))}
                    id="cardType"
                    aria-label="Default select example"
                  >
                    <option value="Visa" selected>
                      Visa
                    </option>
                    <option value="Master"> Master </option>
                    <option value="Amex"> Amex </option>
                    <option value="Citymax"> Citymax </option>
                    <option value="DBBL Nexus"> DBBL Nexus </option>
                    <option value="Union Pay"> Union Pay </option>
                    <option value="LankaBangla"> LankaBangla </option>
                    <option value="IPDC card"> IPDC card </option>
                    <option value="NPSB card"> NPSB card </option>
                  </Form.Select>
                </div>
                <div className="col-md-4 mt-2 mt-md-0">
                  <input
                    type="number"
                    defaultValue={0}
                    onChange={(e) =>
                      dispatch(
                        saleCardAmount(
                          parseInt(e.target.value > 0 ? e.target.value : 0)
                        )
                      )
                    }
                    min={0}
                    value={saleCal?.paidAmount.card.amount}
                    name="cardAmount"
                    id="cardAmount"
                    className="form-control float-end col-12"
                  />
                </div>
              </div>
            </div>
            <div className="card-text align-middle">
              <div className="row">
                <div className="col-md-3">
                  <b>MFS: </b>
                </div>
                <div className="col-md-5">
                  <Form.Select
                    name="mfsName"
                    onChange={(e) => dispatch(saleMfsName(e.target.value))}
                    id="mfsName"
                    aria-label="Default select example"
                  >
                    <option value="bKash"> Bkash</option>
                    <option value="Nagad"> Nagad </option>
                    <option value="Upay"> Upay </option>
                    <option value="Rocket"> Rocket</option>
                    <option value="Okwallet"> Okwallet</option>
                    <option value="M-cash"> M-cash</option>
                    <option value="Citytouch"> Citytouch </option>
                    <option value="Dmoney"> Dmoney </option>
                    <option value="I-pay"> I-pay</option>
                    <option value="Q-Cash"> Q-Cash</option>
                    <option value="Sure Cash"> Sure Cash</option>
                  </Form.Select>
                </div>
                <div className="col-md-4 mt-2 mt-md-0">
                  <input
                    type="number"
                    id="mfsAmount"
                    defaultValue={0}
                    onChange={(e) =>
                      dispatch(
                        saleMfsAmount(e.target.value > 0 ? e.target.value : 0)
                      )
                    }
                    value={saleCal?.paidAmount.mfs.amount}
                    name="mfsAmount"
                    className="form-control float-end col-12"
                  />
                </div>
              </div>
            </div>
            {saleCal?.point.old > 100 && (
              <div className="card-text align-middle">
                <div className="row">
                  <div className="col-md-4">
                    <b>Use Point: </b>
                  </div>
                  <div className="col-md-4">{saleCal?.point.old}</div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      onChange={(e) =>
                        e.target.value <= saleCal?.point.old &&
                        dispatch(
                          salePointAmount(
                            e.target.value > 0 ? e.target.value : 0
                          )
                        )
                      }
                      id="pointAmount"
                      defaultValue={0}
                      min={0}
                      max={saleCal?.point.old}
                      value={saleCal?.paidAmount.point}
                      className="form-control float-end col-7"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* <p className="card-text align-middle">
              <div className="row">
                <div className="col-md-6">
                  <b> */}
            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check
                        type="checkbox"
                        label="Discount: % "
                      // onChange={discountCheckbox}
                      // checked={discountChecked}
                      />
                    </Form.Group> */}
            {/* <Form.Label>Discount: % </Form.Label>
                  </b>
                </div>
                <div className="col-md-6">
                  <input
                    // disabled={discountChecked === false && "disabled"}
                    type="number"
                    onChange={(e) =>
                      dispatch(
                        saleDiscountPercent(
                          parseInt(e.target.value > 0 ? e.target.value : 0)
                        )
                      ) */}
            {/* }
                    id="discount"
                    defaultValue={0}
                    min={0}
                    value={saleCal?.discountPercent}
                    className="form-control float-end col-7"
                  />
                </div>
              </div>
            </p> */}

            <div className="card-text align-middle py-2">
              <div className="row">
                <div className="col-md-6">
                  <b>
                    <Form.Label>Discount: (%)</Form.Label>
                  </b>
                </div>
                <div className="col-md-6">
                  <input
                    // disabled={discountChecked === false && "disabled"}
                    type="number"
                    onChange={(e) => handlePercentageDiscount(e)}
                    id="discountField"
                    defaultValue={0}
                    min={0}
                    value={Math.ceil(saleCal?.disPercent)}
                    className="form-control float-end col-7"
                  />
                </div>
              </div>
            </div>
            <div className="card-text align-middle">
              <div className="row">
                <div className="col-md-6">
                  <b>
                    <Form.Label>Discount: (in Tk)</Form.Label>
                  </b>
                </div>
                <div className="col-md-6">
                  <input
                    // disabled={discountChecked === false && "disabled"}
                    type="number"
                    onChange={(e) => handleTakaDiscount(e)}
                    id="discountCashField"
                    defaultValue={0}
                    min={0}
                    value={Math.ceil(saleCal?.discount)}
                    className="form-control float-end col-7"
                  />
                </div>
              </div>
            </div>
            {/* {console.log(saleCal?.point)} */}
            <p className="card-text">
              <b>Change Amount: </b>{" "}
              <b>
                {" "}
                <span className="float-end fs-5">
                  {saleCal?.changeAmount?.toFixed(2) }
                  BDT
                </span>
              </b>
            </p>

            {/* {customer !== "62e301c1ee6c8940f6ac1515" && ( */}
            {/* <p className="card-text">
              <span className="float-start">
                <b>Old Point: </b>
                {saleCal?.point.old}
              </span>
              <span className="float-end">
                <b>New Point: </b>
                {saleCal?.point.new}
              </span>
            </p> */}
            {/* )} */}

            <br />
            <hr />
            <p className="text-center">
              {saleCal?.products?.length > 0 || returnProducts?.length > 0 ? (
                <button
                  ref={billPrintButton}
                  className="btn btn-dark btn-block "
                  id="billPrintButton"
                  type="submit"
                  disabled={isBill}
                >
                  <Icons.PrinterOutline className="me-2" size={18} /> Print Bill
                </button>
              ) : (
                <button className="btn btn-dark btn-block " disabled>
                  <Icons.PrinterOutline className="me-2" size={18} /> Print Bill
                </button>
              )}
            </p>
          </form>
        </div>
        <div className="card-footer">
          <div className="text-center">
            <span
              className="text-sm"
              style={{ fontSize: "12px", color: "#6c757d" }}
            >
              Powered by:
            </span>
            <Link to="https://techsoulbd.com/">
              <img src={powered} height="25" alt="" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

export default PosFinalizes;
