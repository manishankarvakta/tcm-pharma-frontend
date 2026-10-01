import React, { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useProductsExportQuery } from "../../../services/productApi";
import { saveAs } from "file-saver";

const ProductDetailsExportModal = ({
  preheader = [],
  onShow,
  handleClose,
  exportProduct,
}) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);

  // console.log(exportProduct)

  // const { data, isSuccess } = useProductsExportQuery();
  let csvData = [];
  let x = 0;
  const processCSV = async (exportProduct) => {
    exportProduct?.map((item) => {
      x++;
      csvData = [
        ...csvData,
        {
          // date: format(new Date(item.date), "MM/dd/yyyy"),
          // code: item.article_code,
          _id: item?._id,
          name: item?.name,
          article_code: item?.article_code,
          // unit: item?.unit,
          groupId: item?.group?._id ? item?.group?._id : "No group Found",
          group: item?.group?.name ? item?.group?.name : "No group Found",
          genericId: item?.generic?._id
            ? item?.generic?._id
            : "No generic Found",
          generic: item?.generic?.name
            ? item?.generic?.name
            : "No generic Found",
          brandId: item?.brand?._id ? item?.brand?._id : "No brand Found",
          brand: item?.brand?.name ? item?.brand?.name : "No brand Found",
          tp: item.tp,
          mrp: item.mrp,
          pcsBox: item.pcsBox,
          // total_qty: item.qty,
        },
      ];
    });
    setCurrent(x);
    setDataReady(true);
    setExportCSV(csvData);
  };

  useEffect(() => {
    if (exportProduct?.length > 0) {
      processCSV(exportProduct);
    }
  }, [exportProduct]);

  const headers = [
    { label: "ID", key: "_id" },
    { label: "Name", key: "name" },
    { label: "Article Code", key: "article_code" },
    { label: "groupId", key: "groupId" },
    { label: "group", key: "group" },
    { label: "genericId", key: "genericId" },
    { label: "generic", key: "generic" },
    { label: "brandId", key: "brandId" },
    { label: "brand", key: "brand" },
    { label: "tp", key: "tp" },
    { label: "mrp", key: "mrp" },
    { label: "pcsBox", key: "pcsBox" },

    // { label: "Opening Qty", key: "opening_qty" },
    // { label: "Sold Qty", key: "sold_qty" },
    // { label: "Total Qty", key: "total_qty" },
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
    saveAs(blob, `Product Details Export - [${today.toDateString()}].csv`);
  };

  return (
    <Modal show={onShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Product Details</Modal.Title>
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
           <Button
              className="btn btn-dark"
              onClick={downloadCSV} // Trigger the downloadCSV function
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Product Data
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

export default ProductDetailsExportModal;
