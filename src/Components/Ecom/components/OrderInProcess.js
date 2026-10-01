import React, { useEffect, useState } from 'react';
import { useEcomSalesByStatusQuery, useEcomSalesQuery, useUpdateEcomSaleMutation } from '../../../services/ecomApi';
import { startOfToday, endOfToday, format, formatDistance } from "date-fns";
import { Helmet } from 'react-helmet';
import DatePicker from "react-datepicker";
import { Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icons from "heroicons-react";
import AlertService from "../../Utility/AlertService";

const OrderInProcess = () => {

    const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
    const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
    const { data, isSuccess } = useEcomSalesByStatusQuery('process');
    const [updateEcomSale] = useUpdateEcomSaleMutation();


    const handleOrderStatusChange = async (id) => {
        const confirmed = await AlertService.confirm("Process Complete?");
        if (confirmed) {

            const newData = { ...data, status: "deliver" }
            console.log(newData)
            await updateEcomSale({ _id: id, newData })
                .then(res => {
                    console.log(res)
                    // navigate(`/ecom`)
                })
        }
    }
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>TCM-ECOM-SALE</title>
            </Helmet>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6">
                                {/* Sort date range */}
                                <div className="date-picker d-flex mt-2 mb-2 align-items-center">
                                    {/* <b>Start:</b> */}
                                    <DatePicker
                                        selected={new Date(startDate)}
                                        className="form-control me-2"
                                        onChange={(date) =>
                                            setStartDate(format(new Date(date), "MM-dd-yyyy"))
                                        }
                                    />
                                    <span width="10px"></span>
                                    {/* <b>End:</b> */}
                                    <DatePicker
                                        selected={new Date(endDate)}
                                        className="form-control"
                                        onChange={(date) =>
                                            setEndDate(format(new Date(date), "MM-dd-yyyy"))
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        // onChange={(e) => handelSearchInvoice(e)}
                                        placeholder="Search invoice id"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-2"></div>
                                    <div className="col-md-5">
                                        <button

                                            className="btn btn-dark float-end my-2 mr-2"
                                        // onClick={() => setShow(true)}
                                        >
                                            Export Sales Report
                                        </button>
                                    </div>
                                    <div className="col-md-5">
                                        <button

                                            className="btn btn-dark  my-2 mr-2"
                                        // onClick={() => setShow(true)}
                                        >
                                            Export Article Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Table hover className="mt-4">
                            <thead>
                                <tr>
                                    <th scope="col">Invoice ID</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Biller</th>
                                    <th scope="col">Customer</th>
                                    <th scope="col">Items</th>
                                    <th scope="col">Gross Total</th>
                                    <th scope="col">Paid</th>
                                    <th scope="col">Change</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {console.log(sales)} */}
                                {data?.length > 0 ? (
                                    data?.map((sale) => (
                                        <tr key={sale._id}>
                                            {/* <th >{i++}</th> */}
                                            <th scope="row">{sale.invoiceId}</th>
                                            <td>
                                                {sale.createdAt &&
                                                    format(new Date(sale.createdAt), "MM-dd-yyyy H:m:ss")}
                                            </td>
                                            <td>{sale?.billerId?.name}</td>
                                            <td>{sale?.customerId?.phone}</td>
                                            <td>{sale.totalItem}</td>
                                            <td>{sale.grossTotalRound}</td>
                                            <td>{sale.totalReceived}</td>
                                            <td>{sale.changeAmount}</td>
                                            <td>{sale.status}</td>
                                            <td>
                                                {/* {
                                                    sale.status === "deliver" ? <Form.Check
                                                        type="switch"
                                                        checked={"checked"}
                                                        id="custom-switch"
                                                        // onChange={() => handleNewPrice(item?.id)}
                                                        label=""
                                                    /> : <Form.Check
                                                        type="switch"
                                                        checked={""}
                                                        id="custom-switch"
                                                        onChange={() => handleOrderStatusChange(sale?._id)}
                                                        label=""
                                                    />
                                                } */}
                                                {/* <Form.Check
                                                    type="switch"
                                                    checked={""}
                                                    id="custom-switch"
                                                    // onChange={() => handleNewPrice(item?.id)}
                                                    label=""
                                                /> */}
                                                <Link to={`/ecom/orderinfoprocess/${sale._id}`}>
                                                    <Icons.CogOutline
                                                        className="icon-eye"
                                                        size={22}
                                                    />
                                                </Link>
                                                {/* <Icons.TrashOutline
                                                className="icon-trash"
                                                // onClick={() => handelDeleteSale(sale._id)}
                                                size={22}
                                            ></Icons.TrashOutline> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // <tr>
                                    //   <td colSpan={4}>Loading...</td>
                                    // </tr>
                                    <tr colSpan={9}>No Sales Found</tr>
                                )}
                            </tbody>
                        </Table>

                        { }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInProcess;