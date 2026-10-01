import React, { useEffect, useState } from 'react';
import { Button, Modal, ProgressBar, Spinner } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import * as Icons from "heroicons-react";

const SupllierMatchedProduct = ({ onShow, handleClose, exportPopular }) => {
    console.log(exportPopular)
    const [exportCSV, setExportCSV] = useState([]);
    const [dataReady, setDataReady] = useState(false);
    const [current, setCurrent] = useState(0);
    let csvData = [];
    let x = 0;
    const processCSV = async (exportPopular) => {
        exportPopular?.map((item) => {
            x++;
            csvData = [
                ...csvData,
                {
                    // date: format(new Date(item.date), "MM/dd/yyyy"),
                    // code: item.article_code,
                    // _id: item?._id,
                    article_code: item?.article_code,


                    // opening_qty: item.qty,
                    // current_qty: item.qty,
                    // sold_qty: 0,
                    // total_qty: item.qty,
                },
            ];
        });
        setCurrent(x);
        setDataReady(true);
        setExportCSV(csvData);
    };

    useEffect(() => {
        if (exportPopular?.length > 0) {
            processCSV(exportPopular);
        }
    }, [exportPopular]);

    const headers = [
        // { label: "_id", key: "_id" },
        { label: "article_code", key: "article_code" },
    ];
    return (
        <Modal show={onShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Export Popular Products</Modal.Title>
            </Modal.Header>
            {/* <Modal.Body >
        {/* <CSVLink data={csvData}>
          Download me
          </CSVLink> */}
            {/* <CSVLink data={exportCSV} asyncOnClick={true} headers={headers}>
            {exportCSV.length > 0
                ? "Preparing csv for Download..."
                : "Download Product Details"}
        </CSVLink>
    </Modal.Body> */}
            <Modal.Body className="text-center">
                {dataReady === false ? (
                    <div className="d-flex flex-column align-items-center">
                        <Spinner animation="grow" variant="warning" size="sm" />
                        <Icons.ClockOutline className="icon-trash text-warning" size={80} />
                        <p className="text-dark mt-3 mb-3">
                            <small>Please Wait! when Your Export is Getting ready!</small>
                        </p>
                        <ProgressBar
                            className="w-100"
                            striped
                            variant="success"
                            now={
                                current > 0
                                    ? exportPopular?.length > 0
                                        ? Math.fround((100 / exportPopular?.length) * current)?.toFixed(2)
                                        : 0
                                    : 0
                            }
                            label={`${current > 0
                                ? exportPopular?.length > 0
                                    ? Math.fround((100 / exportPopular?.length) * current)?.toFixed(2)
                                    : 0
                                : 0
                                }%  - ${current} of ${exportPopular?.length}`}
                        />
                    </div>
                ) : (
                    <div className="d-flex flex-column align-items-center">
                        <Icons.CheckCircleOutline
                            className="icon-trash text-success"
                            size={100}
                        />
                        <p className="text-dark my-3">Your Export is ready!</p>
                        <CSVLink
                            className="btn btn-dark"
                            data={exportCSV}
                            asyncOnClick={true}
                            headers={headers}
                            filename="Export_SupplierMatch.csv"
                        >
                            <Icons.DownloadOutline
                                className="icon-trash text-warning"
                                size={22}
                            />{" "}
                            Download Popular Products
                        </CSVLink>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SupllierMatchedProduct;