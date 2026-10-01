import React from "react";

const totalCalculation = (products) => {
    let total = 0;
    let totalItemQty = 0;
    products?.length > 0 &&
        products?.map((item) => {
            totalItemQty = totalItemQty + item.totalSoldQuantity;
            total = parseFloat(total) + parseFloat(parseFloat(item.totalSoldQuantity) * parseFloat(item.mrp))
        });
    // console.log(totalTax);
    return { total, totalItemQty };
};

export { totalCalculation };
