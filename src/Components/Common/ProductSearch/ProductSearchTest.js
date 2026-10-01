import React, { Component } from 'react'
import { useState } from 'react';
import Select from 'react-select'
import useProducts from '../../Hooks/useProducts';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const onInputChange = (e)=>{
    console.log(e.target.inputValue);
}

const ProductSearch = ({ handleProductOnChange, searchResult, addToCart }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    console.log(searchResult)

    return (
        <>
            <div className="col-md-12">
                <Select
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                    onInputChange={onInputChange}
                />

                {/* {MyComponent()}
                {<input type="text" onChange={handleProductOnChange} id="productSearch" placeholder='Product' className="form-control" autoFocus />}
                <div className="search-wrapper w-70">
                    {
                        searchResult?.length > 0 ?
                            <ul>
                                {
                                    searchResult?.map(product =>
                                        <li key={product.article_code} onClick={() => addToCart(product.article_code)}> {product.ean} - {product.name}  - ({product.article_code}) - {product.price} BDT  </li>
                                    )
                                }

                            </ul>
                            :
                            ''

                    }
                </div> */}
            </div>
        </>
    );
};

export default ProductSearch;