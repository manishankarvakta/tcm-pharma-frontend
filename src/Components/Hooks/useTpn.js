import React from 'react';
import { signInUser } from '../Utility/Auth';

const useTpn = () => {
    const user = signInUser();

    const totalItems = (products, shipping) => {
        console.log(products)
        let total_item = products.length;
        // let total_item = 0;
        let total = 0;
        let total_shipping = 0;
        let productList = [];


        products?.map((product) => {
            if (product?.article_code) {
                // total_item = parseFloat(total_item) + parseFloat(product?.qty);
                // total_item = product?.length;
                total =
                    parseFloat(total) + parseFloat(product?.tp) * parseFloat(product?.qty);
                productList = [...productList, product];
                // console.log(parseFloat(product?.tp)* product?.tax/100)
            }
        });
        // console.log("total Items:", total_item)
        // console.log("total:",total)
        // console.log('tax', tax)
        // console.log('discount', discount)
        // console.log(productList)
        total_shipping = parseFloat(total) + parseFloat(shipping ? shipping : 0)
        return { total_item, total, productList, total_shipping };
    };

    return { totalItems };
};

export default useTpn;