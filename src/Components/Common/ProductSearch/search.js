import { Button } from 'bootstrap';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { notify } from '../../Utility/Notify';

const Search = () => {
    const [searchResult, setSearchResult] = useState([]);
    const handleOnKeyUp = (e) => {
        const searchString = e.target.value;
        const match1 = searchString.match(/^[a-zA-Z0-9 ]*/)
        const match2 = searchString.match(/\s*/)
        if (match2[0] === searchString) {
            setSearchResult([]);
            return;
        }

        if (match1[0] === searchString) {
            console.log(match1[0])

            fetch(`${process.env.REACT_APP_API_URL}search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payload: searchString })
            })
                .then(res => res.json())
                .then(data => {

                    setSearchResult(data.payload);
                    if (data.payload < 1) {
                        notify("No Product Found", "error");
                        return;
                    }
                    console.log(data.payload)
                })
        }else{
            searchResult([])
        }

    }

    const getCart = () =>{
        const storedCart = {5110005: 2, 5110011: 1, 5110080: 1, 5610305: 1, 5610311: 1, 5810604: 1, 5810716: 1,}
        console.log(storedCart)
        let productIds = []
        for (const key in storedCart) {
            productIds.push(`${key}`);
        }
        fetch(`${process.env.REACT_APP_API_URL}products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload: productIds })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                for (const id in storedCart) {
                    const addedProduct =  data.find(product => product.article_code.toString() === id)
                    const quantity = storedCart[id];
                    if(addedProduct){
                        addedProduct.quantity = quantity;
                    }
                    console.log(addedProduct);
                }
                // setCarts(savedCart);
            })
        console.log(productIds)
    }
    return (
        <div>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Scan barcode" onChange={handleOnKeyUp} />
                    <ul >
                        {/* <option value="sas">Hi</option> */}
                        {
                                searchResult?.map((item, index) =>
                                    <li key={index} value={item.article_code}> {item.name}</li>
                                )
                                // console.log(searchResult)
                               
                        }
                    </ul>
                </Form.Group>

            </Form>
            <button onClick={getCart}>Get Cart</button>
        </div>
    );
};

export default Search;