import { useEffect, useState } from "react";
import { getStoredCart } from "../Utility/priceDB";

const usePriceTable = () => {
  const [purchaseCarts, setPurchaseCarts] = useState([]);

  const updatePurchaseCart = () => {
    const storedCart = getStoredCart();

    if (storedCart) {
      const newCart = storedCart?.sort((a, b) => b.order - a.order);
      setPurchaseCarts(newCart);
    } else {
      localStorage.setItem("priceTable", JSON.stringify([]));
    }
  };

  useEffect(() => {
    const localCart = localStorage.getItem("priceTable");
    setPurchaseCarts(JSON.parse(localCart));
    updatePurchaseCart();
  }, []);

  return {
    purchaseCarts,
    setPurchaseCarts,
    updatePurchaseCart,
  };
};

export default usePriceTable;
