import React, { useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import * as Icons from "heroicons-react";
import AllCategoriesSalePrint from '../../Sale/Print/AllCategoriesSalePrint';

const AllCategoriesModal = ({ show, handleClose, cat, endDate, startDate, total, footfall }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header className="d-flex justify-content-end" closeButton>
                <Modal.Title>All Category Sale</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AllCategoriesSalePrint ref={componentRef} cat={cat} endDate={endDate} startDate={startDate} footfall={footfall} total={total} />
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

export default AllCategoriesModal;