// import React from "react";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";
// import { format } from "date-fns";
import {
  useProductLedgerExportQuery,
  // useProductTotalLedgerQuery,
} from "../../../services/productApi";

const ExportStockCalculationSummary = ({ onShow, handleClose, start, end }) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [stockTotalSum, setStockTotalSum] = useState(0);

  // const { data, isSuccess } = useProductTotalLedgerQuery();
  const { data, isSuccess } = useProductLedgerExportQuery({ start, end });

  // console.log("data", data);

  useEffect(() => {
    // console.log(data);
    let csvData = [];
    let stockSum = 0;
    let x = 0;
    data?.map((product) => {
      // console.log("item:", product);

      x++;
      setCurrent(x);
      // console.log("current", x);

      stockSum =
        parseFloat(stockSum) +
        parseFloat(
          parseFloat(product?.tp) *
            (product?.grnPQty +
              product?.saleRPQty -
              product?.salePQty -
              product?.damagePQty -
              product?.rtvPQty -
              product?.tpnPQty +
              (product?.grnQty +
                product?.saleRQty -
                product?.saleQty -
                product?.damageQty -
                product?.rtvQty -
                product?.tpnQty))
        ).toFixed(2);

      csvData = [
        ...csvData,
        {
          article_code: product?.article_code,
          name: product?.name,
          group: product?.group?.name,
          tp: product?.tp,
          mrp: product?.mrp,

          closing:
            product?.grnPQty +
            product?.saleRPQty -
            product?.salePQty -
            product?.damagePQty -
            product?.rtvPQty -
            product?.tpnPQty +
            (product?.grnQty +
              product?.saleRQty -
              product?.saleQty -
              product?.damageQty -
              product?.rtvQty -
              product?.tpnQty),

          stockValue: (
            parseFloat(product?.tp) *
            (product?.grnPQty +
              product?.saleRPQty -
              product?.salePQty -
              product?.damagePQty -
              product?.rtvPQty -
              product?.tpnPQty +
              (product?.grnQty +
                product?.saleRQty -
                product?.saleQty -
                product?.damageQty -
                product?.rtvQty -
                product?.tpnQty))
          ).toFixed(2),
        },
      ];
    });
    setStockTotalSum(stockSum);
    // console.log("current", x);
    setExportCSV(csvData);
    // console.log(x);
    if (x >= data?.length) {
      setDataReady(true);
    }
  }, [data, isSuccess, start, end]);

  // console.log(current);
  // console.log("Processed", exportCSV);

  const headers = [
    { label: "Article Code", key: "article_code" },
    { label: "Name", key: "name" },
    { label: "Group", key: "group" },
    { label: "TP", key: "tp" },
    { label: "MRP", key: "mrp" },
    { label: "Closing", key: "closing" },
    { label: "Stock Value", key: "stockValue" },
  ];

  // const footerRow = ["Total Trade Value", 100, " Total Mrp Value", 200];

  const footerRow = {
    [headers[5].key]: `Today Total Stock Value :  ${parseFloat(
      stockTotalSum
    )?.toFixed(2)}`,
    // Use the key from the headers array
  };

  exportCSV.push(footerRow);

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Export Product Summary</Modal.Title>
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
              }%  - ${current - 1} of ${data?.length}`}
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
              filename={`Export Product Summary - [${start} to ${end}].csv`}
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Product Ledger
            </CSVLink>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="darkOutline" onClick={handleClose}>
          <Icons.X className="icon-trash text-danger" size={22} /> Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportStockCalculationSummary;
