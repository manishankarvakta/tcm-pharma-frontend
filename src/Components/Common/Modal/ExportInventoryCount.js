import { format } from "date-fns";
// import React from "react";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";

const ExportInventoryCount = ({ show, handleClose, data }) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);

  // console.log(data)
  useEffect(() => {
    let csvData = [];
    let x = 0;
    data?.map((item) => {
      x++;
      // console.log(x);
      csvData = [
        ...csvData,
        {
          article_code: item?.article_code?.article_code,
          name: item?.article_code?.name,
          tp: item?.article_code?.tp,
          mrp: item?.article_code?.mrp,
          warehouse_name: item?.warehouse?.name,
          warehouse: item?.warehouse._id,
          qty: item?.qty,
          user: item?.userId?.name,
          date: format(new Date(item?.createdAt), "MM-dd-yyyy hh:mm "),
          status: item?.status,
        },
      ];
    });
    setCurrent(x);
    setDataReady(true);
    setExportCSV(csvData);
  }, [data]);
  // console.log(data);

  const headers = [
    { label: "article_code", key: "article_code" },
    { label: "name", key: "name" },
    { label: "tp", key: "tp" },
    { label: "mrp", key: "mrp" },
    { label: "qty", key: "qty" },
    { label: "warehouse_name", key: "warehouse_name" },
    { label: "warehouse", key: "warehouse" },
    { label: "date", key: "date" },
    { label: "user", key: "user" },
    { label: "status", key: "status" },
  ];

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Export Inventory Count</Modal.Title>
      </Modal.Header>
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
                  ? data?.length > 0
                    ? Math.fround((100 / data?.length) * current)?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? data?.length > 0
                    ? Math.fround((100 / data?.length) * current)?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current} of ${data?.length}`}
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
              filename="Inventory Session Count Data.csv"
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Inventory Session Data
            </CSVLink>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="darkOutline" onClick={handleClose}>
          <Icons.X className="icon-trash text-danger" size={22} /> Cancle
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportInventoryCount;
