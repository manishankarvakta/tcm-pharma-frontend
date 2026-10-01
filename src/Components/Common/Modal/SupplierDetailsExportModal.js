import { saveAs } from "file-saver";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";

const SupplierDetailsExportModal = ({
  preheader = [],
  onShow,
  handleClose,
  exportSupplier,
}) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);

  let csvData = [];
  let x = 0;
  const processCSV = async (exportSupplier) => {
    exportSupplier?.map((item) => {
      x++;
      csvData = [
        ...csvData,
        {
          // date: format(new Date(item.date), "MM/dd/yyyy"),
          // code: item.article_code,
          _id: item._id,
          name: item.name,
          company: item.company,
          code: item.code,
          phone: item.phone,
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
    if (exportSupplier?.length > 0) {
      processCSV(exportSupplier);
    }
  }, [exportSupplier]);

  const headers = [
    { label: "id", key: "_id" },
    { label: "name", key: "name" },
    { label: "company", key: "company" },
    { label: "code", key: "code" },
    { label: "phone", key: "phone" },
  ];
  const convertArrayOfObjectsToCSV = (array, preheader) => {
    if (!array || !array.length) return null;

    const headers = Object.keys(array[0]);
    const csvData = [
      ...preheader.map((row) => row.join(",")), // Add preheader rows
      headers.join(","), // Add header row
      ...array.map((row) =>
        headers
          .map((fieldName) => JSON.stringify(row[fieldName]) || "")
          .join(",")
      ),
    ];

    return csvData.join("\r\n");
  };

  const downloadCSV = () => {
    const csvString = convertArrayOfObjectsToCSV(exportCSV, preheader);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const today = new Date();
    const fileName = `Supplier Details Export - [${today.toDateString()}].csv`;
    saveAs(blob, fileName); // Assuming `saveAs` is imported from 'file-saver'
  };

  return (
    <Modal show={onShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Supplier Details</Modal.Title>
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
                  ? exportSupplier?.length > 0
                    ? Math.fround(
                        (100 / exportSupplier?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? exportSupplier?.length > 0
                    ? Math.fround(
                        (100 / exportSupplier?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current} of ${exportSupplier?.length}`}
            />
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <Icons.CheckCircleOutline
              className="icon-trash text-success"
              size={100}
            />
            <p className="text-dark my-3">Your Export is ready!</p>
            <Button
              className="btn btn-dark"
              onClick={downloadCSV} // Trigger the downloadCSV function
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Supplier Data
            </Button>
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

export default SupplierDetailsExportModal;
