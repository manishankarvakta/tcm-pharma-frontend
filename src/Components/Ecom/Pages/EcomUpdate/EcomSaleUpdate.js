import React, { useEffect, useRef, useState } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEcomSalesByIdQuery,
  useUpdateEcomSaleMutation,
} from "../../../../services/ecomApi";
import Header from "../../../Common/Header/Header";
import SideBar from "../../../Common/SideBar/SideBar";
import * as Icons from "heroicons-react";
import AlertService from "../../../Utility/AlertService";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSaleValue,
  selectProducts,
} from "../../../../features/ecomSalesSlice";
import PrintReceiptById from "../../../Common/PrintReceipt/PrintReceiptByIdEcom";

const EcomSaleUpdate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const statusRef = useRef();
  const BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const navigate = useNavigate();
  console.log("id", id);
  const { data, isSuccess } = useEcomSalesByIdQuery(id);
  console.log(data);
  const [updateEcomSale] = useUpdateEcomSaleMutation();
  const ecomSaleData = useSelector((state) => state.ecomSalesReducer);
  console.log(ecomSaleData);
  console.log(data);
  if (data?.length > 0) {
    // dispatch(updateSaleValue(data))
  }
  // console.log(ecomSaleData)

  const [saleProducts, setSaleProducts] = useState([]);
  // const [qty, setQty] = useState(0)

  useEffect(() => {
    if (data) {
      setSaleProducts(data?.products);
    }
  }, [data]);

  console.log("sale data", saleProducts);
  const removeQuantities = (id) => {
    if (data.products) {
      let list = [];
      const item = data.products.find((item) => item.article_code === id);
      const restItem = data.products.filter((item) => item.article_code !== id);

      if (item) {
        list = [...restItem, { ...item, qty: item.qty - 1 }];
      } else {
        list = [...restItem];
      }
      dispatch(selectProducts(list));
    }
  };
  const addQuantities = (id) => {
    if (data?.products) {
      let list = [];
      const item = data?.products?.find((item) => item?.article_code === id);
      const restItem = data.products.filter(
        (item) => item?.article_code !== id
      );

      if (item) {
        list = [...restItem, { ...item, qty: item.qty + 1 }];
      } else {
        list = [...restItem];
      }
      dispatch(selectProducts(list));
    }
  };
  const handleSaleConfirmation = async () => {
    console.log(statusRef.current.value);
    console.log(data);
    const confirmed = await AlertService.confirm("Confirm?");
    if (confirmed) {
      const newData = { ...data, status: statusRef.current.value };
      console.log(newData);
      await updateEcomSale({ _id: id, newData }).then((res) => {
        console.log(res);
        navigate(`/ecom`);
      });
    }
    // console.log(update)
  };
  const handleSaleCancelation = async () => {
    console.log(data);
    const confirmed = await AlertService.confirm("Are you sure?", "Wanna Cancel?");
    if (confirmed) {
      const newData = { ...data, status: "cancel" };
      console.log(newData);
      await updateEcomSale({ _id: id, newData }).then((res) => {
        console.log(res);
        navigate(`/ecom`);
      });
    }
  };
  const handleNavigateBack = () => {
    navigate(`/ecom`);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Ecom Order Details "></Header>
            <div className="row">
              <div className="col-md-8 pt-5">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mt-2">
                      <div className="card-header">
                        <h5 className="card-title">Customer Details</h5>
                      </div>
                      <div className="card-body">
                        <p>Customer Name: {data?.customerId?.name} </p>
                        <p>Customer Phone: {data?.customerId?.phone}</p>
                        <p>Customer Email: {data?.customerId?.email}</p>
                        <p>Customer Address: {data?.customerId?.delivery}</p>
                        <p>Customer Point: {data?.customerId?.point}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card mt-2">
                      <div className="card-header">
                        <h5 className="card-title">Payment method</h5>
                      </div>
                      <div className="card-body">
                        <Form.Check
                          type="radio"
                          checked={"checked"}
                          id="custom-switch"
                          // onChange={() => handleNewPrice(item?.id)}
                          label="Cash on delivery"
                        />
                        <Form.Check
                          type="radio"
                          checked={""}
                          id="custom-switch"
                          // onChange={() => handleNewPrice(item?.id)}
                          label="Bkash"
                        />
                        <Form.Check
                          type="radio"
                          checked={""}
                          id="custom-switch"
                          // onChange={() => handleNewPrice(item?.id)}
                          label="Nagad"
                        />
                        <Form.Check
                          type="radio"
                          checked={""}
                          id="custom-switch"
                          // onChange={() => handleNewPrice(item?.id)}
                          label="Card"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="card mt-2">
                      <div className="card-header">
                        <h5 className="card-title">Ordered Products</h5>
                      </div>
                      <div className="card-body">
                        <ListGroup variant="flush">
                          {saleProducts?.length > 0 ? (
                            saleProducts
                              ?.slice()
                              ?.sort((a, b) => a.order - b.order)
                              ?.map((product, index) => (
                                <ListGroup.Item>
                                  <p>
                                    {product.article_code} {product.name}
                                  </p>
                                  <div className="col-md-2">
                                    <div className="input-group ">
                                      <div className="input-group-prepend">
                                        <div
                                          onClick={() =>
                                            removeQuantities(
                                              product.article_code
                                            )
                                          }
                                          className="input-group-text"
                                        >
                                          <Icons.Minus size="28" />
                                        </div>
                                      </div>
                                      {/* quantity */}
                                      <input
                                        type="text"
                                        className="form-control quantity"
                                        width="60%"
                                        id={product?.article_code}
                                        // onChange={(e) => handleCustomQty(e, cartItem?.article_code)}
                                        // value={qtyShow(product?.article_code)}
                                        defaultValue={product?.qty}
                                      />
                                      <div className="input-group-append">
                                        <div
                                          onClick={() =>
                                            addQuantities(product.article_code)
                                          }
                                          className="input-group-text"
                                        >
                                          <Icons.Plus size="28" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </ListGroup.Item>

                                // <p>{product.name}</p>
                                // console.log(product)
                              ))
                          ) : (
                            <p>No Products</p>
                          )}
                        </ListGroup>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mt-2 d-flex justify-content-between">
                      {/* <div class="input input-group mb-3">
                                        <select class="custom-select" id="inputGroupSelect02">
                                            <option selected value="confirm">confirm</option>
                                            <option value="cancel">cancel</option>
                                        </select>
                                    </div> */}
                      {/* <button className='btn btn-dark'
                                        onClick={() => handleSaleConfirmation()}
                                    >Confirm</button>
                                    <button className='btn btn-dark'
                                        onClick={() => handleSaleCancelation()}
                                    >Cancel</button> */}
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicName">
                      <Form.Label> Order Status</Form.Label>

                      <select
                        ref={statusRef}
                        className="form-select"
                        id="status"
                      >
                        <option selected value="confirm">
                          confirm
                        </option>
                        <option value="cancel">cancel</option>
                      </select>
                    </Form.Group>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleSaleConfirmation()}
                    >
                      Submit
                    </button>
                    <button
                      className="btn btn-dark mx-2"
                      onClick={() => handleNavigateBack()}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <PrintReceiptById props={id}></PrintReceiptById>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EcomSaleUpdate;
