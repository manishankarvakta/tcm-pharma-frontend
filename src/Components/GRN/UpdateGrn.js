import React, { useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup, Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import ProductSearch from "../Common/ProductSearch/ProductSearch";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
import { useForm } from "react-hook-form";
import * as Icons from "heroicons-react";
// import useCarts from "../Hooks/useCarts";
import CsvImporter from "../Common/CsvImporter/CsvImporter";
import { notify } from "../Utility/Notify";
import { Toaster } from "react-hot-toast";
import usePurchase from "../Hooks/usePurchase";
import usePurchaseCarts from "../Hooks/usePurchaseCarts";
import { hash, signInUser } from "../Utility/Auth";
import axios from "../../services/apiClient";
import useInventory from "../Hooks/useInventory";
import { compareAsc, format } from "date-fns";

import { BsArchive, BsCheckSquare, BsSquare } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import {
  addToDb,
  customQuantity,
  getStoredCart,
  removeFromDb,
  deletepurchaseCart,
  removeQuantity,
  addQuantity,
} from "../Utility/purchaseDb";
import PurchaseCart from "./parts/PurchaseCart";
import { total, toDecimal } from "../Utility/PurchaseCalculations";
import { useNavigate } from "react-router-dom";
import SelectPurchase from "../Common/CustomSelect/SelectPurchase";
import { usePurchaseQuery } from "../../services/purchasApi";
import { useAddGrnMutation } from "../../services/grnApi";
import { apiUniqueErrHandle } from "../Utility/Utility";
import AlertService from "../Utility/AlertService";
// import PosCart from "../Pages/POS/Parts/PosCart";
// import useProducts from "../Hooks/useProducts";

const UpdateGrn = () => {
  let i = 1;
  let j = 1;
  let navigate = useNavigate();
  const [poNo, setPoNo] = useState("");
  const [grnNote, setGrnNote] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [grnProducts, setGrnProducts] = useState([]);
  const [cal, setCal] = useState([]);
  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });
  const [poList, setPoList] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const {
    grnTotalItems,
    updatePurchaseStatus,
    totalItems,
    purchase,
    setPurchase,
  } = usePurchase();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // RTK API CALL
  const [addGrn] = useAddGrnMutation();

  const user = signInUser();
  const { updateInventoryIn, inventory, setInventory } = useInventory();
  const { total_item, total, tax, discount, productList } = totalItems(
    purchase?.products
  );
  const { grntotal_item, grntotal, grntax, grndiscount, grnproductList } =
    grnTotalItems(grnProducts);
  const [tempQty, setTempQty] = useState([]);
  const [purchaseProduct, setPurchaseProduct] = useState([]);
  // const [grn, setGrn] = useState({});

  const getPoList = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/purchase`)
      .then((response) => setPoList(response.data));
  };

  const getSupplier = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/supplier-by-code/${purchase.supplier_code}`
      )
      .then((response) => setSupplier(response.data));
  };

  const handleSelectItem = (id) => {
    const selected = purchaseProduct.products.find(
      (p) => p.article_code === id
    );
    if (grnProducts.find((p) => p.article_code === id)) {
      notify("Products Already Sleeted", "error");
    } else {
      setGrnProducts([...grnProducts, selected]);
      setIsFull(false);
    }
  };

  const addQuantities = (id) => {
    const selected = grnProducts.find((p) => p.article_code === id);
    const remain = grnProducts.filter((p) => p.article_code !== id);
    const newGrn = [
      ...remain,
      {
        ...selected,
        qty: parseFloat(selected.qty) + 1,
      },
    ];

    setGrnProducts(newGrn);
    setIsFull(false);
  };

  const removeQuantities = (id) => {
    const item = grnProducts.find((p) => p.article_code === id);
    const remain = grnProducts.filter((p) => p.article_code !== id);
    const newGrn = [
      ...remain,
      {
        ...item,
        qty: parseFloat(item.qty) - 1,
      },
    ];
    setIsFull(false);
    setGrnProducts(newGrn);
  };

  const handleCustomQty = (e, id) => {
    const customQty = e.target.value !== "" ? e.target.value : 0;

    const item = grnProducts.find((p) => p.article_code === id);
    const remain = grnProducts.filter((p) => p.article_code !== id);
    if (item) {
      // let restItem = cartItems.filter((item) => item.article_code !== id);
      if (customQty >= 0) {
        const newGrn = [
          ...remain,
          {
            ...item,
            qty: customQty,
          },
        ];
        setGrnProducts(newGrn);
        setIsFull(false);
      }
    }
  };

  const removeFromGrn = (id) => {
    const remain = grnProducts.filter((p) => p.article_code !== id);
    setGrnProducts(remain);
    setIsFull(false);
  };
  const removeAllFromGrn = () => {
    setGrnProducts([]);
    setIsFull(false);
  };

  const handleSelectAllProducts = (products) => {
    setGrnProducts([]);
    setGrnProducts(products);
    setIsFull(true);
  };
  const handleDeselectAllProducts = (products) => {
    setGrnProducts([]);
    setIsFull(false);
  };

  // console.log(grnProducts)

  useEffect(() => {
    getPoList();
  }, []);

  useEffect(() => {
    let cartTempQty = [];

    grnProducts?.map((item) => {
      cartTempQty = [...cartTempQty, { id: item.article_code, qty: item.qty }];
    });
    setTempQty(cartTempQty);
  }, [grnProducts]);
  useEffect(() => {
    getSupplier();
  }, [purchase]);

  const handleGrnSubmit = async () => {
    if (grnProducts?.length > 0) {
      const confirmed = await AlertService.confirm("Are you sure?", "Wanna create GRN?");
      if (confirmed) {
        let GRN = {
          poNo: poNo,
          date: new Date(),
          products: grnProducts,
          note: grnNote,
          grn_by: user.name,
          userId: purchaseProduct?.userId._id,
          totalItem: grnProducts?.length,
          total: grntotal?.toFixed(2),
          g_total: (grntotal + grntax)?.toFixed(2),
          tax: grntax?.toFixed(2),
          supplier: purchaseProduct?.supplier._id,
          warehouse: purchaseProduct?.warehouse._id,
          is_full: isFull,
        };
        const response = await addGrn(GRN);
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          console.log(response?.data?.message);
          notify("GRN Successful", "success");
          setGrnNote("");
          setIsFull(false);
          navigate("/grn");
        }
        // if (updatePurchaseStatus(poNo, isFull)) {
        //   updateInventoryIn(grnProducts);
        //   notify("GRN Successful", "success");
        //   setGrnNote("");
        //   setIsFull(false);
        //   navigate("/grn");
        // }

        // await axios
        //   .post(`${process.env.REACT_APP_API_URL}/grn`, GRN)
        //   .then((response) => {
        //     if (response.status === 200) {
        //       if (updatePurchaseStatus(poNo, isFull)) {
        //         updateInventoryIn(grnProducts);
        //         notify("GRN Successful", "success");
        //         setGrnNote("");
        //         setIsFull(false);
        //         navigate("/grn");
        //       }
        //     }
        //   });

        console.log(GRN);
      }
    } else {
      notify("There must be products for GRN", "error");
    }
  };

  const handleGrnNote = (e) => {
    const grnNote = e.target.value;
    setGrnNote(grnNote);
  };

  const handleVendorChange = async (value) => {
    console.log(value?.option);

    setPoNo(value?.option);
    // const response = await purchaseView();
    // if (response) {
    //   console.log(response);
    //   setPurchaseProduct(response);
    // }

    await axios
      .get(`${BASE_URL}/purchase/${value.option}`)
      // const result = await axios.get(`${BASE_URL}/purchase/${value.option}`);
      .then((response) => {
        setPurchaseProduct(response.data);
        console.log(response.data);
        setGrnProducts([]);
      });
  };
  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Goods Receive Note"></Header>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-12">
                    <Form.Label className="mt-3">Purchase Order No</Form.Label>
                    <SelectPurchase
                      poList={poList}
                      format={format}
                      poNo={poNo}
                      handleVendorChange={handleVendorChange}
                    ></SelectPurchase>
                  </div>
                  <div className="col-12 py-2">
                    {supplier._id ? (
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <b>Vendor:</b> {supplier.name} <br />
                            <b>Phone:</b> {supplier.phone}
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <b>PO:</b> {poNo} <br />
                            <b>Date:</b>{" "}
                            {format(new Date(purchase.date), "MM/dd/yyyy")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col-12">
                    <Table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Qty</th>
                          <th>TP</th>
                          <th>Tax</th>
                          <th>Total</th>
                          <td>
                            {isFull ? (
                              <BsCheckSquare
                                onClick={() =>
                                  handleDeselectAllProducts(
                                    purchaseProduct.products
                                  )
                                }
                              />
                            ) : (
                              <BsSquare
                                onClick={() =>
                                  handleSelectAllProducts(
                                    purchaseProduct.products
                                  )
                                }
                              />
                            )}
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseProduct?.products?.length > 0 ? (
                          purchaseProduct?.products?.map((item) => (
                            <tr key={item.article_code}>
                              <th>{i++}</th>
                              <td>{item.article_code}</td>
                              <td>{item.name}</td>
                              <td>{item.qty}</td>
                              <td>{parseFloat(item.tp).toFixed(2)}</td>
                              <td>
                                {(
                                  parseFloat(item.qty) *
                                  (parseFloat(item.tp) *
                                    (parseFloat(item.tax) / 100))
                                ).toFixed(2)}
                              </td>
                              <td>
                                {(
                                  parseFloat(item.qty) *
                                  (parseFloat(item.tp) +
                                    item.tp * (parseFloat(item.tax) / 100))
                                ).toFixed(2)}
                                {/* {((parseFloat(item.tp) * (parseFloat(item.tax)) / 100)).toFixed(2)} */}
                              </td>
                              <td>
                                {/* <BsSquareHalf className="me-2" /> */}
                                <BsArchive
                                  onClick={() =>
                                    handleSelectItem(item.article_code)
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <th colSpan={8} className="text-center">
                              {" "}
                              Please Select a Purchase Order
                            </th>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  <div className="col-12">
                    <Table className="bordered striped ">
                      <thead>
                        <tr>
                          <th>Items: {purchase?.products?.length}</th>
                          <th>Tax: {tax?.toFixed(2)}</th>
                          <th>Total: {total?.toFixed(2)}</th>
                          {/* <th>Order Discount: {purchase.discount}</th> */}
                          {/* <th>Shipping Cost: {purchase.shipping}</th> */}
                          <th>Grand Total: {(total + tax)?.toFixed(2)}</th>
                        </tr>
                      </thead>
                    </Table>
                  </div>
                </div>

                {/* <Button
                  variant="dark"
                  className="float-end my-2"
                  type="submit"
                >
                  Submit
                </Button> */}
              </div>

              <div className="col-md-6">
                <h5 className="pt-2">Receivable Products List</h5>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Qty</th>
                      <th>TP</th>
                      <th>Tax</th>
                      <th>Total</th>
                      <td>
                        <AiOutlineClose onClick={removeAllFromGrn} />
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {grnProducts?.length > 0 ? (
                      grnProducts
                        ?.sort((a, b) => b.order - a.order)
                        ?.map((item, index) => (
                          <tr key={item.article_code}>
                            <th>{j++}</th>
                            <td>{item.article_code}</td>
                            <td>{item.name}</td>
                            <td>
                              <div className="input-group ">
                                <div className="input-group-prepend">
                                  <div
                                    onClick={() =>
                                      removeQuantities(item.article_code)
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
                                  id={item?.article_code}
                                  onChange={(e) =>
                                    handleCustomQty(e, item?.article_code)
                                  }
                                  value={
                                    tempQty[index]?.qty
                                      ? tempQty[index]?.qty
                                      : item?.qty
                                  }
                                  defaultValue={item?.qty}
                                />
                                <div className="input-group-append">
                                  <div
                                    onClick={() =>
                                      addQuantities(item.article_code)
                                    }
                                    className="input-group-text"
                                  >
                                    <Icons.Plus size="28" />
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{parseFloat(item.tp).toFixed(2)}</td>
                            <td>
                              {(
                                parseFloat(item.qty) *
                                (parseFloat(item.tp) *
                                  (parseFloat(item.tax) / 100))
                              ).toFixed(2)}
                            </td>
                            <td>
                              {(
                                parseFloat(item.qty) *
                                (parseFloat(item.tp) +
                                  item.tp * (parseFloat(item.tax) / 100))
                              ).toFixed(2)}
                            </td>
                            <td>
                              {/* <BsSquareHalf className="me-2" /> */}
                              <AiOutlineClose
                                onClick={() => removeFromGrn(item.article_code)}
                              />
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <th colSpan={8} className="text-center">
                          {" "}
                          Please Select a Purchase Order
                        </th>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Table className="bordered striped ">
                  <thead>
                    <tr>
                      <th>Items: {grnProducts?.length}</th>
                      <th>Tax: {grntax?.toFixed(2)}</th>
                      <th>Total: {grntotal?.toFixed(2)}</th>
                      {/* <th>Order Discount: {purchase.discount}</th> */}
                      {/* <th>Shipping Cost: {purchase.shipping}</th> */}
                      <th>Grand Total: {(grntotal + grntax)?.toFixed(2)}</th>
                    </tr>
                  </thead>
                </Table>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>GRN Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={(e) => handleGrnNote(e)}
                  />
                </Form.Group>
                <button className="btn btn-dark" onClick={handleGrnSubmit}>
                  Submit
                </button>
              </div>
            </div>
            <Toaster position="bottom-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGrn;
