import React, { useEffect, useState } from "react";
import * as Icons from "heroicons-react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import powered from "../../../../logo-dark.png";
import { posFinalizer } from "../../../Utility/PosCalculations";

import {
  saleFinalize,
  saleCashReceived,
  saleCard,
  saleCardAmount,
  saleMfsName,
  saleMfsAmount,
  totalReceived,
  salePointAmount,
  totalChangeAmount,
} from "../../../../features/salesSlice";
import { useDispatch, useSelector, useStore } from "react-redux";

const PosFinalizes = React.forwardRef(
  ({
    customer,
    restPoint,
    handlePrintBill,
    setPosCalculations,
    carts,
    billPrintButton,
    customerPoint,
    reCal,
  }) => {
    const dispatch = useDispatch();
    const saleCal = useSelector((state) => state.salesReducer.saleFinalize);
    const productCart = useSelector((state) => state.salesReducer.products);
    const saleCardAmo = useSelector((state) => state.salesReducer.amountCard);
    const saleMfsAmo = useSelector((state) => state.salesReducer.mfsAmount);

    const totalChangeAmountSelector = useSelector(
      (state) => state.salesReducer.changeAmount
    );
    const pointAmountSelector = useSelector(
      (state) => state.salesReducer.pointAmount
    );
    const cashReceivedShow = useSelector(
      (state) => state.salesReducer.cashReceived
    );

    // console.log(saleCardAmo, saleMfsAmo, cashReceivedShow);
    // console.log("changeAmount", totalChangeAmountSelector);

    // console.log("REDUX", productCart);
    // console.log("cARTS", saleCal);

    // pos sales
    const handelReceivedCashAmount = (e) => {
      const cash = parseInt(e.target.value);
      dispatch(saleCashReceived({ cashReceived: cash }));
      // console.log("cash:", cash)
    };
    // pos sales
    const handelPointAmount = (e) => {
      const pointCash = parseInt(e.target.value);
      if (pointCash <= customerPoint) {
        dispatch(salePointAmount({ pointAmount: pointCash }));
      }
      // console.log("pointAmount:", pointAmount);
    };

    // handle handelReceivedCardAmount
    const handelReceivedCardAmount = (e) => {
      const card = parseInt(e.target.value);
      dispatch(saleCardAmount({ amountCard: card }));
      // console.log("card:", card)
    };

    const handelReceivedMFSAmount = (e) => {
      const mfs = parseInt(e.target.value);
      dispatch(saleMfsAmount({ Mfs: mfs }));
      // console.log("mfs:", mfs);
    };

    const handelReceivedCardType = (e) => {
      const cardType = e.target.value;
      dispatch(saleCard({ cardName: cardType }));
    };

    const handelReceivedMfsName = (e) => {
      const mfsName = e.target.value;
      dispatch(saleMfsName({ MfsName: mfsName }));
    };
    // console.log(pointAmountSelector.pointAmount);

    const pointCalculation = () => {
      // customerPoint
      const usePointAmount = pointAmountSelector?.pointAmount
        ? pointAmountSelector.pointAmount
        : 0;
      const posTotalAmount = saleCal?.grossTotalRound
        ? saleCal?.grossTotalRound
        : 0;

      const newPoint =
        saleCal?.grossTotalRound && saleCal?.grossTotalRound / 100;
    };

    const totalCalculation = () => {
      const cash = cashReceivedShow.cashReceived
        ? cashReceivedShow.cashReceived
        : 0;
      const usePointAmount = pointAmountSelector?.pointAmount
        ? pointAmountSelector.pointAmount
        : 0;
      const card = saleMfsAmo?.Mfs ? saleMfsAmo.Mfs : 0;
      const mfs = saleCardAmo?.amountCard ? saleCardAmo.amountCard : 0;
      const totalRecivedAmount = cash + card + mfs + usePointAmount;
      // totalReceived
      console.log(
        "total recieved",
        cashReceivedShow.cashReceived,
        saleMfsAmo.Mfs,
        saleCardAmo.amountCard,
        pointAmountSelector.pointAmount
      );

      console.log("total received", totalRecivedAmount);
      console.log("total received", saleCal.grossTotalRound);
      dispatch(
        totalReceived({
          totalReceivedAmount: totalRecivedAmount,
        })
      );
      dispatch(
        totalChangeAmount({
          totalChangeAmount: totalRecivedAmount - saleCal.grossTotalRound,
        })
      );
    };

    useEffect(() => {
      totalCalculation();
    }, [
      cashReceivedShow.cashReceived,
      saleMfsAmo.Mfs,
      saleCardAmo.amountCard,
      saleCal.grossTotalRound,
      pointAmountSelector.pointAmount,
    ]);

    useEffect(() => {
      const cal = posFinalizer(productCart);
      setPosCalculations(cal);
      dispatch(
        saleFinalize({
          totalItem: cal[0],
          total: cal[1],
          vatAmount: cal[2],
          grossTotal: cal[3],
          grossTotalRound: cal[4],
        })
      );
      // console.log(cal);
    }, [productCart]);

    // console.log(reCal);

    return (
      <div className="card sticky-md-top">
        <div className="card-body mb-2 ">
          <h5 className="card-title">Finalize Sale</h5>
          <hr />
          <form id="finalizeForm" onSubmit={handlePrintBill}>
            <p className="card-text">
              <b>Total Item: </b>{" "}
              <span className="float-end"> {saleCal.totalItem}</span>
            </p>
            {reCal?.totalItem > 0 && (
              <p className="card-text">
                <b>Return Item: </b>{" "}
                <span className="float-end"> {reCal.totalItem}</span>
              </p>
            )}

            <p className="card-text">
              <b>Total: </b>
              <span className="float-end">
                {" "}
                {parseFloat(saleCal.total).toFixed(2)}
                BDT
              </span>
            </p>
            {reCal?.total > 0 && (
              <p className="card-text">
                <b>Return Total: </b>
                <span className="float-end"> {reCal.total}BDT</span>
              </p>
            )}
            {/* <p className="card-text">
            <b>Discount Amount: </b>{" "}
            <span className="float-end"> {sales.discount} BDT</span>
          </p> */}
            <p className="card-text">
              <b>Vat/Tax Amount: </b>{" "}
              <span className="float-end">
                {" "}
                {(
                  saleCal?.vatAmount - (reCal.vatAmount > 0 && reCal.vatAmount)
                )?.toFixed(2)}
                BDT
              </span>
            </p>
            <p className="card-text">
              <b>Gross Total: </b>{" "}
              <span className="float-end">
                {" "}
                {parseFloat(
                  saleCal.grossTotal -
                    (reCal.grossTotal > 0 && reCal.grossTotal)
                )?.toFixed(2)}
                BDT
              </span>
            </p>
            <p className="card-text">
              <b>Gross Total(Round): </b>{" "}
              <span className="float-end">
                {saleCal.grossTotalRound - reCal?.grossTotalRound} BDT
              </span>
            </p>
            <p className="card-text align-middle">
              <div className="row">
                <div className="col-md-6">
                  <b>Cash Received: </b>
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    onChange={handelReceivedCashAmount}
                    id="cashAmount"
                    defaultValue={0}
                    value={
                      cashReceivedShow.cashReceived &&
                      cashReceivedShow.cashReceived
                    }
                    className="form-control float-end col-7"
                  />
                </div>
              </div>
            </p>
            <p className="card-text align-middle">
              <div className="row">
                <div className="col-md-3">
                  <b>Card: </b>
                </div>
                <div className="col-md-5">
                  <Form.Select
                    name="cardType"
                    onChange={handelReceivedCardType}
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
                <div className="col-md-4">
                  <input
                    type="number"
                    defaultValue={0}
                    onChange={handelReceivedCardAmount}
                    value={saleCardAmo.CardAmount && saleCardAmo.CardAmount}
                    name="cardAmount"
                    id="cardAmount"
                    className="form-control float-end col-12"
                  />
                </div>
              </div>
            </p>
            <p className="card-text align-middle">
              <div className="row">
                <div className="col-md-3">
                  <b>MFS: </b>
                </div>
                <div className="col-md-5">
                  <Form.Select
                    name="mfsName"
                    onChange={handelReceivedMfsName}
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
                <div className="col-md-4">
                  <input
                    type="number"
                    id="mfsAmount"
                    defaultValue={0}
                    onChange={handelReceivedMFSAmount}
                    value={saleMfsAmount.Mfs && saleMfsAmount.Mfs}
                    name="mfsAmount"
                    className="form-control float-end col-12"
                  />
                </div>
              </div>
            </p>
            {customerPoint > 100 && (
              <p className="card-text align-middle">
                <div className="row">
                  <div className="col-md-4">
                    <b>Use Point: </b>
                  </div>
                  <div className="col-md-4">{customerPoint}</div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      onChange={handelPointAmount}
                      id="pointAmount"
                      defaultValue={0}
                      // min={0}
                      // max={customerPoint}
                      value={
                        pointAmountSelector.pointAmount &&
                        pointAmountSelector.pointAmount
                      }
                      className="form-control float-end col-7"
                    />
                  </div>
                </div>
              </p>
            )}

            <p className="card-text">
              <b>Change Amount: </b>{" "}
              <span className="float-end">
                {totalChangeAmountSelector?.totalChangeAmount +
                  (reCal.grossTotalRound > 0 && reCal.grossTotalRound)}{" "}
                BDT
              </span>
            </p>
            {customer != "62e301c1ee6c8940f6ac1515" && (
              <p className="card-text">
                <span className="float-start">
                  <b>Old Point: </b>
                  {customerPoint}
                </span>
                <span className="float-end">
                  <b>New Point: </b>
                  {restPoint - reCal.point}
                </span>
              </p>
            )}

            <br />
            <hr />
            <p className="text-center">
              <button
                ref={billPrintButton}
                className="btn btn-dark btn-block "
                id="billPrintButton"
                type="submit"
              >
                <Icons.PrinterOutline className="me-2" size={18} /> Print Bill
              </button>
            </p>
          </form>
        </div>
        <div className="card-footer">
          <div className="text-center">
            Powered by:
            <Link to="https://auroratec.net/">
              <img src={powered} height="20" alt="" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

export default PosFinalizes;
