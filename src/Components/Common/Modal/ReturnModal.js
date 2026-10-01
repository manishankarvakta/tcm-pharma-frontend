import axios from "../../../services/apiClient";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
// import useSaleByInvoiceQuery from "../../../services/saleApi";
import { format } from "date-fns";
// import { posFinalizer } from "../../Utility/PosCalculations";
import { useDispatch, useSelector } from "react-redux";
import { saleReturnInfo, saleReturnProducts } from "../../../features/posSlice";

const ReturnModal = ({
  title,
  onShow,
  handleClose,
  returnProducts,
  setReturnProducts,
  // reCal,
  // setReCal,
  updateCart,
  // handleReturnCustomerSelect,
  invoice,
  setInvoice,
}) => {
  const posSaleData = useSelector((state) => state.posReducer);
  const [returnInvoice, setReturnInvoice] = useState({});
  const dispatch = useDispatch();

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const handleChangeInvoiceId = async (e) => {
    if (e) {
      const id = e.target.value.trim(); // Trim any leading/trailing spaces
      if (!id) {
        console.error("Invoice ID is empty or invalid.");
        return;
      }

      try {
        console.log("Fetching data for ID:", id);
        const res = await axios.get(`${BASE_URL}/sale/invoice/${id}`);
        console.log("return:", res.data);

        // Update state and dispatch actions
        setReturnInvoice(res.data);
        dispatch(
          saleReturnInfo({
            returnInvoice: res?.data?._id,
            customerId: res?.data?.customerId?._id,
            customerPhone: res?.data?.customerId?.phone,
            customerName: res?.data?.customerId?.name,
            customerPoint: res?.data?.customerId?.point,
          })
        );
        dispatch(saleReturnProducts([]));
        setInvoice(res.data);
        setReturnProducts([]);
      } catch (error) {
        console.error(
          "Error fetching invoice:",
          error.response || error.message
        );
      }
    }
  };

  // console.log("invoice", invoice);
  useEffect(() => {
    updateCart();
  }, [posSaleData.returnProducts]);

  // console.log(reCal);

  const handleAddToggleProduct = (e, product) => {
    const seleted = returnProducts.filter(
      (item) => item.article_code === product.article_code
    );
    const rest = returnProducts.filter(
      (item) => item.article_code != product.article_code
    );
    let returnList = [];
    if (e.target.checked) {
      returnList = [product, ...rest];
    } else {
      returnList = rest;
    }
    dispatch(saleReturnProducts(returnList));
    setReturnProducts(returnList);
  };

  const handleCancel = () => {
    setReturnProducts([]);
    setInvoice({});
    // setReCal({});
    // handleReturnCustomerSelect({
    //   id: "62e301c1ee6c8940f6ac1515",
    //   name: "Walkaway Customer",
    // });
    handleClose();
  };
  // console.log("invoice", Object.keys(invoice).length);
  //   const { data } = useSaleByInvoiceQuery("PHARMACY-POS-09262022-0001");
  //   const { data, error, isLoading, isFetching, isSuccess } =
  //     useSaleByInvoiceQuery(`${id}`);

  //   console.log(data);
  //   console.log(onShow);÷
  return (
    <Modal size="lg" show={onShow} onHide={handleClose}>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>
            {title} |
            {invoice?.invoiceId
              ? `Invoice No: ${invoice?.invoiceId}`
              : "Please Scan An Invoice"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="align-items-center mb-3">
              <Col
                xs={12}
                md={2}
                className="text-center text-md-start mb-2 mb-md-0"
              >
                <strong>Scan Invoice</strong>
              </Col>
              <Col xs={12} md={10}>
                <Form.Group controlId="invoiceId">
                  <Form.Control
                    type="text"
                    onChange={(e) => handleChangeInvoiceId(e)}
                    placeholder="Scan Invoice here"
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <hr />
              </Col>
            </Row>

            {Object.keys(invoice).length > 0 ? (
              <>
                <Row>
                  <Col xs={12} md={3}>
                    <p>
                      <b>Client: </b>
                      {invoice?.customerId?.name || "Walkaway Customer"}
                    </p>
                  </Col>
                  <Col xs={6} md={4}>
                    <p>
                      <b>Biller:</b> {invoice?.billerId?.name}
                    </p>
                  </Col>
                  <Col xs={6} md={3}>
                    <p>
                      <b>Date:</b>{" "}
                      {invoice?.createdAt &&
                        format(new Date(invoice?.createdAt), "MM-dd-yyyy")}
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p>
                      <b>Old:</b> {invoice?.point?.old}
                    </p>
                  </Col>
                  <Col xs={4} md={2}>
                    <p>
                      <b>Item No:</b> {invoice?.totalItem}
                    </p>
                  </Col>
                  <Col xs={4} md={3}>
                    <p>
                      <b>Total:</b>{" "}
                      {invoice?.total && (invoice?.total).toFixed(2)}
                    </p>
                  </Col>
                  <Col xs={3} md={2}>
                    <p>
                      <b>Vat:</b> {invoice?.vat}
                    </p>
                  </Col>
                  <Col xs={6} md={3}>
                    <p>
                      <b>Round Total:</b> {invoice?.grossTotalRound}
                    </p>
                  </Col>
                  <Col xs={3} md={2}>
                    <p>
                      <b>New:</b> {invoice?.point?.new}
                    </p>
                  </Col>

                  <Col xs={12} md={12}>
                    <table className="table mt-3">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Product</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Vat</th>
                          <th scope="col" className="text-center text-nowrap">
                            Sub-Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="cart-list">
                        {invoice?.products?.length > 0 &&
                          invoice?.products?.map((cartItem) => (
                            <tr key={cartItem?.article_code}>
                              <th scope="row">
                                {/* <Icons.Plus size="28" /> */}
                                <Form.Check
                                  inline
                                  checked={returnProducts?.find(
                                    (x) =>
                                      x.article_code === cartItem.article_code
                                  )}
                                  name="group1"
                                  onChange={(e) =>
                                    handleAddToggleProduct(e, cartItem)
                                  }
                                  // type={type}
                                  // id={`inline-${type}-1`}
                                />
                              </th>
                              <td title={cartItem?.article_code}>
                                {cartItem?.name}
                              </td>
                              <td>{cartItem?.mrp}</td>
                              <td className="">{cartItem?.qty}</td>
                              <td>
                                {(
                                  (cartItem?.vat / 100) *
                                  cartItem?.mrp *
                                  cartItem?.qty
                                )?.toFixed(2)}
                              </td>
                              <td className="text-center">
                                {(cartItem?.mrp * cartItem?.qty)?.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </Col>
                </Row>
                {returnProducts?.length > 0 && (
                  <Row>
                    <Col xs={12} md={12}>
                      <p>
                        <b>Return Info</b>
                        <hr />
                      </p>
                    </Col>
                    <Col xs={4} md={2}>
                      <p>
                        <b>Item No:</b> {posSaleData.returnCal.totalItem}
                      </p>
                    </Col>
                    <Col xs={4} md={2}>
                      <p>
                        <b>Total:</b>{" "}
                        {parseFloat(posSaleData.returnCal.total)?.toFixed(2)}
                      </p>
                    </Col>
                    <Col xs={4} md={2}>
                      <p>
                        <b>Vat:</b> {posSaleData.returnCal.vat?.toFixed(2)}
                      </p>
                    </Col>
                    <Col xs={8} md={4}>
                      <p>
                        <b>GrossTotalRound:</b>{" "}
                        {posSaleData.returnCal.total?.toFixed(2)}
                      </p>
                    </Col>
                    <Col xs={4} md={2}>
                      <p>
                        <b>Point:</b> {posSaleData.returnCal.point}
                      </p>
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <Row>
                <Col lg={12}>
                  <p className="text-center">Please Scan an Invoice</p>
                </Col>
              </Row>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleClose}>
            Create Return
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReturnModal;
