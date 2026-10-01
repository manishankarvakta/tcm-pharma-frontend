import React, { useState } from 'react';
import CsvImporterInventory from '../Common/CsvImporter/CsvImporterInventory';
import Header from '../Common/Header/Header';
import SideBar from '../Common/SideBar/SideBar';
import { ProgressBar, Table } from "react-bootstrap";
import "./Inventory.css";
import * as Icons from "heroicons-react";
import { useAdjustInventoryMutation } from '../../services/inventoryApi';

const InventoryAdjust = () => {
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
    // const {data, error,isSuccess} = useInventoryByArticleQuery()
    let i = 0;
    const [inventories, setInventories] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [current, setCurrent] = useState(0);
    // HANDLE IMPORT BUTTON
    console.log(csvData)
    const [adjustInventory] = useAdjustInventoryMutation()
    const handleImportButton = async () => {

        let counter = 0;
        const timer = setInterval(function () {

            setCurrent(counter);
            console.log(csvData[counter])
            adjustInventory(csvData)
            //   importInventory(csvData[counter]);
            counter++;
            console.log("length", counter, csvData.length);
            if (counter > csvData.length) {
                clearInterval(timer);
            }
        }, 10);
    }
    return (
        <div>
            <div className="container-fluid ">
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="Inventory Adjust"></Header>
                        <CsvImporterInventory
                            setCsvData={setCsvData}
                            csvData={csvData}
                            title="Adjust Data"
                            handleImportButton={handleImportButton}
                        ></CsvImporterInventory>
                        {/* ProgressBAr */}
                        <ProgressBar
                            striped
                            variant="success"
                            now={
                                current > 0
                                    ? csvData?.length > 0
                                        ? Math.fround((100 / csvData?.length) * current)?.toFixed(2)
                                        : 0
                                    : 0
                            }
                            label={`${current > 0
                                ? csvData?.length > 0
                                    ? Math.fround((100 / csvData?.length) * current)?.toFixed(2)
                                    : 0
                                : 0
                                }%  - ${current} of ${csvData?.length}`}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryAdjust;