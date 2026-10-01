import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import * as Icons from "heroicons-react";
import RTVprint from "../PrintReceipt/RTV/RTVprint";
import { useRtvQuery } from "../../../services/rtvApi";

function RtvView({ show, handleClose, grn }) {
  const componentRef = useRef();
  const grnView = useRtvQuery(grn);

  //   console.log(grnView.data);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // console.log(grn);
  // console.log(grnView);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Return To Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RTVprint ref={componentRef} grn={grnView?.data} />
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
}

export default RtvView;
