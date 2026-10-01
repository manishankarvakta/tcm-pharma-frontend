import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { mcByCode, categoryByCode } from "../../Utility/Utility";

const ExportArticleSales = ({ show, handleClose, sales }) => {
  const dateFormate = (date) => {
    const d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var newDate = month + "/" + day + "/" + year;

    return newDate;
  };
  const [exportCSV, setExportCSV] = useState([]);
  let csvData = [];
  const processCSV = async (sales) => {
    sales.map((item) => {
      // console.log(item.products)
      item?.products?.map((product) => {
        csvData = [
          ...csvData,
          {
            invoice_no: item?._id,
            date: dateFormate(item.date),
            // Product Loop
            code: product.article_code,
            tp: product.tp,
            mrp: product.mrp,
            name: product.name,
            vat: product.vat,
            qty: product.qty,
            salesValue: product.qty * product.mrp,
          },
        ];
      });
    });
    setExportCSV(csvData);
  };

  useEffect(() => {
    processCSV(sales);
  }, [sales]);
  // console.log(sales);
  // console.log(exportCSV);

  const headers = [
    { label: "Invoice No", key: "invoice_no" },
    { label: "Date", key: "date" },
    { label: "Code", key: "code" },
    { label: "Name", key: "name" },
    { label: "Qty", key: "qty" },
    { label: "TP", key: "tp" },
    { label: "MRP", key: "mrp" },
    { label: "vat", key: "vat" },
    { label: "Sale Value", key: "salesValue" },
    // { label: "Category", key: "cash" },
    // { label: "MC", key: "card" },
  ];

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Article Sales</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <CSVLink data={csvData}>
                Download me
                </CSVLink> */}
        <CSVLink data={exportCSV} asyncOnClick={true} headers={headers}>
          {exportCSV === [] ? "Loading csv..." : "Download Article Sales"}
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

export default ExportArticleSales;
