import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { useWarehouseQuery } from "../../../services/warehouseApi";
import { signInUser } from "../../Utility/Auth";
import CsvDownloader from "../CsvDownloader/CsvDownloader";
const auth = signInUser();
const storeSettings = auth?.storeSettings;

const CustomerExportModal = ({ onShow, handleClose, exportCustomer }) => {
  const [exportCSV, setExportCSV] = useState([]);
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const [dataReady, setDataReady] = useState(false);
  const { data: wh, refetch } = useWarehouseQuery(auth?.warehouse);
  const [whName, setWhName] = useState(" ");

  const [current, setCurrent] = useState(0);

  let csvData = [];
  let x = 0;
  const processCSV = async (exportCustomer) => {
    exportCustomer?.map((item) => {
      x++;
      csvData = [
        ...csvData,
        {
          name: item.name,
          // email: item.email,
          // username: item.username,
          // membership: item.membership,
          // address: item.address,
          // point: item.point,
          phone: item.phone,
          warehouse: item?.warehouse?.name,
        },
      ];
    });
    setCurrent(x);
    setDataReady(true);
    setExportCSV(csvData);
  };

  useEffect(() => {
    processCSV(exportCustomer);
  }, [exportCustomer]);

  const headers = [
    { label: "name", key: "name" },
    // { label: "email", key: "email" },
    // { label: "username", key: "username" },
    // { label: "membership", key: "membership" },
    // { label: "address", key: "address" },
    // { label: "point", key: "point" },
    { label: "phone", key: "phone" },
    { label: "Warehouse", key: "warehouse" },
  ];
  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  const preHeader = [
    [`${storeSettings?.storeName || "No-Name"}`],
    [`${storeSettings?.address?.street || "No-Street"}`],
    [
      `${storeSettings?.address?.city || "No-City"}-${
        storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${auth?.aamarId || "No-Aamar Id"}`],
    [`Customer Details`],

    [], // Empty row for spacing
  ];
  return (
    <Modal show={onShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Customer Details</Modal.Title>
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
                  ? exportCustomer?.length > 0
                    ? Math.fround(
                        (100 / exportCustomer?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? exportCustomer?.length > 0
                    ? Math.fround(
                        (100 / exportCustomer?.length) * current
                      )?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current} of ${exportCustomer?.length}`}
            />
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <Icons.CheckCircleOutline
              className="icon-trash text-success"
              size={100}
            />
            <p className="text-dark my-3">Your Export is ready!</p>
            <CsvDownloader
              preheader={preHeader}
              // headers={exportHeader}
              buttonName="Download Customers Data"
              data={exportCSV.length > 0 ? exportCSV : []}
              fileName={`Export Customer Data - [${today.toDateString()}].csv`}
            />
            {/* <CSVLink
              className="btn btn-dark"yy
              data={exportCSV}
              asyncOnClick={true}
              headers={headers}
              filename="Export_Customers.csv"
            >
              <Icons.DownloadOutline
                className="icon-trash text-warning"
                size={22}
              />{" "}
              Download Customer Data
            </CSVLink> */}
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

export default CustomerExportModal;
