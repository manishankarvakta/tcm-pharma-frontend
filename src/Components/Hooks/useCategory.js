import React, { useEffect, useState } from 'react';

const useCategory = () => {
    const [categories, setCategories] = useState();
    const [pageCount, setPageCount] = useState([]);


    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}category`)
        .then(res => res.json())
        .then(data => setCategories(data))
    },[]);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}categoryCount`)
        .then(res => res.json())
        .then(data => {
            const count = data.count;
            const pages = Math.ceil(count/10);
            console.log(count)
            setPageCount(pages)
            
        })
    },[]);
    return [categories, setCategories];

};

export default useCategory;