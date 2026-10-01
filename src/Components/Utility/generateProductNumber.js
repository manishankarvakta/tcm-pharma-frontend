import React from 'react';
import { compareAsc, format } from "date-fns";
import { useProductLastQuery } from '../../services/productApi';

const productNumber = () => {

    const date = format(new Date(new Date()), "yyyyMMdd");
    console.log(date)
    return date
};

export { productNumber };