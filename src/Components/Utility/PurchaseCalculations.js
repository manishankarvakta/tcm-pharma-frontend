import React from "react";
const toDecimal = (float) => {
  if (float) {
    return float.toFixed(2);
  }
  return float;
};
const totalItem = (qty, price) => {
  const itemTotal = parseFloat(qty) * parseFloat(price);
  return toDecimal(parseFloat(itemTotal));
};
const itemTotal = (qty, price) => {
  // console.log(parseFloat(qty) * parseFloat(price))
  let itemTotalP;
  if (price > 0) {
    itemTotalP = parseFloat(qty) * parseFloat(price);
  } else {
    itemTotalP = parseFloat(qty) * parseFloat(0);
  }

  return toDecimal(parseFloat(itemTotalP));
};

const itemTax = (tax, qty, price) => {
  const itemTaxTotal = itemTotal(qty, price) * (parseInt(tax) / 100);
  return toDecimal(parseFloat(itemTaxTotal));
};

const total = (products) => {
  let totalTax = 0;
  let total = 0;
  let totalItemOty = 0;
  products?.length > 0 &&
    products?.map((item) => {
      totalTax =
        parseFloat(totalTax) + parseFloat(itemTax(item.tax, item.qty, item.tp));

      totalItemOty = totalItemOty + item.qty;
      total = parseFloat(total) + parseFloat(itemTotal(item.qty, item.tp));
    });
  // console.log(totalTax);
  return [totalTax, total, totalItemOty];
};

// const itemVatTotal = (vat, qty, price) => {
//   const itemTotal = parseFloat(qty) * parseInt(price);
//   const itemVat = parseFloat(qty) * parseInt(price) * (parseInt(vat) / 100);
//   const itemVatTotal = toDecimal(parseFloat(itemTotal + itemVat));
//   return itemVatTotal;
// };

// const roundingTotal = (total) => {
//   return total;, roundingTotal
// };

export { itemTotal, itemTax, total, toDecimal };
