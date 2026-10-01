import React, { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useProductsExportQuery } from "../../../services/productApi";

const COGS = ({ onShow, handleClose, exportProduct }) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);

  // console.log(exportProduct.length);

  // const { data, isSuccess } = useProductsExportQuery();
  //   let csvData = [];
  //   let x = 0;
  //   const processCSV = async (exportProduct) => {
  //     exportProduct?.map((item) => {
  //       x++;
  //       csvData = [
  //         ...csvData,
  //         {
  //           // date: format(new Date(item.date), "MM/dd/yyyy"),
  //           // code: item.article_code,
  //           _id: item._id,
  //           name: item.name,
  //           article_code: item.article_code,
  //           unit: item.unit,
  //           // opening_qty: item.qty,
  //           // current_qty: item.qty,
  //           // sold_qty: 0,
  //           // total_qty: item.qty,
  //         },
  //       ];
  //     });
  //     setCurrent(x);
  //     setDataReady(true);
  //     setExportCSV(csvData);
  //   };

  //   useEffect(() => {
  //     processCSV(exportProduct);
  //   }, [exportProduct]);

  const headers = [
    { label: "Invoice No", key: "invoiceId" },
    { label: "Article Code", key: "article_code" },
    { label: "Mrp", key: "mrp" },
    { label: "Qty", key: "qty" },
    { label: "Date", key: "date" },

    // { label: "Opening Qty", key: "opening_qty" },
    // { label: "Sold Qty", key: "sold_qty" },
    // { label: "Total Qty", key: "total_qty" },
  ];

  return (
    <Modal show={onShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Article Sale</Modal.Title>
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
        {dataReady === true ? (
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
                  ? exportProduct?.length > 0
                    ? Math.fround(
                        (100 / exportProduct?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? exportProduct?.length > 0
                    ? Math.fround(
                        (100 / exportProduct?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current} of ${exportProduct?.length}`}
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
              data={exportProduct}
              asyncOnClick={true}
              headers={headers}
              filename="Export_Article_Sale.csv"
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Products Data
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

export default COGS;
