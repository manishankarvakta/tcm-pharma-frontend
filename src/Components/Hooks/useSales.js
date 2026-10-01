import userEvent from '@testing-library/user-event';
import React from 'react';
import { useEffect, useState } from "react";
import { signInUser } from '../Utility/Auth';

const useSales = () => {
    const user = signInUser();
    const [sales, setSales] = useState({
        invoice_id : '',
        date: new Date(),
        ware_house: "TCM",
        status: "complete",
        products: [],
        return_products: [],
        paid_amount: {
            cash:0,
            card:["dbbl",0],
            mfs:["bkash",0]
        },
        change_amount:0,
        biller_id: user.name,
        customer_id: "",
        royalty_point: 0,
        total_item: 0,
        total: 0,
        discount: 0,
        vat: 0,
        total_round: 0,
        sub_total: 0,
        total_received: 0,
    });

    // const saleByInvoice = id =>{
    //     console.log(id.invoice_id)
        // const url = `${process.env.REACT_APP_API_URL}sale/${id.invoice_id}`;
        // console.log(url)
    //     fetch(url)
    //     .then(res => res.json())
    //     .then(data => (data)=>{
    //         console.log(data);
    //         return data;
    //     }) 
    // }saleByInvoice, 
    
    
    return  [sales, setSales];
};

export default useSales;