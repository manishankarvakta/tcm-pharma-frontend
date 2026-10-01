import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { mcByCode, categoryByCode } from "../../Utility/Utility";
import { format } from "date-fns";
const InventorySessionExport = ({ show, handleClose, exportInventory }) => {
  const [exportCSV, setExportCSV] = useState([]);
  let csvData = [];
  const processCSV = async (exportInventory) => {
    exportInventory.map((item) => {
      csvData = [
        ...csvData,
        {
          date: format(new Date(item.date), "MM/dd/yyyy"),
          code: item.article_code,
          name: item.name,
          opening_qty: item.qty,
          current_qty: item.qty,
          sold_qty: 0,
          total_qty: item.qty,
        },
      ];
    });
    setExportCSV(csvData);
  };

  useEffect(() => {
    processCSV(exportInventory);
  }, [exportInventory]);
  // console.log(sales);
  // console.log(exportCSV);

  const headers = [
    { label: "Date", key: "date" },
    { label: "Code", key: "code" },
    { label: "Current Qty", key: "current_qty" },
    { label: "Opening Qty", key: "opening_qty" },
    { label: "Sold Qty", key: "sold_qty" },
    { label: "Total Qty", key: "total_qty" },
  ];

  // console.log(exportInventory);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Inventory Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <CSVLink data={csvData}>
                Download me
                </CSVLink> */}
        <CSVLink data={exportCSV} asyncOnClick={true} headers={headers}>
          {exportCSV.length > 0
            ? "Preparing csv for Download..."
            : "Download Inventory Session"}
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

export default InventorySessionExport;
