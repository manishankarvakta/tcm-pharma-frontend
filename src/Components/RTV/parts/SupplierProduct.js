import React, { useEffect, useState } from "react";
import * as Icons from "heroicons-react";
import {
  itemTotal,
  itemTax,
  toDecimal,
} from "../../Utility/PurchaseCalculations";
import { BsArchive, BsCheckSquare, BsSquare } from "react-icons/bs";
// import { createDispatchHook } from 'react-redux';

const SupplierProduct = ({ productList, localStorageAddFromCart }) => {
  return (
    <>
      {productList ? (
        productList?.map((cartItem, index) => (
          // cartItem.quantity=tempQty;

          <tr key={cartItem?.article_code}>
            {/* <th scope="row">{i++}</thproductList> */}
            <td>{cartItem?.article_code}</td>
            <td title={cartItem?.article_code}>{cartItem?.name}</td>
            <td>
              {/* <input
                class="form-check-input"
                onChange={() => localStorageAddFromCart(cartItem)}
                type="checkbox"
                value=""
                id="flexCheckChecked"
              /> */}
              <BsArchive onClick={() => localStorageAddFromCart(cartItem)} />
              {/* <Icons.X
                className="float-end"
                onClick={() => removeFromCart(cartItem.article_code)}
              /> */}
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

export default SupplierProduct;
