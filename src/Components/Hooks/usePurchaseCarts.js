import axios from "../../services/apiClient";
import { useEffect, useState } from "react";
import { getStoredCart } from "../Utility/purchaseDb";

const usePurchaseCarts = () => {
  const [purchaseCarts, setPurchaseCarts] = useState([]);

  const updatePurchaseCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("purchase_cart"));

    if (storedCart) {
      const newCart = storedCart?.sort((a, b) => b.order - a.order);
      setPurchaseCarts(newCart);
    } else {
      localStorage.setItem("purchase_cart", JSON.stringify([]));
    }
  };

  const localCart = localStorage.getItem("purchase_cart");
  useEffect(() => {
    setPurchaseCarts(JSON.parse(localCart));
    updatePurchaseCart();
  }, [localCart]);

  return {
    purchaseCarts,
    setPurchaseCarts,
    updatePurchaseCart,
  };
};

export default usePurchaseCarts;
