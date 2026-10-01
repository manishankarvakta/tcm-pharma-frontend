import React, { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import * as Icons from "heroicons-react";

const PriceExportModal = ({ onShow, handleClose, exportPrice }) => {
  // console.log(exportPrice)
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);
  let csvData = [];
  let x = 0;
  const processCSV = async (exportPrice) => {
    exportPrice?.map((item) => {
      x++;
      csvData = [
        ...csvData,
        {
          // date: format(new Date(item.date), "MM/dd/yyyy"),
          // code: item.article_code,
          _id: item?._id,
          article_code: item?.article_code?.article_code,
          tp: item?.tp,
          mrp: item?.mrp,
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
    if (exportPrice?.length > 0) {
      processCSV(exportPrice);
    }
  }, [exportPrice]);

  const headers = [
    { label: "_id", key: "_id" },
    { label: "article_code", key: "article_code" },
    { label: "tp", key: "tp" },
    { label: "mrp", key: "mrp" },

    // { label: "Opening Qty", key: "opening_qty" },
    // { label: "Sold Qty", key: "sold_qty" },
    // { label: "Total Qty", key: "total_qty" },
  ];

  return (
    <Modal show={onShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Price Details</Modal.Title>
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
                  ? exportPrice?.length > 0
                    ? Math.fround(
                        (100 / exportPrice?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? exportPrice?.length > 0
                    ? Math.fround(
                        (100 / exportPrice?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current} of ${exportPrice?.length}`}
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
              filename="Export_Price.csv"
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Price Data
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

export default PriceExportModal;
