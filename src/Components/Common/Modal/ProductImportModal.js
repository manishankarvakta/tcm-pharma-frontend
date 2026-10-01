import React from 'react';
import { Modal } from 'react-bootstrap';
import CsvImporter from '../CsvImporter/CsvImporter';

const ProductImportModal = ({
    handleClose,
handleShow,
handleImportButton,
setCsvData,
show
}) => {
    
    
        
    
    return (
        <div>
            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <CsvImporter setCsvData={setCsvData} handleImportButton={handleImportButton} title="Product"></CsvImporter>
        </Modal.Body>
        
      </Modal>
        </div>
    );
};

export default ProductImportModal;