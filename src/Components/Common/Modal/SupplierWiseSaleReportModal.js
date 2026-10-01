import React, { useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import * as Icons from "heroicons-react";
import { useReactToPrint } from 'react-to-print';
import SupplierSalesPrint from '../../Sale/Print/SupplierSalesPrint';

const SupplierWiseSaleReportModal = ({ onShow, handleClose, data, supplierInfo, startDate, endDate }) => {
    console.log(data)
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
                <SupplierSalesPrint ref={componentRef} data={data} supplierInfo={supplierInfo} startDate={startDate} endDate={endDate} />
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

export default SupplierWiseSaleReportModal;