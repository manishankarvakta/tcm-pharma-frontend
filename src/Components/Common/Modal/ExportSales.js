import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

const ExportSales = ({ show, handleClose, sales }) => {
    const dateFormate = date => {
        const d = new Date(date);
        var day = d.getDate();
        var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        var year = d.getFullYear();
        var newDate = month + "/" + day + "/" + year;

        return newDate;
    }
    const [exportCSV, setExportCSV] = useState([]);

    useEffect(()=>{
        let csvData = [];
        sales.map(item => {
            csvData = [...csvData, {
                invoice_no: item._id,
                date: dateFormate(item.date),
                biller_id: item.biller_id,
                customer_id: item.customer_id,
                total_item: item.total_item,
                total: item.total,
                vat: item.vat,
                total_round: item.total_round,
                total_received: item.total_received,
                cash: item.paid_amount.cash,
                card: item.paid_amount.card[1],
                mfs: item.paid_amount.mfs[1],
                change_amount: item.change_amount,
                status: item.status
            }]
        });
        setExportCSV(csvData);
    },[sales])
    // console.log(exportCSV);
    
    const headers = [
        { label: "Invoice No", key: "invoice_no" },
        { label: "Date", key: "date" },
        { label: "Biller", key: "biller_id" },
        { label: "Customer", key: "customer_id" },
        { label: "Item No", key: "total_item" },
        { label: "Total", key: "total" },
        { label: "Vat", key: "vat" },
        { label: "Total Round", key: "total_round" },
        { label: "Paid Amount", key: "total_received" },
        { label: "Cash", key: "cash" },
        { label: "Card", key: "card" },
        { label: "MFS", key: "mfs" },
        { label: "Change Amount", key: "change_amount" },
        { label: "Status", key: "status" },

    ];

    

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Export Sales</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {/* <CSVLink data={csvData}>
                Download me
                </CSVLink> */}
                <CSVLink
                    data={exportCSV}
                    asyncOnClick={true}
                    headers={headers}
                >
                    {exportCSV === [] ? 'Loading csv...' : 'Download Sales'}
                </CSVLink>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default ExportSales;