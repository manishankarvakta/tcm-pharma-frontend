import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import PO from "../PrintReceipt/PO/PO";
import { useReactToPrint } from "react-to-print";
import * as Icons from "heroicons-react";
import { usePurchaseQuery } from "../../../services/purchasApi";

// import { ComponentToPrint } from './ComponentToPrint';

const PurchaseView = ({ show, handleClose, purchase }) => {
  // console.log("purchase", purchase);
  const purchaseView = usePurchaseQuery(purchase);
  // const purchaseView = [];
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  //   console.log("view", purchaseView);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {console.log(purchaseView?.data)} */}
        <PO ref={componentRef} purchase={purchaseView?.data} />
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

export default PurchaseView;
