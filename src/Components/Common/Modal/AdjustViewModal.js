import React, { useRef } from "react";
import {
  Button,
  Modal,
} from "react-bootstrap";
import * as Icons from "heroicons-react";
import { useReactToPrint } from "react-to-print";
import AdjustPrint from "../../Adjust/AdjustPrint";

const AdjustViewModal = ({ onShow, handleClose, adjust }) => {
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
        <Modal.Title>Adjust Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {adjust?._id ? (
          <AdjustPrint ref={componentRef} adjust={adjust}></AdjustPrint>
        ) : (
          <div className="text-center p-5">Loading...</div>
        )}
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

export default AdjustViewModal;
