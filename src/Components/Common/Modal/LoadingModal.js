import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

const LoadingModal = ({ title, onShow, handleClose }) => {
  // console.log(onShow);
  return (
    <Modal
      show={onShow}
      size="sm"
      centered={true}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body>
        <div className="flex justify-content-center mt-4 mb-4">
          <p className="text-center">
            <Spinner animation="border" variant="danger" />
          </p>
          <p className="text-center">{title}</p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
