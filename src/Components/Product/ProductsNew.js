import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Header from '../Common/Header/Header';
import './Products.css';
import * as Icons from 'heroicons-react';
import { Link } from 'react-router-dom';
import SideBar from '../Common/SideBar/SideBar';
import ProductImportModal from '../Common/Modal/ProductImportModal';
import { notify } from '../Utility/Notify';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Table from '../Common/DataTable/Table';
import { IoBeerOutline } from "react-icons/io5";
import { IconContext } from "react-icons";

import AlertService from '../Utility/AlertService';

const Products = () => {
    const [data, setData] = useState([]);
    const [q, setQ] = useState("");
    const [searchColumns, setSearchColumns] = useState(["ean", "name", "code"])

    const getData = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}product`)
        const products = result.data;
        let dataProcess = [];
        products.map((product, index) => {
            dataProcess = [...dataProcess,
            {
                ean: product.ean,
                name: product.name,
                code: product.article_code,
                mc: product.master_category,
                tp: product.cost,
                mrp: product.price,
                unit: product.unit
            }]
        })
        setData(dataProcess);
    }

    useEffect(() => {
        getData();
    }, [])


    function search(rows) {
        return rows.filter(
            (row) =>
                searchColumns?.some(column => row[column]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1)
        )
    }
    const columns = data[0] && Object.keys(data[0])

    // IMPORTS
    const [show, setShow] = useState(false);
    const [csvData, setCsvData] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // handel import
    const handleImportButton = async () => {
        // import data
        const confirmed = await AlertService.confirm('Are you Sure?', 'Import/Update Products?');
        let importProducts = await csvData;

        if (confirmed) {
            if (importProducts.length > 0) {
                fetch(`${process.env.REACT_APP_API_URL}product/import`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(importProducts)
                })
                    .then(res => res.json())
                    .then(data => console.log(data))

                // console.log(importProducts);
            } else {
                notify('Nothing to Import.', 'error')
            }
        }
    }

    const handelDeleteProduct = async id => {
        const confirmed = await AlertService.confirm('Are you Sure?', 'Delete this Product?');

        if (confirmed) {
            const url = `${process.env.REACT_APP_API_URL}product/${id}`;
            // send data to the server
            fetch(url, {
                method: "DELETE",
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.deletedCount > 0) {
                        console.log('Deleted');
                        const remaining = data.filter(product => product?._id !== id);
                        setData(remaining);
                    }
                });

        }
    }

    return (
        <div>
            <div className='container-fluid '>
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="All Products"></Header>
                        <div className="row mt-3">

                            <div className="col-md-6">

                            </div>
                        </div>
                        <div className="col-12">
                            {
                                data.length > 0 ?
                                    <Card className='sticky-md-top '>
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-6">
                                                    <Card.Title> Data Filter</Card.Title>
                                                </div>
                                                <div className="col-6">
                                                    <span className='float-end'>
                                                        <button className='btn btn-dark me-2' onClick={handleShow}><Icons.UploadOutline size={22}></Icons.UploadOutline> Import Product</button>
                                                        <Link className='btn btn-dark' to="/product/add"><Icons.PlusOutline size={22}></Icons.PlusOutline> Add Product</Link>
                                                    </span>
                                                </div>
                                            </div>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                <div className="filterSelect">
                                                    {
                                                        columns && columns.map(column => <div className="form-check">
                                                            <input checked={searchColumns.includes(column)} type="checkbox" id={column} className="form-check-input"
                                                                onChange={(e) => {
                                                                    const checked = searchColumns.includes(column);
                                                                    setSearchColumns(prev =>
                                                                        checked ?
                                                                            prev.filter((sc) => sc !== column)
                                                                            : [...prev, column]
                                                                    )
                                                                }}
                                                            />
                                                            <label className="form-check-label pe-3" htmlFor={column}> {column}</label>
                                                        </div>
                                                        )
                                                    }

                                                </div>
                                            </Card.Subtitle>
                                            <Card.Text>
                                                <input value={q} onChange={(e) => setQ(e.target.value)} className='form-control' type="text" placeholder="Search..."></input>

                                            </Card.Text>

                                        </Card.Body>
                                    </Card>
                                    : ""
                            }
                        </div>
                        <div className="col-12">
                            {
                                data.length > 0 ?
                                    <Table data={search(data)} />
                                    :
                                    <div className='text-center mt-5 pt-5'>
                                        <IconContext.Provider value={{ color: "#1477BD", className: "global-class-name", size: 150 }}>
                                            <div>
                                                <IoBeerOutline />
                                            </div>
                                        </IconContext.Provider>
                                        <p>Loading ...</p>
                                    </div>
                            }
                        </div>
                    </div>

                </div>
            </div>
            <ProductImportModal
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                handleImportButton={handleImportButton}
                setCsvData={setCsvData}
            ></ProductImportModal>
            <Toaster
                position="bottom-right"
            />
        </div>
    );
};

export default Products;