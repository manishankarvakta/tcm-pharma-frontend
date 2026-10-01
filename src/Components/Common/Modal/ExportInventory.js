import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { useWarehouseQuery } from "../../../services/warehouseApi";
import { signInUser } from "../../Utility/Auth";
import CsvDownloader from "../CsvDownloader/CsvDownloader";
const user = signInUser();

const ExportInventory = ({ onShow, handleClose, exportdata, isSuccess }) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [tpTotal, setTpTotal] = useState(0);
  const [mrpTotal, setMrpTotal] = useState(0);
  // const { data, isSuccess } = useInventoryExportQuery();

  // useEffect(() => {
  //   console.log("InventoryExport:", data);
  // }, [isSuccess]);

  useEffect(() => {
    let x = 0;
    // console.log(data);
    let csvData = [];
    let tpSum = 0;
    let mrpSum = 0;
    const percent = Math.round(100 / exportdata?.length);
    console.log(percent);
    exportdata?.map((item) => {
      // console.log("item:", item);

      tpSum =
        parseFloat(tpSum) +
        parseFloat(item?.currentQty ? item?.currentQty : 0) *
          parseFloat(item?.product[0]?.tp ? item?.product[0]?.tp : 0);
      setTpTotal(tpSum);

      mrpSum =
        parseFloat(mrpSum) +
        parseFloat(item?.currentQty ? item?.currentQty : 0) *
          parseFloat(item?.product[0]?.mrp ? item?.product[0]?.mrp : 0);

      setMrpTotal(mrpSum);
      x++;
      let current =
        x > 0 ? (exportdata?.length > 0 ? (percent * x).toFixed(2) : 0) : 0;
      setCurrent(current);
      console.log("current", current);
      csvData = [
        ...csvData,
        {
          article_code: item?.article_code,
          name: item?.name,
          tp: item?.product[0]?.tp,
          mrp: item?.product[0]?.mrp,
          warehouse: item?.warehouse,
          qty: item?.currentQty,
          tpTotal:
            parseFloat(item?.currentQty ? item?.currentQty : 0) *
            parseFloat(item?.product[0]?.tp ? item?.product[0]?.tp : 0),
          mrpTotal:
            parseFloat(item?.currentQty ? item?.currentQty : 0) *
            parseFloat(item?.product[0]?.mrp ? item?.product[0]?.mrp : 0),
          status: item?.currentQty <= 0 ? "Out Of Stock" : "In Stock",
        },
      ];
    });
    setExportCSV(csvData);
    if (x >= exportdata?.length) {
      setDataReady(true);
    }
  }, [exportdata, isSuccess]);

  // console.log("x:", x);
  // console.log("Processed", data, " Of ", exportCSV);

  const headers = [
    { label: "article_code", key: "article_code" },
    { label: "name", key: "name" },
    { label: "qty", key: "qty" },
    { label: "tp", key: "tp" },
    { label: "mrp", key: "mrp" },
    { label: "Trade Value", key: "tpTotal" },
    { label: "Mrp Value", key: "mrpTotal" },
    { label: "warehouse", key: "warehouse" },
    // { label: "supplier", key: "supplier" },
    // { label: "date", key: "date" },
    { label: "status", key: "status" },
  ];

  // const footerRow = ["Total Trade Value", 100, " Total Mrp Value", 200];

  const footerRow = {
    [headers[5].key]: `Total TP :  ${tpTotal.toFixed(2)}`,
    [headers[6].key]: `Total MRP :  ${mrpTotal.toFixed(2)}`, // Use the key from the headers array
  };

  exportCSV.push(footerRow);

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  
  // const preHeader = [
  //   [`${user?.storeSettings?.storeName || "No-Name"}`],
  //   [`${user?.storeSettings?.address?.street || "No-Street"}`],
  //   [
  //     `${user?.storeSettings?.address?.city || "No-City"}-${
  //       user?.storeSettings?.address?.post || "No-PostalCode"
  //     }`,
  //   ],
  //   [`warehouse - ${whName || "No-Warehouse"}`],
  //   [`Aamar Id-${user?.aamarId || "No-Aamar Id"}`],
  //   [`Inventory Report`],

  //   [], // Empty row for spacing
  // ];
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Export Inventory</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {dataReady === false ? (
          <div className="d-flex flex-column align-items-center">
            <Spinner animation="border" variant="warning" size="lg" />
            {/* <Icons.ClockOutline className="icon-trash text-warning" size={80} /> */}
            <p className="text-dark mt-3 mb-3">
              <small>Please Wait! when Your Export is Getting ready!</small>
            </p>
            <ProgressBar
              className="w-100"
              striped
              variant="success"
              now={
                current > 0
                  ? exportdata?.length > 0
                    ? Math.fround(
                        (100 / exportdata?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? exportdata?.length > 0
                    ? Math.fround(
                        (100 / exportdata?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current - 1} of ${exportdata?.length}`}
            />
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <Icons.CheckCircleOutline
              className="icon-trash text-success"
              size={100}
            />
            <p className="text-dark my-3">Your Export is ready!</p>
            {/* <CSVLink
              className="btn btn-dark"
              data={exportCSV}
              asyncOnClick={true}
              headers={headers}
              filename={`Export Inventory Data - [${today.toDateString()}].csv`}
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Inventory Data
            </CSVLink> */}
            <CsvDownloader
              // preheader={preHeader}
              buttonName={
                <span>
                  <Icons.DownloadOutline
                    className="icon-trash text-warning"
                    size={22}
                  />{" "}
                  Download Inventory Report
                </span>
              }
              data={exportCSV}
              fileName={`Export Inventory Report - [${today.toDateString()}].csv`}
            />
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

export default ExportInventory;
