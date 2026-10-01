const posFinalizer = (cart, type) => {
  // console.log(cart, type);
  let totalItem = 0;
  let total = 0;
  let vatAmount = 0;
  let promoPrice = 0;

  cart?.length > 0 &&
    cart?.map((item) => {
      // vatAmount = 0;
      if (type !== "cartProduct") {
        totalItem = totalItem + parseFloat(item.qty);
        // console.log(typeof Number(item.qty), Number(item.qty));
        // console.log("Totoal Return Qty", totalItem);
      } else {
        // TODO:: update qty system (totalItem) by unit
        totalItem = totalItem + parseInt(isLoose(item.article_code, item.qty));
      }
      vatAmount =
        vatAmount +
        itemVat(item.vat, item.qty, itemPrice(item.discount, item.mrp));
      total = total + itemTotal(item.qty, itemPrice(item.discount, item.mrp));
      const promo = item?.promo ? item.promo : {};
      promoPrice =
        promoPrice +
        itemPromo(item.qty, promo, itemPrice(item.discount, item.mrp));
      // console.log(typeof item.qty);
      console.log(
        itemVat(item.vat, item.qty, itemPrice(item.discount, item.mrp))
      );
    });

  const grossTotal = total + vatAmount;
  const grossTotalRound = Math.round(grossTotal);
  const newPoint = Math.floor(Math.round(total) / 100);

  // console.log(
  //   totalItem,
  //   total,
  //   vatAmount,
  //   grossTotal,
  //   grossTotalRound,
  //   newPoint
  // );
  return {
    totalItem,
    total,
    vatAmount,
    grossTotal,
    grossTotalRound,
    newPoint,
    promoPrice,
    itemPrice,
  };
};

const isLoose = (id, qty) => {
  var decimals = qty - Math.floor(qty);
  const looseCat = [59, 54, 61];
  const cat = parseInt(id?.substring(0, 2));
  // console.log(cat, looseCat.includes(cat))
  if (looseCat?.includes(cat) && decimals > 0) {
    return 1;
  } else {
    return qty;
  }
  // console.log(decimals.toFixed(1));
  // if (decimals > 0) {
  //   return 1;
  // } else {
  //   return qty;
  // }
};
const itemPromo = (qty, promo, mrp) => {
  let promoPrice = 0;
  if (promo?.promo_type) {
    promoPrice =
      parseFloat(qty) *
      ((parseFloat(promo?.promo_price ? promo?.promo_price : 0) / 100) * mrp);
  } else {
    promoPrice =
      parseFloat(qty) * parseFloat(promo?.promo_price ? promo?.promo_price : 0);
  }

  return parseFloat(promoPrice);
};

const itemTotal = (qty, price) => {
  // console.log("promo list", promo)
  const itemTotal = parseFloat(qty) * parseFloat(price);
  return parseFloat(itemTotal);
};

const itemVat = (vat, qty, price) => {
  const itemVatTotal = itemTotal(qty, price) * (parseFloat(vat) / 100);
  return parseFloat(itemVatTotal);
};

const itemPrice = (discount, price) => {
  const newPrice =
    discount > 0
      ? price - (parseFloat(discount) * parseFloat(price)) / 100
      : price;
  return parseFloat(newPrice);
};

const itemVatTotal = (vat, qty, price) => {
  const itemTotal = parseFloat(qty) * parseFloat(price);
  const itemVat = parseFloat(qty) * parseFloat(price) * (parseFloat(vat) / 100);
  const itemVatTotal = parseFloat(itemTotal + itemVat);
  return itemVatTotal;
};

const toDecimal = (float) => {
  if (float) {
    return float.toFixed(2);
  }
  return float;
};
const customDiscount = (discount, qty, price) => {
  // console.log(discount, qty, price)
  const totalPrice = parseFloat(qty) * parseFloat(price)
  // console.log(totalPrice)
  const discountCal = parseFloat(discount) / 100;
  // console.log(discountCal)
  const total = parseFloat(totalPrice) - (parseFloat(totalPrice) * parseFloat(discountCal))
  // console.log(total)
  return total;

}
const returnCalculation = (products, type) => {
  let totalItem = 0;
  let total = 0;
  let vatAmount = 0;
  let totalDiscount = 0;

  products?.length > 0 &&
    products?.map((item) => {
      // vatAmount = 0;
      // if (type !== "reProduct") {
      //   totalItem = totalItem + parseFloat(item.qty);
      //   // console.log(typeof Number(item.qty), Number(item.qty));
      //   // console.log("Totoal Return Qty", totalItem);
      // } else {
      //   // TODO:: update qty system (totalItem) by unit
      //   totalItem = totalItem + parseInt(isLoose(item.article_code, item.qty));
      // }
      totalItem = totalItem + parseFloat(item?.qty);
      total = total + itemTotal(item?.qty, itemPrice(item?.discount, item?.mrp));
      totalDiscount = totalDiscount + customDiscount(item?.discount, item?.qty, item?.mrp)

    });

  const grossTotal = -totalDiscount;
  const grossTotalRound = Math.round(grossTotal);
  const newPoint = Math.floor(Math.round(grossTotal) / 100);
  return {
    totalItem,
    total,
    vatAmount,
    grossTotal,
    grossTotalRound,
    newPoint,
  };
}

export { itemTotal, itemVat, itemVatTotal, toDecimal, posFinalizer, itemPrice, customDiscount, returnCalculation };
