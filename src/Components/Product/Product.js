import React, { useEffect, useState } from 'react';
import Header from '../Common/Header/Header';
import './Products.css';
import { useParams } from 'react-router-dom';
import '../Common/CSS/Table.css';
import SideBar from '../Common/SideBar/SideBar';

const Product = () => {
    const {id} = useParams();
    const [product, setProduct] = useState([]);
    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}product/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
    });

    
    return (
        <div>
            <Header></Header>
            <div className='container-fluid mt-5 pt-5'>
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <h1 className='text-center'>{product.name}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;