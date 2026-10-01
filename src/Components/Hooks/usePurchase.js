import userEvent from "@testing-library/user-event";
import axios from "../../services/apiClient";
import React from "react";
import { useEffect, useState } from "react";
import { signInUser } from "../Utility/Auth";

const usePurchase = () => {
  const user = signInUser();
  const [purchase, setPurchase] = useState({
    status: "",
    warehouse: "",
    attached_doc: "",
    products: [],
    total_items: 0,
    total: 0,
    date: new Date(),
    discount: 0,
    shipping: 0,
    grand_total: 0,
    tax: 0,
    supplier_code: "",
    PO_no: "",
  });

  const totalItems = (products) => {
    // console.log(products)
    let total_item = 0;
    let total = 0;
    let productList = [];
    let tax = parseFloat(0);
    let discount = 0;
    products?.map((product) => {
      if (product?.article_code) {
        total_item = parseFloat(total_item) + parseFloat(product?.qty);
        total =
          parseFloat(total) +
          parseFloat(product?.tp) * parseFloat(product?.qty);
        discount = parseFloat(discount) + parseFloat(product?.discount);
        tax =
          parseFloat(tax) +
          parseFloat(
            parseFloat(product?.qty) *
              ((parseFloat(product?.tp) * product?.tax) / 100)
          );
        productList = [...productList, product];
        // console.log(parseFloat(product?.tp)* product?.tax/100)
      }
    });
    // console.log("total Items:", total_item)
    // console.log("total:",total)
    // console.log('tax', tax)
    // console.log('discount', discount)
    // console.log(productList)

    return { total_item, total, tax, discount, productList };
  };
  const grnTotalItems = (products) => {
    // console.log(products)
    let grntotal_item = 0;
    let grntotal = 0;
    let grntax = parseFloat(0);
    let grndiscount = 0;
    let groundTotal = 0;
    products?.map((product) => {
      if (product?.article_code) {
        grntotal_item = parseFloat(grntotal_item) + parseFloat(product?.qty);
        grntotal =
          parseFloat(grntotal) +
          parseFloat(product?.tp) * parseFloat(product?.qty);
        grndiscount = parseFloat(grndiscount) + parseFloat(product?.discount);
        grntax =
          parseFloat(grntax) +
          parseFloat(
            parseFloat(product?.qty) *
              ((parseFloat(product?.tp) * product?.tax) / 100)
          );
        groundTotal = grntotal + grntax - grndiscount;
      }
    });

    return {
      grntotal_item,
      grntotal,
      grntax,
      grndiscount,
      groundTotal,
    };
  };

  const updatePurchaseStatus = async (id, status) => {
    let sts;
    if (status) {
      sts = "Received";
    } else {
      sts = "Pending";
    }
    await axios
      .put(`${process.env.REACT_APP_API_URL}purchase/${id}`, { status: sts })
      .then((response) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      });
  };

  return {
    grnTotalItems,
    updatePurchaseStatus,
    totalItems,
    purchase,
    setPurchase,
  };
};

export default usePurchase;
