import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CSVLink } from "react-csv";

const DamageExportModal = ({ onShow, handleClose, damageExport }) => {
  const [exportCSV, setExportCSV] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [current, setCurrent] = useState(0);
  console.log("damageExport", damageExport);
  const processCSV = (damageExport) => {
    if (!damageExport) return;

    const csvData = damageExport.flatMap((item, index) => {
      const product = item?.products?.[0] || {};
      setCurrent(index + 1); // Update progress
      return {
        name: product?.name || "N/A",
        article_code: product?.article_code || "N/A",
        qty: product?.qty || 0,
        reason: product?.reason || "Unknown",
      };
    });

    setExportCSV(csvData);
    setDataReady(true);
  };

  useEffect(() => {
    setDataReady(false); // Reset state when damageExport changes
    setCurrent(0);
    processCSV(damageExport);
  }, [damageExport]);

  const headers = [
    { label: "Name", key: "name" },
    { label: "Article Code", key: "article_code" },
    { label: "Quantity", key: "qty" },
    { label: "Reason", key: "reason" },
  ];

  return (
    <Modal show={onShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Damage Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {!dataReady ? (
          <div className="d-flex flex-column align-items-center">
            <Spinner animation="grow" variant="warning" size="sm" />
            <Icons.ClockOutline className="text-warning" size={80} />
            <p className="text-dark mt-3 mb-3">
              <small>Please wait while your export is being prepared!</small>
            </p>
            <ProgressBar
              className="w-100"
              striped
              variant="success"
              now={Math.min((current / (damageExport?.length || 1)) * 100, 100)}
              label={`${current} of ${damageExport?.length || 0}`}
            />
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <Icons.CheckCircleOutline className="text-success" size={100} />
            <p className="text-dark my-3">Your export is ready!</p>
            <CSVLink
              className="btn btn-dark"
              data={exportCSV}
              headers={headers}
              filename="Export_Damage.csv"
            >
              <Icons.DownloadOutline className="text-warning" size={22} />{" "}
              Download Damage Data
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

export default DamageExportModal;
