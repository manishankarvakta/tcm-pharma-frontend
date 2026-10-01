import { signInUser } from "./Auth";

// use local storage to manage cart data
const addToDb = (data) => {
  const user = signInUser();
  const { aamarId, warehouse } = user || {};

  const storedCart = getStoredCart();
  let listData = storedCart ? storedCart : [];
  console.log(data);

  if (data) {
    let newProduct = {};
    // unique check
    const idExist = listData.find((pro) => pro.id === data._id);
    console.log("data", data._id);
    console.log("Local Store", listData);
    if (idExist) {
      // TODO:: INCREASE QUANTITY
      console.log(idExist);
      newProduct = { ...idExist, qty: idExist.qty + 1 };
      const rest = listData.filter((pro) => pro.id !== idExist.id);
      listData = [newProduct, ...rest];
      listData = listData?.sort((a, b) => b.order - a.order);
      localStorage.setItem("pos_cart", JSON.stringify(listData));
      return true;
    } else {
      // TODO:: NEW PRODUCT ADD TO LocalStroge
      console.log("data", data);

      newProduct = {
        id: data?._id,
        name: data.name,
        article_code: data.article_code,
        mrp: data?.mrp ? data.mrp : 0,
        qty: 0,
        group: data?.group,
        groupId: data?.group[0]?._id,
        tp: data?.tp ? data.tp : 0,
        vat: data?.vat ? data?.vat : 0, //TODO:: Update this to dynamic with product vat
        size: `${data.size}`,
        order: listData.length + 1,
        discount: data.discount ? data.discount : 0,
        pcsBox: data.pcsBox,
        soldInBox: false,
        aamarId: aamarId,
        warehouse: warehouse,
        noOfBox: 0,
        stock: data?.stock,
        supplier: data?.supplierId,
        // discount: 0,
        discountPercent: 0,
      };
      listData = [newProduct, ...listData];
      localStorage.setItem("pos_cart", JSON.stringify(listData));

      // console.log("newProduct", newProduct);
      return true;
    }
  } else {
    return false;
  }
};
const deleteLastProduct = () => {
  const storedCart = getStoredCart();
  let listData = storedCart ? storedCart : [];
  console.log(listData);
  listData.shift();
  console.log(listData);
  localStorage.setItem("pos_cart", JSON.stringify(listData));
  return true;
};

const getStoredCart = () => {
  let shoppingCart = [];

  //get the shopping cart from local storage
  const storedCart = localStorage.getItem("pos_cart");
  if (storedCart) {
    shoppingCart = JSON.parse(storedCart);
    shoppingCart = shoppingCart?.sort((a, b) => b.order - a.order);
  }
  // console.log(shoppingCart);
  return shoppingCart;
};

const removeFromDb = (id) => {
  const storedCart = getStoredCart();
  if (storedCart) {
    const newCart = storedCart.filter((p) => p.article_code !== id);
    return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      ? "true"
      : "false";
  }
};

const removeQuantity = (id) => {
  const storedCart = getStoredCart();
  if (storedCart) {
    const selectedItem = storedCart.find((p) => p.article_code === id);
    const restItem = storedCart.filter((p) => p.article_code !== id);

    selectedItem.qty = selectedItem.qty > 0 ? selectedItem.qty - 1 : 0;
    const newCart = [...restItem, selectedItem];

    return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      ? "true"
      : "false";
  }
};

const addQuantity = async (id) => {
  const storedCart = getStoredCart();
  if (storedCart) {
    const selectedItem = storedCart.find((p) => p.article_code === id);
    const restItem = storedCart.filter((p) => p.article_code !== id);
    // console.log(selectedItem, selectedItem.qty);

    // const newQty = parseInt(selectedItem.qty) + 1;
    console.log("selectedItem", selectedItem, "restItem", restItem);
    const newCart = [
      ...restItem,
      {
        ...selectedItem,
        qty: parseFloat(selectedItem.qty) + 1,
      },
    ];

    console.log(newCart, selectedItem.qty);
    return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      ? "true"
      : "false";
  }
};

const customQuantity = (id, value) => {
  const storedCart = getStoredCart();
  if (storedCart) {
    const selectedItem = storedCart.find((p) => p.article_code === id);
    const restItem = storedCart.filter((p) => p.article_code !== id);

    selectedItem.qty = value > 0 ? value : 0;
    const newCart = [...restItem, selectedItem];

    return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      ? "true"
      : "false";
  }
};

const customNoOfBox = (id, value) => {
  const storedCart = getStoredCart();
  if (storedCart) {
    const selectedItem = storedCart.find((p) => p.article_code === id);
    const restItem = storedCart.filter((p) => p.article_code !== id);

    selectedItem.noOfBox = value > 0 ? value : 0;
    selectedItem.qty = value
      ? parseInt(selectedItem.pcsBox) * parseInt(value)
      : 1;
    const newCart = [...restItem, selectedItem];

    return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      ? "true"
      : "false";
  }
};

const customSoldInBox = (id, value) => {
  const storedCart = getStoredCart();
  if (storedCart) {
    const selectedItem = storedCart.find((p) => p.article_code === id);
    const restItem = storedCart.filter((p) => p.article_code !== id);

    // console.log("selectedItem", selectedItem.pcsBox);

    selectedItem.soldInBox = value ? value : false;
    selectedItem.qty = value ? selectedItem.pcsBox : 1;
    selectedItem.noOfBox = value ? 1 : 0;
    const newCart = [...restItem, selectedItem];

    return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      ? "true"
      : "false";
  }
};

const customItemDiscount = (id, value) => {
  const storedCart = getStoredCart();
  if (storedCart) {
    const selectedItem = storedCart.find((p) => p.article_code === id);
    const restItem = storedCart.filter((p) => p.article_code !== id);

    selectedItem.discount = value > 0 ? value : 0;
    const newCart = [...restItem, selectedItem];

    return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      ? "true"
      : "false";
  }
};

const deleteShoppingCart = () => {
  return localStorage.removeItem("pos_cart") ? "true" : "false";
};

export {
  addQuantity,
  addToDb,
  customItemDiscount,
  customNoOfBox,
  customQuantity,
  customSoldInBox,
  deleteLastProduct,
  deleteShoppingCart,
  getStoredCart,
  removeFromDb,
  removeQuantity,
};
