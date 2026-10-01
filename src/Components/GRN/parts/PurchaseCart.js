import React, { useEffect, useState } from "react";
import * as Icons from "heroicons-react";
import {
  itemTotal,
  itemTax,
  toDecimal,
} from "../../Utility/PurchaseCalculations";
// import { createDispatchHook } from 'react-redux';

const PurchaseCart = ({
  purchaseCarts,
  addQuantities,
  removeQuantities,
  removeFromCart,
  // customQuantity,
  handleCustomTp,
  handleCustomTax,
  handleCustomQty,
  updatePurchaseCart,
  setPurchaseCarts,
}) => {
  let i = 1;
  // console.log(purchaseCarts);
  const [tempQty, setTempQty] = useState([]);
  const [tempTax, setTempTax] = useState([]);
  const [tempTp, setTempTp] = useState([]);

  // // const val = (article_code, value, state) => state.map((val, i) => (i !== article_code ? val : value))
  useEffect(() => {
    let cartTempQty = [];
    let cartTempTp = [];
    let cartTempTax = [];

    purchaseCarts?.map((item) => {
      cartTempQty = [...cartTempQty, { id: item.article_code, qty: item.qty }];
      cartTempTp = [...cartTempTp, { id: item.article_code, tp: item.tp }];
      cartTempTax = [...cartTempTax, { id: item.article_code, tax: item.tax }];
    });

    // console.log(cartTempQty);
    setTempQty(cartTempQty);
    setTempTax(cartTempTax);
    setTempTp(cartTempTax);
  }, [purchaseCarts]);

  // console.log(tempQty);

  return (
    <>
      {purchaseCarts ? (
        purchaseCarts?.map((cartItem, index) => (
          // cartItem.quantity=tempQty;

          <tr key={cartItem?.article_code}>
            <th scope="row">{i++}</th>
            <td>{cartItem?.article_code}</td>
            <td title={cartItem?.article_code}>{cartItem?.name}</td>
            <td>
              {/* tax */}
              <input
                type="text"
                className="form-control quantity customFrom"
                id={cartItem?.article_code}
                onChange={(e) => handleCustomTax(e, cartItem?.article_code)}
                value={
                  tempTax[index]?.tax ? tempTax[index]?.tax : cartItem?.tax
                }
                defaultValue={cartItem?.tax}
              />
            </td>
            <td className="col-md-2">
              <div className="input-group ">
                <div className="input-group-prepend">
                  <div
                    onClick={() => removeQuantities(cartItem.article_code)}
                    className="input-group-text"
                  >
                    <Icons.Minus size="28" />
                  </div>
                </div>
                {/* quantity */}
                <input
                  type="text"
                  className="form-control quantity"
                  width="60%"
                  id={cartItem?.article_code}
                  onChange={(e) => handleCustomQty(e, cartItem?.article_code)}
                  value={
                    tempQty[index]?.qty ? tempQty[index]?.qty : cartItem?.qty
                  }
                  defaultValue={cartItem?.qty}
                />
                <div className="input-group-append">
                  <div
                    onClick={() => addQuantities(cartItem.article_code)}
                    className="input-group-text"
                  >
                    <Icons.Plus size="28" />
                  </div>
                </div>
              </div>
            </td>
            <td>
              {/* Cost price */}
              <input
                type="text"
                name="tp"
                className="form-control customFrom quantity"
                id={cartItem?.article_code}
                onChange={(e) => handleCustomTp(e, cartItem?.article_code)}
                value={
                  tempTp[index]?.tp
                    ? tempTp[index]?.tp
                    : parseFloat(cartItem?.tp)
                }
                defaultValue={cartItem?.tp}
              />
            </td>
            <td>
              {toDecimal(
                parseFloat(itemTax(cartItem?.tax, cartItem?.qty, cartItem?.tp))
              )}
            </td>
            <td>
              <span className="float-end">
                {/* {toDecimal(
                parseFloat(
                  itemVat(cartItem?.vat, cartItem?.quantity, cartItem?.price)
                )
              )} */}
                {toDecimal(
                  parseFloat(itemTotal(cartItem?.qty, cartItem?.tp)) +
                    parseFloat(
                      itemTax(cartItem?.tax, cartItem?.qty, cartItem?.tp)
                    )
                )}
              </span>
            </td>
            <td>
              <Icons.X
                className="float-end"
                onClick={() => removeFromCart(cartItem.article_code)}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <th scope="row" colSpan="9">
            <p className="text-center">No Item in Purchase List</p>
          </th>
        </tr>
      )}
    </>
  );
};

export default PurchaseCart;
