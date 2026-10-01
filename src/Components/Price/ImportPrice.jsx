import React, { useState } from 'react';
import CsvImporterPrice from '../Common/CsvImporter/CsvImporterPrice';
import Header from '../Common/Header/Header';
import SideBar from '../Common/SideBar/SideBar';
import {
    useAddPriceMutation,
    useUpdatePriceMutation,
} from "../../services/priceApi";
import { notify } from '../Utility/Notify';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useUpdateProductMutation } from '../../services/productApi';
import { ProgressBar } from 'react-bootstrap';
import * as Icons from "heroicons-react";
const ImportPrice = () => {
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
    const [csvData, setCsvData] = useState([]);
    const [updateProduct] = useUpdateProductMutation();

console.log(csvData)
    const [addPrice] = useAddPriceMutation();
    const [updatePrice] = useUpdatePriceMutation();
    const [pp, setPp] = useState(0);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgressCount, setImportProgressCount] = useState(0);
    const [importStartTime, setImportStartTime] = useState(null);
    const [importDuration, setImportDuration] = useState(0);
    const [isImportedDone, setIsImportedDone] = useState(false);
    const getPriceDat = async (id)=>{
        await axios.get(`${BASE_URL}/product/price/${id}`).then(res=> {
            const priceList = res.data.priceList;
            return priceList;
        })
    }

    // ADD PRICE LIST TO PRODUCT
  const addToProduct = async (productId, priceData) => {
    // const priceData = priceData;
    // const createdMessage = priceData.message;
    // get priceData
    const oldPrice = getPriceDat(productId)
console.log(oldPrice)
    // get product price list
    // let oldPrice = ProductPriceList.data.priceList;

    // compare and update the price
    if (oldPrice === null) {
      const newPrice = [priceData];
      const updatePrice = { _id: productId, priceList: newPrice };
      // update product price
      const response = await updateProduct(updatePrice);
      console.log(updatePrice);
      console.log(newPrice);
      if (response) {
        console.log(response);
        notify("Price Created Successful!", "success");
      }
    } else {
        let rest 
        if(oldPrice?.lngth >0 ){
            let rest = oldPrice?.filter((price) => price !== priceData);
        }else{
            rest  =[];
        }
      const newPrice = [...rest, priceData];
      const updatePrice = { _id: productId, priceList: newPrice };
      // update product price
      console.log(updatePrice);
      console.log(newPrice);
      const response = await updateProduct(updatePrice);
      if (response) {
        console.log(response);
        // notify(createdMessage, "success")
        notify("Price Update Successful!", "success");
      }
    }
    // show notification
  };
    
    const handleImportPrice = async () => {
        setIsImporting(true);
        setPp(0);
        setImportProgressCount(0);
        const startTime = Date.now();
        setImportStartTime(startTime);
        setIsImportedDone(true);

        const totalItems = csvData.length;
        let completedCount = 0;
        const batchSize = 10;

        for (let i = 0; i < totalItems; i += batchSize) {
            const batch = csvData.slice(i, i + batchSize);
            
            await Promise.all(batch.map(async (item) => {
                try {
                    if (item?._id) {
                        await updatePrice(item).unwrap();
                        notify(`Price Updated: ${item.article_code}`, "success");
                    } else {
                        const productId = item.article_code;
                        const res = await addPrice(item).unwrap();
                        const newPriceID = res.data.id;
                        await addToProduct(productId, newPriceID);
                    }
                } catch (error) {
                    notify(`Failed: ${item.article_code}`, "error");
                } finally {
                    completedCount++;
                    setImportProgressCount(completedCount);
                    setPp(Math.round((completedCount / totalItems) * 100));
                }
            }));
        }

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        setImportDuration(duration);
        setIsImporting(false);
        console.log("Import Data Done");
    }

    let i = 1;
    return (
        <div>
            <div className="container-fluid ">
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="Import Product Price"></Header>
                        <div className="row">
                            <div className="col-md-4 offset-md-4">
                                {/* <div className="d-flex flex-column justify-content-center min-vh-100  align-items-center"> */}
                                <div className="pt-5 pb-5">
                                    <CsvImporterPrice
                                        setCsvData={setCsvData}
                                        handleImportButton={handleImportPrice}
                                    ></CsvImporterPrice>
                                    
                                    {isImporting && (
                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <small className="fw-bold text-primary">
                                                    Importing: {importProgressCount} / {csvData.length}
                                                </small>
                                                <small className="text-secondary">{pp}%</small>
                                            </div>
                                            <ProgressBar animated now={pp} variant="primary" />
                                        </div>
                                    )}

                                    {importDuration > 0 && !isImporting && (
                                        <div className="mt-2 text-center text-success bg-success bg-opacity-10 p-2 rounded">
                                            <Icons.Clock size="16" className="me-1" />
                                            Import Completed in {importDuration}s
                                        </div>
                                    )}
                                    {/* SPINNER */}
                                    {/* */}

                                    {/* </div> */}

                                </div>
                            </div>
                            <div className="col-md-12">
                                <table class="table table-striped ">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>_id</th>
                                            <th>Warehouse</th>
                                            <th>Supplier</th>
                                            <th>article_code</th>
                                            <th>tp</th>
                                            <th>mrp</th>

                                        </tr>
                                    </thead>
                                    <tbody>

                                        { }
                                        {
                                            csvData ?

                                                csvData.map(item =>
                                                    <tr key={i++}>
                                                        <th>{i}</th>
                                                        <td>{item._id ? item._id : "- no id -"}</td>
                                                        <td>{item.warehouse}</td>
                                                        <td>{item.supplier}</td>
                                                        <td>{item.article_code}</td>
                                                        <td>{item?.tp} <small><b>BDT</b></small></td>
                                                        <td>{item?.mrp} <small><b>BDT</b></small></td>
                                                    </tr>
                                                ) :
                                                <div className="spinner-border text-danger" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Toaster position="bottom-right" />
                </div>
            </div>
        </div>
    );
};

export default ImportPrice;