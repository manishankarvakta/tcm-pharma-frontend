import userEvent from "@testing-library/user-event";
import axios from "../../services/apiClient";
import React from "react";
import { useEffect, useState } from "react";
import { signInUser } from "../Utility/Auth";

const useGrn = () => {
  const user = signInUser();
  const [grn, setGrn] = useState({
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
    products.map((product) => {
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
        console.log("total", total);
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
    let grnproductList = [];
    let grntax = parseFloat(0);
    let grndiscount = 0;
    products.map((product) => {
      if (product?.article_code) {
        grntotal_item =
          parseFloat(grntotal_item).toFixed(2) +
          parseFloat(product?.qty).toFixed(2);
        grntotal =
          parseFloat(grntotal).toFixed(2) +
          parseFloat(product?.tp).toFixed(2) *
            parseFloat(product?.qty).toFixed(2);
        grndiscount =
          parseFloat(grndiscount).toFixed(2) +
          parseFloat(product?.discount).toFixed(2);
        grntax =
          parseFloat(grntax).toFixed(2) +
          parseFloat(
            parseFloat(product?.qty).toFixed(2) *
              ((parseFloat(product?.tp).toFixed(2) * product?.tax) / 100)
          ).toFixed(2);
        grnproductList = [...grnproductList, product];
        // console.log(parseFloat(product?.tp)* product?.tax/100)
        console.log("grn total", grntotal);
      }
    });

    return { grntotal_item, grntotal, grntax, grndiscount, grnproductList };
  };

  const updatePurchaseStatus = async (id, status) => {
    let sts;
    if (status) {
      sts = "Received";
    } else {
      sts = "Received";
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

  return { grnTotalItems, updatePurchaseStatus, totalItems, grn, setGrn };
};

export default useGrn;
