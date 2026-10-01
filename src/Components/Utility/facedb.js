// use local storage to manage cart data
const addToDb = (product) => {
  let shoppingCart = {};

  console.log("product", product);
  // //get the shopping cart from local storage
  // const storedCart = localStorage.getItem('shopping-cart');
  // if (storedCart) {
  //     shoppingCart = JSON.parse(storedCart);
  // }

  // // add quantity
  // const quantity = shoppingCart[id];
  // if (quantity) {
  //     const newQuantity = parseFloat(quantity + 1.00);
  //     shoppingCart[id] = newQuantity;
  // }
  // else {
  //     shoppingCart[id] = 1;
  // }
  // localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart));
  // return true;
};

const getStoredCart = () => {
  let shoppingCart = {};

  //get the shopping cart from local storage
  const storedCart = localStorage.getItem("shopping-cart");
  if (storedCart) {
    shoppingCart = JSON.parse(storedCart);
  }
  // console.log(shoppingCart);
  return shoppingCart;
};

const removeFromDb = (id) => {
  const storedCart = localStorage.getItem("shopping-cart");
  if (storedCart) {
    const shoppingCart = JSON.parse(storedCart);
    if (id in shoppingCart) {
      delete shoppingCart[id];
      return localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart))
        ? "true"
        : "false";
    }
  }
};

const removeQuantity = (id) => {
  const storedCart = localStorage.getItem("shopping-cart");
  if (storedCart) {
    const shoppingCart = JSON.parse(storedCart);
    if (id in shoppingCart) {
      const quantity = shoppingCart[id];
      if (quantity > 1) {
        shoppingCart[id] = parseFloat(quantity - 1.0);
        console.log("- quantity:", shoppingCart[id]);
      } else {
        console.log("Min Quantity will be 1");
      }
      // console.log(shoppingCart)
      return localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart))
        ? "true"
        : "false";
    }
  }
};

const addQuantity = (id) => {
  const storedCart = localStorage.getItem("shopping-cart");
  if (storedCart) {
    const shoppingCart = JSON.parse(storedCart);
    if (id in shoppingCart) {
      const quantity = shoppingCart[id];
      shoppingCart[id] = parseFloat(quantity + 1.0);
      console.log("- quantity:", shoppingCart[id]);

      // console.log(shoppingCart)
      return localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart))
        ? "true"
        : "false";
    }
  }
};
const customQuantity = (id, value) => {
  const storedCart = localStorage.getItem("shopping-cart");
  if (storedCart) {
    const shoppingCart = JSON.parse(storedCart);
    if (id in shoppingCart) {
      shoppingCart[id] = parseFloat(value);
      console.log("- quantity:", shoppingCart[id]);

      // console.log(shoppingCart)
      return localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart))
        ? "true"
        : "false";
    }
  }
};

const deleteShoppingCart = () => {
  return localStorage.removeItem("shopping-cart") ? "true" : "false";
};

export {
  addToDb,
  addQuantity,
  removeQuantity,
  getStoredCart,
  removeFromDb,
  // handleQuantityInput,
  deleteShoppingCart,
  customQuantity,
};
