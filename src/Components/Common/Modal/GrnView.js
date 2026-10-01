import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import * as Icons from "heroicons-react";
import GRNprint from "../PrintReceipt/GRN/GRNprint";
import { useGrnQuery } from "../../../services/grnApi";

// import { ComponentToPrint } from './ComponentToPrint';

const GrnView = ({ show, handleClose, grn }) => {
  const componentRef = useRef();
  const grnView = useGrnQuery(grn);

  // console.log(grnView.data);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // console.log(grn);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Goods Receive Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GRNprint ref={componentRef} grn={grnView.data} />
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

export default GrnView;
