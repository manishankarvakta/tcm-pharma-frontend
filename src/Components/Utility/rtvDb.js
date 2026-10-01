import { notify } from "./Notify";

// use local storage to manage cart data
const addToDb = (product) => {
  let purchaseCart = [];

  // Process the cart item data

  const item = {
    article_code: product.article_code,
    name: product.name,
    ean: product.ean,
    unit: product.unit,
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
      purchaseCart = [
        ...storedCart,
        {
          ...item,
          order: storedCart.length > 0 ? storedCart?.length + 1 : 1,
        },
      ];
    }
  } else {
    purchaseCart = [
      ...purchaseCart,
      {
        ...item,
        order: storedCart?.length > 0 ? storedCart?.length + 1 : 1,
      },
    ];
  }

  console.log("stored Cart:", storedCart);
  console.log("purchase cart:", purchaseCart);

  localStorage.setItem("rtvCart", JSON.stringify(purchaseCart));
  return true;
};

const getStoredCart = () => {
  let purchaseCart = [];

  //get the shopping cart from local storage
  const storedCart = localStorage.getItem("rtvCart");
  return JSON.parse(storedCart);
};

const getSetCart = (cart) => {
  //get the shopping cart from local storage
  localStorage.setItem("rtvCart", JSON.stringify(cart));
};

const removeFromDb = (id) => {
  const storedCart = localStorage.getItem("rtvCart");
  const purchaseCart = JSON.parse(storedCart);
  const item = purchaseCart.find((item) => item.article_code === id);
  const restItem = purchaseCart.filter((item) => item.article_code !== id);
  if (item) {
    return localStorage.setItem("rtvCart", JSON.stringify(restItem))
      ? "true"
      : "false";
  }
};

const removeQuantity = (id) => {
  const storedCart = localStorage.getItem("rtvCart");
  if (storedCart) {
    const purchaseCart = JSON.parse(storedCart);
    const item = purchaseCart.find((item) => item.article_code === id);
    const restItem = purchaseCart.filter((item) => item.article_code !== id);

    if (item) {
      item.qty = item.qty - 1;
      restItem.push(item);
      return localStorage.setItem("rtvCart", JSON.stringify(restItem))
        ? "true"
        : "false";
    }
  }
};

const addQuantity = (id) => {
  const storedCart = localStorage.getItem("rtvCart");
  if (storedCart) {
    const purchaseCart = JSON.parse(storedCart);
    const item = purchaseCart.find((item) => item.article_code === id);
    const restItem = purchaseCart.filter((item) => item.article_code !== id);

    if (item) {
      item.qty = item.qty + 1;
      restItem.push(item);
      return localStorage.setItem("rtvCart", JSON.stringify(restItem))
        ? "true"
        : "false";
    }
  }
};
const customQuantity = (id, value) => {
  const storedCart = localStorage.getItem("rtvCart");
  if (storedCart) {
    const purchaseCart = JSON.parse(storedCart);
    if (id in purchaseCart) {
      purchaseCart[id] = parseFloat(value);
      console.log("- quantity:", purchaseCart[id]);

      // console.log(purchaseCart)
      return localStorage.setItem("rtvCart", JSON.stringify(purchaseCart))
        ? "true"
        : "false";
    }
  }
};
const customTP = (id, value) => {
  const storedCart = localStorage.getItem("rtvCart");
  if (storedCart) {
    const purchaseCart = JSON.parse(storedCart);
    if (id in purchaseCart) {
      purchaseCart[id] = parseFloat(value);
      console.log("- quantity:", purchaseCart[id]);

      // console.log(purchaseCart)
      return localStorage.setItem("rtvCart", JSON.stringify(purchaseCart))
        ? "true"
        : "false";
    }
  }
};

const deletepurchaseCart = () => {
  return localStorage.removeItem("rtvCart") ? "true" : "false";
};

export {
  addToDb,
  addQuantity,
  removeQuantity,
  getStoredCart,
  removeFromDb,
  getSetCart,
  deletepurchaseCart,
  customQuantity,
  customTP,
};
