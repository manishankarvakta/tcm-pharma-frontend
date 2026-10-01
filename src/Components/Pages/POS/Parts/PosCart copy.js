import React, { useEffect, useState } from "react";
import * as Icons from "heroicons-react";
import {
  // posFinalizer,
  itemVatTotal,
  itemVat,
  toDecimal,
} from "../../../Utility/PosCalculations";
// import { selcetProduct } from "../../../../features/salesSlice";
import { useSelector } from "react-redux";
import PriceSelectByProduct from "../../../Common/CustomSelect/PriceSelectByProduct";
// import { createDispatchHook } from 'react-redux';

const PosCart = ({
  addQuantities,
  removeQuantities,
  removeFromCart,
  handleCustomQty,
  updateCart,
  returnProducts,
  reCal,
}) => {
  let i = 1;
  let j = 1;
  // console.log(carts)
  const [tempQty, setTempQty] = useState([]);
  const [scValue, setScValue] = useState("");
  const carts = useSelector((state) => state.salesReducer.products);

  // console.log(carts.id);

  useEffect(() => {
    setScValue(carts.id);
  }, [carts]);

  useEffect(() => {
    let cartTempQty = [];
    carts?.map((item) => {
      cartTempQty = [...cartTempQty, { id: item.article_code, qty: item.qty }];
    });
    // console.log(cartTempQty);
    setTempQty(cartTempQty);
  }, [carts]);
  // console.log(carts);

  const handleOnChangeCategory = (id, e) => {
    let ProductCart = JSON.parse(localStorage.getItem("pos_cart"));
    let selected = ProductCart.find((item) => item.id === id);
    let rest = ProductCart.filter((item) => item.id !== id);
    let newCart = [];
    newCart = [
      ...rest,
      {
        ...selected,
        mrp: e.option,
      },
    ];

    localStorage.setItem("pos_cart", JSON.stringify(newCart));
    console.log(e.option);
    updateCart();
  };
  // console.log(returnProducts);
  return (
    <>
      {carts ? (
        carts?.map((cartItem, index) => (
          <tr key={cartItem?.article_code}>
            <th scope="row">{i++}</th>
            <td title={cartItem?.article_code}>{cartItem?.name}</td>
            <td>
              <PriceSelectByProduct
                sc={cartItem?.id}
                setVal={cartItem?.mrp}
                handleOnChangeCategory={handleOnChangeCategory}
              ></PriceSelectByProduct>
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
                <input
                  type="text"
                  className="form-control quantity"
                  id={cartItem?.article_code}
                  onChange={(e) =>
                    handleCustomQty(e, index, cartItem?.article_code)
                  }
                  value={
                    tempQty[index]?.qty ? tempQty[index]?.qty : cartItem?.qty
                  }
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
              {toDecimal(
                parseFloat(itemVat(cartItem?.vat, cartItem?.qty, cartItem?.mrp))
              )}
            </td>
            <td>
              {toDecimal(
                itemVatTotal(cartItem?.vat, cartItem?.qty, cartItem?.mrp)
              )}
              <Icons.X
                className="float-end"
                onClick={() => removeFromCart(cartItem.article_code)}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <th scope="row" colSpan="5">
            <p className="text-center">No Item in Cart</p>
          </th>
        </tr>
      )}
      {returnProducts?.length > 0 && (
        <>
          <tr>
            <th className="border-bottom-1 border-top-1" colSpan={6}>
              <br />
              <b>Return Products</b>
            </th>
          </tr>
          {returnProducts?.map((reItem, index) => (
            <tr key={reItem?.article_code}>
              <th scope="row">{j++}</th>
              <td title={reItem?.article_code}>{reItem?.name}</td>
              <td> {reItem?.mrp} </td>
              <td className="col-md-2">{reItem?.qty}</td>
              <td>
                {toDecimal(
                  parseFloat(itemVat(reItem?.vat, reItem?.qty, reItem?.mrp))
                )}
              </td>
              <td>
                {toDecimal(itemVatTotal(reItem?.vat, reItem?.qty, reItem?.mrp))}
              </td>
            </tr>
          ))}
          <tr>
            <th className="border-bottom-1 border-top-1">
              <br />
              <b>Item No:</b> {reCal?.totalItem}
            </th>
            <td>
              <br />
              <b>Total:</b> {reCal?.total && reCal.total.toFixed(2)}
            </td>
            <td>
              <br />
              <b>Vat:</b> {reCal?.vatAmount}
            </td>
            <td>
              <br />
              <b>Gross Total:</b> {reCal?.grossTotal?.toFixed(2)}
            </td>
            <td>
              <br />
              <b>Round Total:</b> {reCal?.grossTotalRound?.toFixed(2)}
            </td>
            <td>
              <br />
              <b>Point:</b> {reCal?.point}
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default PosCart;
