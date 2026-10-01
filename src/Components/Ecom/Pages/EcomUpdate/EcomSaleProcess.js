import React, { useEffect, useRef, useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import Header from '../../../Common/Header/Header';
import SideBar from '../../../Common/SideBar/SideBar';
import * as Icons from "heroicons-react";
import AlertService from "../../../Utility/AlertService";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEcomSalesByIdQuery, useUpdateEcomSaleMutation } from '../../../../services/ecomApi';
import PrintReceiptById from '../../../Common/PrintReceipt/PrintReceiptByIdEcom';

const EcomSaleProcess = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const statusRef = useRef();
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
    const navigate = useNavigate()
    console.log("id", id)
    const { data, isSuccess } = useEcomSalesByIdQuery(id);
    const [updateEcomSale] = useUpdateEcomSaleMutation();

    const [saleProducts, setSaleProducts] = useState([])

    useEffect(() => {
        if (data) {
            setSaleProducts(data?.products)

        }
    }, [data])
    console.log(data)
    const handleSaleDeliver = async () => {
        console.log(data)
        const confirmed = await AlertService.confirm("Want to deliver?");
        if (confirmed) {

            const newData = { ...data, status: "deliver" }
            console.log(newData)
            await updateEcomSale({ _id: id, newData })
                .then(res => {
                    console.log(res)
                    navigate(`/ecom`)
                })
        }
        // console.log(update)
    }

    const handleSaleCancelation = async () => {
        console.log(data)
        const confirmed = await AlertService.confirm("Are you sure?", "Wanna Cancel?");
        if (confirmed) {
            const newData = { ...data, status: "cancel" }
            console.log(newData)
            await updateEcomSale({ _id: id, newData })
                .then(res => {
                    console.log(res)
                    navigate(`/ecom`)
                })
        }
    }
    const handleSaleConfirmation = async () => {
        console.log(statusRef.current.value)
        console.log(data)
        const confirmed = await AlertService.confirm("Confirm?");
        if (confirmed) {

            const newData = { ...data, status: statusRef.current.value }
            console.log(newData)
            await updateEcomSale({ _id: id, newData })
                .then(res => {
                    console.log(res)
                    navigate(`/ecom`)
                })
        }
        // console.log(update)
    }

    const handleNavigateBack = () => {
        navigate(`/ecom`)
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="Ecom Order in Process "></Header>
                        <div className="row  mt-3">
                            <div className="col-md-4">
                                <div className="card mt-2">
                                    <div className="card-header">
                                        <h5 className="card-title">
                                            Customer Details
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <p>Customer Name: {data?.customerId?.name} </p>
                                        <p>Customer Phone: {data?.customerId?.phone}</p>
                                        <p>Customer Email: {data?.customerId?.email}</p>
                                        <p>Customer Address: {data?.customerId?.delivery}</p>
                                        <p>Customer Point: {data?.customerId?.point}</p>
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="card mt-2">
                                    <div className="card-header">
                                        <h5 className="card-title">
                                            Payment method
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <Form.Check
                                            type="radio"
                                            checked={"checked"}
                                            id="custom-switch"
                                            // onChange={() => handleNewPrice(item?.id)}
                                            label="Cash on delivery"
                                        />
                                        <Form.Check
                                            type="radio"
                                            checked={""}
                                            id="custom-switch"
                                            // onChange={() => handleNewPrice(item?.id)}
                                            label="Bkash"
                                        />
                                        <Form.Check
                                            type="radio"
                                            checked={""}
                                            id="custom-switch"
                                            // onChange={() => handleNewPrice(item?.id)}
                                            label="Nagad"
                                        />
                                        <Form.Check
                                            type="radio"
                                            checked={""}
                                            id="custom-switch"
                                            // onChange={() => handleNewPrice(item?.id)}
                                            label="Card"
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <PrintReceiptById props={id}></PrintReceiptById>
                            </div>
                            <div className="col-md-12">
                                <div className="card mt-2">
                                    <div className="card-header">
                                        <h5 className="card-title">
                                            Ordered Products
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <ListGroup variant="flush">
                                            {
                                                saleProducts?.length > 0 ?
                                                    (saleProducts?.slice()?.sort((a, b) => a.order - b.order)?.map((product, index) => (

                                                        <ListGroup.Item>
                                                            <p>{product.article_code} {product.name}</p>
                                                            <div className="col-md-2">
                                                                <div className="input-group ">

                                                                    {/* quantity */}
                                                                    <input
                                                                        type="text"
                                                                        className="form-control quantity"
                                                                        width="60%"
                                                                        id={product?.article_code}
                                                                        // onChange={(e) => handleCustomQty(e, cartItem?.article_code)}
                                                                        // value={qtyShow(product?.article_code)}
                                                                        defaultValue={product?.qty}
                                                                        disabled
                                                                    />

                                                                </div>
                                                            </div>

                                                        </ListGroup.Item>


                                                        // <p>{product.name}</p>
                                                        // console.log(product)
                                                    ))) : <p>No Products</p>
                                            }
                                        </ListGroup>
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-3">
                                <div className='mt-2 d-flex justify-content-between'>
                                    {/* <button className='btn btn-dark'
                                        onClick={() => handleSaleDeliver()}
                                    >Ready To Deliver</button>
                                    <button className='btn btn-dark'
                                        onClick={() => handleSaleCancelation()}
                                    >Cancel</button> */}
                                </div>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label> Order Status</Form.Label>

                                    <select ref={statusRef}
                                        className="form-select"
                                        id="status"
                                    >
                                        {/* <option selected value="process">process</option> */}
                                        <option selected value="deliver">deliver</option>
                                        <option value="complete">complete</option>
                                        <option value="cancel">cancel</option>
                                    </select>
                                </Form.Group>
                                <button className='btn btn-dark'
                                    onClick={() => handleSaleConfirmation()}
                                >Submit</button>
                                <button className='btn btn-dark mx-2'
                                    onClick={() => handleNavigateBack()}
                                >Back</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EcomSaleProcess;