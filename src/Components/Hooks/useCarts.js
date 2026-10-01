import { useEffect, useState } from "react";
import { getStoredCart } from "../Utility/cartDB";

const useCarts = () => {
  const [carts, setCarts] = useState([]);

  const updateCart = () => {
    const storedCart = getStoredCart();
    console.log("shopping cart test", storedCart)
    if (storedCart) {
      const newCart = storedCart?.sort((a, b) => b.order - a.order);
      setCarts(newCart);
      // dispatch(selcetProductsCart(newCart));
    } else {
      setCarts(carts);
    }
  };

  useEffect(() => {
    updateCart();
  }, [carts]);

  return { carts, setCarts, updateCart };
};

export default useCarts;
