// import React from "react";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";
// import { format } from "date-fns";
// import {
//   useProductLedgerExportQuery,
//   useProductTotalLedgerQuery,
// } from "../../../services/productApi";
import axios from "../../../services/apiClient";

const ExportStockCalculation = ({ onShow, handleClose, start, end }) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [product, setProduct] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // const { data, isSuccess } = useProductTotalLedgerQuery();

  const productByCode = async (id, start, end) => {
    try {
      const productData = await axios.get(
        `${BASE_URL}/product/ledger/export/${start}/${end}`
      );
      setProduct(productData.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    productByCode();
  }, []);

  useEffect(() => {
    // console.log(product);
    let csvData = [];
    let stockSum = 0;
    let x = 0;
    product?.map((pro) => {
      // console.log("item:", pro);

      x++;
      setCurrent(x);
      // console.log("current", x);

      stockSum =
        parseFloat(stockSum) +
        parseFloat(
          parseFloat(pro?.tp) *
            (pro?.grnPQty +
              pro?.saleRPQty -
              pro?.salePQty -
              pro?.damagePQty -
              pro?.rtvPQty -
              pro?.tpnPQty +
              (pro?.grnQty +
                pro?.saleRQty -
                pro?.saleQty -
                pro?.damageQty -
                pro?.rtvQty -
                pro?.tpnQty))
        ).toFixed(2);

      csvData = [
        ...csvData,
        {
          article_code: pro?.article_code,
          name: pro?.name,
          group: pro?.group?.name,
          tp: pro?.tp,
          mrp: pro?.mrp,
          opening:
            pro?.grnPQty +
            pro?.saleRPQty -
            pro?.salePQty -
            pro?.damagePQty -
            pro?.rtvPQty -
            pro?.tpnPQty,
          grn: pro?.grnQty,
          sale: pro?.saleQty,
          saleReturn: pro?.saleRQty,
          rtv: pro?.rtvQty,
          damage: pro?.damageQty,
          tpn: pro?.tpnQty,

          closing:
            pro?.grnPQty +
            pro?.saleRPQty -
            pro?.salePQty -
            pro?.damagePQty -
            pro?.rtvPQty -
            pro?.tpnPQty +
            (pro?.grnQty +
              pro?.saleRQty -
              pro?.saleQty -
              pro?.damageQty -
              pro?.rtvQty -
              pro?.tpnQty),

          stockValue: (
            parseFloat(pro?.tp) *
            (pro?.grnPQty +
              pro?.saleRPQty -
              pro?.salePQty -
              pro?.damagePQty -
              pro?.rtvPQty -
              pro?.tpnPQty +
              (pro?.grnQty +
                pro?.saleRQty -
                pro?.saleQty -
                pro?.damageQty -
                pro?.rtvQty -
                pro?.tpnQty))
          ).toFixed(2),
        },
      ];
    });
    // console.log("current", x);
    setExportCSV(csvData);
    // console.log(x);
    if (x >= product?.length) {
      setDataReady(true);
    }
  }, [product]);

  // console.log(current);
  // console.log("Processed", exportCSV);

  const headers = [
    { label: "Article Code", key: "article_code" },
    { label: "Name", key: "name" },
    { label: "Group", key: "group" },
    { label: "TP", key: "tp" },
    { label: "MRP", key: "mrp" },
    { label: "Opening", key: "opening" },
    { label: "GRN", key: "grn" },
    { label: "Sale", key: "sale" },
    { label: "Sale Return", key: "saleReturn" },
    { label: "RTV", key: "rtv" },
    { label: "Damage", key: "damage" },
    { label: "TPN", key: "tpn" },
    { label: "Closing", key: "closing" },
    { label: "Stock Value", key: "stockValue" },
  ];

  // const footerRow = ["Total Trade Value", 100, " Total Mrp Value", 200];

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
        <Modal.Title>Export Product Details</Modal.Title>
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
                  ? product?.length > 0
                    ? Math.fround((100 / product?.length) * current)?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? product?.length > 0
                    ? Math.fround((100 / product?.length) * current)?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current - 1} of ${product?.length}`}
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
              filename={`Export Product Data - [${start} to ${end}].csv`}
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

export default ExportStockCalculation;
