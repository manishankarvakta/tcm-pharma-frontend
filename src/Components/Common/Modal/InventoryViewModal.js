import axios from "../../../services/apiClient";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import useSaleByinventoryQuery from "../../../services/saleApi";
import * as Icons from "heroicons-react";

const InventoryViewModal = ({ onShow, handleClose, code }) => {
  const [inventory, setInventory] = useState({});
  const [product, setProduct] = useState({});

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const inventoryByCode = async (id) => {
    // console.log(id);
    if (id) {
      const inventoryData = await axios.get(`${BASE_URL}/inventory/${id}`);
      // console.log(inventoryData);
      setInventory(inventoryData.data);
      const product = await axios.get(
        `${BASE_URL}/product/article/${inventoryData.data.article_code}`
      );
      // console.log(product);
      setProduct(product.data);
    }
  };

  useEffect(() => {
    inventoryByCode(code);
  }, [code]);

  const handleCancel = () => {
    setInventory({});
    handleClose();
  };
  // console.log(inventory);

  return (
    <Modal size="lg" show={onShow} onHide={handleClose}>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>
            <Icons.ArchiveOutline size={24} className="text-success me-2">
              {" "}
            </Icons.ArchiveOutline>
            {inventory?.article_code &&
              `Inventory Code: ${inventory?.article_code}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={6} md={6}>
                <p>
                  {" "}
                  <b>Name:</b> {inventory?.name}{" "}
                </p>
                <p>
                  {" "}
                  <b>Article Code:</b> {inventory?.article_code}{" "}
                </p>
                <p>
                  {" "}
                  <b>Opening Qty:</b> {inventory?.openingQty}{" "}
                </p>
                <p>
                  {" "}
                  <b>Current Qty:</b> {inventory?.currentQty}{" "}
                </p>
                <p>
                  {" "}
                  <b>Total Qty:</b> {inventory?.totalQty}{" "}
                </p>
                <p>
                  {" "}
                  <b>Sold Qty:</b> {inventory?.soldQty}{" "}
                </p>
                <p>
                  {" "}
                  <b>Damage Qty:</b> {inventory?.damageQty}{" "}
                </p>
                <p>
                  {" "}
                  <b>RTV Qty:</b> {inventory?.rtvQty}{" "}
                </p>
                <p>
                  {" "}
                  <b>Status:</b>{" "}
                  {inventory.currentQty > 0 ? (
                    <small className="text-success">In Stock</small>
                  ) : (
                    <small className="text-danger">Out Of Stock</small>
                  )}
                </p>
              </Col>
              <Col xs={6} md={6}>
                <p>
                  <b>Group: </b>
                  {product?.group?.name}
                </p>
                <p>
                  <b>Generic: </b>
                  {product?.generic?.name}
                </p>
                <p>
                  <b>Brand: </b>
                  {product?.brand?.name}
                </p>
                <p>
                  <b>TP: </b>
                  {product?.tp}
                </p>
                <p>
                  <b>MRP: </b>
                  {product?.mrp}
                </p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleCancel}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InventoryViewModal;
