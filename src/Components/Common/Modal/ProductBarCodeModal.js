import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import { Button, Card, Modal } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import './ProductBarCode.css'

const ProductBarCodeModal = React.forwardRef(({ show, handleClose, barcodeData }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const { name, code, mrp } = barcodeData;
    return (
        <Modal show={show} onHide={handleClose} className="barCodeModal">
            <Modal.Header closeButton>
                <Modal.Title>Product BarCode</Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center' >
                <div style={{ width: 150 }} className="mx-auto">

                    <Card className="text-center">
                        <div className="print-wrapper" ref={componentRef}>
                            <p className='text-center name px-2'>
                                {barcodeData &&name}
                            </p>
                            <p className='text-center barCode' style={{ zIndex: 1 }} >
                                {code ?
                                <Barcode className='text-center '
                                    value={ code }
                                    height="30"                               
                                    width="1.5"
                                    fontSize="9" />
                                    :
                                    ""
                                
                            }
                            </p>
                            <p className='text-center mrp'>{mrp} BDT</p>
                        </div>
                    </Card>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handlePrint}>
                    Print
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default ProductBarCodeModal;