import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import * as Icons from "heroicons-react";
import { useReactToPrint } from "react-to-print";
import PopularProductSalesPrint from "../../Sale/Print/PopularProductSalesPrint";

const PopularProductsSaleReportModal = ({
  onShow,
  handleClose,
  data,
  startDate,
  endDate,
}) => {
  // console.log(data)
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Supplier Wise Sales Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PopularProductSalesPrint
          ref={componentRef}
          data={data}
          startDate={startDate}
          endDate={endDate}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <button className="btn btn-dark float-end" onClick={handlePrint}>
          <Icons.PrinterOutline className="ms-3" size={18} /> Print{" "}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopularProductsSaleReportModal;
