import axios from "../../../services/apiClient";
import { useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { signInUser } from "../../Utility/Auth";
import SelectGeneric from "../CustomSelect/selectGeneric";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
const auth = signInUser();
const aamarId = auth?.aamarId;
const GenericSearchModal = ({ onShow, handleClose }) => {
  const [gn, setGn] = useState("");
  const [products, setProducts] = useState([]);
  let i = 1;
  // const handleOnchangeGeneric = async (e) => {
  //   // console.log(e)
  //   const genericProducts = await axios.get(
  //     `${BASE_URL}/product/generic/inventory/${aamarId}/${e.value}`
  //   );
  //   // console.log(genericProducts)
  //   setProducts(genericProducts?.data);
  // };
  const handleOnchangeGeneric = async (e) => {
    setProducts([]); // Clear previous data before fetching new results

    try {
      const genericProducts = await axios.get(
        `${BASE_URL}/product/generic/inventory/${aamarId}/${e.value}`
      );
      setProducts(genericProducts?.data);
    } catch (error) {
      console.error("Error fetching generic products:", error);
    }
  };

  return (
    <Modal size="lg" show={onShow} onHide={handleClose}>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Generic Wise Product Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} md={2}>
              Search Generic
            </Col>
            <Col xs={12} md={10}>
              <Form.Group className="mb-3" controlId="invoiceId">
                <SelectGeneric
                  gn={gn}
                  handleOnchange={(e) => {
                    handleOnchangeGeneric(e);
                  }}
                ></SelectGeneric>
              </Form.Group>
            </Col>
            <hr />
          </Row>
          <Table className="mt-3 table-responsive">
            <thead>
              <tr>
                <th>#</th>
                {/* <th>Code</th> */}
                <th>Name</th>
                <th>Group</th>
                <th>Stock</th>
                <th>TP</th>
                <th>MRP</th>
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 ? (
                products
                  ?.slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <tr key={item.article_code}>
                      <th>{i++}</th>
                      {/* <td>{item.article_code}</td> */}
                      <td title={item.article_code}>{item.name}</td>
                      <td>{item.group.name}</td>
                      <td>
                        {item?.inventory?.currentQty > 0
                          ? item.inventory?.currentQty
                          : 0}
                      </td>
                      <td>{parseFloat(item?.tp ? item?.tp : 0).toFixed(2)}</td>
                      <td>
                        {parseFloat(item?.mrp ? item?.mrp : 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <th colSpan={8} className="text-center">
                    {" "}
                    Please Select a Generic
                  </th>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default GenericSearchModal;
