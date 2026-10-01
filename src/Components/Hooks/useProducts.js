import React, { useEffect, useState } from 'react';

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState([]);
    const [counter, setCounter] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}product`)
        .then(res => res.json())
        .then(data => setProducts(data))
    },[]);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}productCount`)
        .then(res => res.json())
        .then(data => {
            const count = data.count;
            const pages = Math.ceil(count/10);
            // console.log(count)
            setPageCount(pages)
            // progress()
        })
    },[]);
    

    return [products, setProducts];
};

export default useProducts;