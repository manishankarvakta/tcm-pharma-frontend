import React from 'react';
import { signInUser } from '../Utility/Auth';

const useAdjust = () => {
    const user = signInUser();

    const totalItems = (products) => {
        // console.log(products)
        let total_item = products.length;
        let total = 0;
        let productList = [];


        products?.map((product) => {
            if (product?.article_code) {
                const adjustQty = parseFloat(product?.qty) || 0;
                total =
                    parseFloat(total) + (parseFloat(product?.tp) || 0) * adjustQty;
                productList = [...productList, product];
            }
        });

        return { total_item, total, productList };
    };

    return { totalItems };
};

export default useAdjust;
