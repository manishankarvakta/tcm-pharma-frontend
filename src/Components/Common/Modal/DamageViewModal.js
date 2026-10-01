import React, { useRef } from "react";
import {
  Button,
  // Col,
  // Container,
  // Form,
  Modal,
  // Row
} from "react-bootstrap";
import * as Icons from "heroicons-react";
// import axios from "../../../services/apiClient";
import { useReactToPrint } from "react-to-print";
import DamagePrint from "../PrintReceipt/Damage/DamagePrint";
import { useDamageQuery } from "../../../services/damageApi";

const DamageViewModal = ({ onShow, handleClose, damage }) => {
  // const [damage, setDamage] = useState({});
  // console.log(damage)
  const damageView = useDamageQuery(damage?._id);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // console.log(damageView)
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Damage </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DamagePrint ref={componentRef} damage={damageView.data}></DamagePrint>
        {/* <PO ref={componentRef} purchase={purchaseView.data} /> */}
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

export default DamageViewModal;
