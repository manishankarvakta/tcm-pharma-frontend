import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import * as Icons from "heroicons-react";
import AccountPrint from "./AccountPrint";
import { useAccountQuery } from "../../services/accountApi";

// import { ComponentToPrint } from './ComponentToPrint';

const AccountView = ({ show, handleClose, accountId, accountDetails }) => {
  const componentRef = useRef();
  const { data, isSuccess, refetch } = useAccountQuery(accountId);

  useEffect(() => {
    refetch();
  }, [accountId, isSuccess]);
  // console.log(grnView.data);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // console.log("accountId", accountId);
  // console.log("data", data);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Account Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AccountPrint
          ref={componentRef}
          account={data}
          refetchAccount={refetch}
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

export default AccountView;
