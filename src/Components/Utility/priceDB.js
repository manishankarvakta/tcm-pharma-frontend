import { notify } from "./Notify";

// use local storage to manage cart data
const addToDb = (product) => {
  let priceTable = [];

  // Process the cart item data

  const item = {
    article_code: "",
    mrp: 0,
    order: 1,
    supplier: "",
    tp: 0,
    warehouse: "",
  };

  // check cart data
  // get the shopping cart from local storage
  const storedCart = getStoredCart();
  if (storedCart) {
    console.log(storedCart);
    const selectedItem = storedCart.find(
      (p) => p.article_code.toString() === item.article_code
    );
    if (selectedItem) {
      notify("Product is already add to List");
      return;
    } else {
      priceTable = [
        ...storedCart,
        {
          ...item,
          order: storedCart.length > 0 ? storedCart?.length + 1 : 1,
        },
      ];
    }
  } else {
    priceTable = [
      ...priceTable,
      {
        ...item,
        order: storedCart?.length > 0 ? storedCart?.length + 1 : 1,
      },
    ];
  }

  console.log("stored Cart:", storedCart);
  console.log("purchase cart:", priceTable);

  localStorage.setItem("priceTable", JSON.stringify(priceTable));
  return true;
};

const getStoredCart = () => {
  let priceTable = [];

  //get the shopping cart from local storage
  const storedCart = localStorage.getItem("priceTable");
  return JSON.parse(storedCart);
};
const getSetCart = (cart) => {
  //get the shopping cart from local storage
  localStorage.setItem("priceTable", JSON.stringify(cart));
};

const removeFromDb = (id) => {
  const storedCart = localStorage.getItem("priceTable");
  const priceTable = JSON.parse(storedCart);
  const item = priceTable.find((item) => item.article_code === id);
  const restItem = priceTable.filter((item) => item.article_code !== id);
  if (item) {
    return localStorage.setItem("priceTable", JSON.stringify(restItem))
      ? "true"
      : "false";
  }
};

const removeQuantity = (id) => {
  const storedCart = localStorage.getItem("priceTable");
  if (storedCart) {
    const priceTable = JSON.parse(storedCart);
    const item = priceTable.find((item) => item.article_code === id);
    const restItem = priceTable.filter((item) => item.article_code !== id);

    if (item) {
      item.qty = item.qty - 1;
      restItem.push(item);
      return localStorage.setItem("priceTable", JSON.stringify(restItem))
        ? "true"
        : "false";
    }
  }
};

const addQuantity = (id) => {
  const storedCart = localStorage.getItem("priceTable");
  if (storedCart) {
    const priceTable = JSON.parse(storedCart);
    const item = priceTable.find((item) => item.article_code === id);
    const restItem = priceTable.filter((item) => item.article_code !== id);

    if (item) {
      item.qty = item.qty + 1;
      restItem.push(item);
      return localStorage.setItem("priceTable", JSON.stringify(restItem))
        ? "true"
        : "false";
    }
  }
};
const customQuantity = (id, value) => {
  const storedCart = localStorage.getItem("priceTable");
  if (storedCart) {
    const priceTable = JSON.parse(storedCart);
    if (id in priceTable) {
      priceTable[id] = parseFloat(value);
      console.log("- quantity:", priceTable[id]);

      // console.log(priceTable)
      return localStorage.setItem("priceTable", JSON.stringify(priceTable))
        ? "true"
        : "false";
    }
  }
};
const customTP = (id, value) => {
  const storedCart = localStorage.getItem("priceTable");
  if (storedCart) {
    const priceTable = JSON.parse(storedCart);
    if (id in priceTable) {
      priceTable[id] = parseFloat(value);
      console.log("- quantity:", priceTable[id]);

      // console.log(priceTable)
      return localStorage.setItem("priceTable", JSON.stringify(priceTable))
        ? "true"
        : "false";
    }
  }
};

const deletepriceTable = () => {
  return localStorage.removeItem("priceTable") ? "true" : "false";
};

export {
  addToDb,
  addQuantity,
  removeQuantity,
  getStoredCart,
  removeFromDb,
  getSetCart,
  deletepriceTable,
  customQuantity,
  customTP,
};
