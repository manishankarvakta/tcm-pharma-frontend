import * as Icons from "heroicons-react";
import { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useTpnQuery } from "../../../services/tpnApi";
import TpnDetailsPrint from "../../TPN/TpnDetailsPrint";

// import { ComponentToPrint } from './ComponentToPrint';

const TpnView = ({ show, handleClose, tpn }) => {
  const { data, isLoading, isError } = useTpnQuery(tpn, { skip: !tpn });

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading TPN data.</p>;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>TPN Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TpnDetailsPrint ref={componentRef} tpn={data} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <button className="btn btn-dark float-end" onClick={handlePrint}>
          <Icons.PrinterOutline className="ms-3" size={18} /> Print
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TpnView;
