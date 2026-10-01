import React, { useEffect, useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup, Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
import { useForm } from "react-hook-form";
import * as Icons from "heroicons-react";
// import useCarts from "../Hooks/useCarts";
import { notify } from "../Utility/Notify";
import { Toaster } from "react-hot-toast";
import usePurchase from "../Hooks/usePurchase";
import { hash, signInUser } from "../Utility/Auth";
import axios from "../../services/apiClient";
import useInventory from "../Hooks/useInventory";
import { compareAsc, format } from "date-fns";

import { BsArchive, BsCheckSquare, BsSquare } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import {
  selectSupplier,
  selectWareHouse,
  selectUser,
  selectProducts,
  selectNote,
  selectDiscount,
  selectCalculation,
  selectStatus,
  selectShipping,
  resetGrn,
  selectPoNo,
  selectNewPrice,
} from "../../features/grnSlice";
import { useNavigate } from "react-router-dom";
import SelectPurchase from "../Common/CustomSelect/SelectPurchase";
import { useAddGrnMutation } from "../../services/grnApi";
import { apiUniqueErrHandle } from "../Utility/Utility";
import SelectPriceGrn from "../Common/CustomSelect/ScelectPriceGrn";
import { useDispatch, useSelector } from "react-redux";
import { useAddPriceMutation } from "../../services/priceApi";
import LoadingModal from "../Common/Modal/LoadingModal";
import { useUpdatePurchaseStatusMutation } from "../../services/purchasApi";
// import PosCart from "../Pages/POS/Parts/PosCart";
// import useProducts from "../Hooks/useProducts";

const GRNCreate = () => {
  let i = 1;
  let j = 1;
  let navigate = useNavigate();
  const [poNo, setPoNo] = useState("");
  const [grnNote, setGrnNote] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [onShow, setOnShow] = useState(false);
  const [newPrice, setNewPrice] = useState(false);
  const [grnProducts, setGrnProducts] = useState([]);
  const [cal, setCal] = useState([]);
  const statusRef = useRef();

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });
  const [poList, setPoList] = useState([]);
  const [updatePrice, setUpdatePrice] = useState(false);
  const {
    grnTotalItems,
    updatePurchaseStatus,
    totalItems,
    purchase,
    setPurchase,
  } = usePurchase();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const dispatch = useDispatch();
  const grnData = useSelector((state) => state.grnReducer);
  const handleClose = () => setOnShow(false);

  // console.log(grnData);

  // RTK API CALL
  const [addGrn] = useAddGrnMutation();
  const [updatePurchase] = useUpdatePurchaseStatusMutation();
  const [addPrice] = useAddPriceMutation();
  const [purchaseProduct, setPurchaseProduct] = useState([]);

  const user = signInUser();
  // const { updateInventoryIn, inventoryIn, inventory, setInventory } =
  //   useInventory();
  const { total_item, total, tax, discount, productList } = totalItems(
    purchaseProduct?.products
  );
  const {
    grntotal_item,
    grntotal,
    grntax,
    grndiscount,
    grnproductList,
    groundTotal,
  } = grnTotalItems(grnData.products);
  // const [grn, setGrn] = useState({});
  console.log(grnData.shipping_cost);
  // console.log(grntotal_item, grntotal, grntax);

  const [newShipping, setNewShipping] = useState();

  // useEffect(() => {
  //   setNewShipping(grnData?.shipping_cost)

  // }, [grnData])

  useEffect(() => {
    if (isFull) {
      dispatch(selectStatus("Complete"));
    } else {
      dispatch(selectStatus("Partial"));
    }
  }, [isFull]);

  useEffect(() => {
    const newP = grnData?.ptoducts?.find((pro) => pro.newPrice === true);
    console.log(grnData?.products);
    if (newP) {
      setNewPrice(true);
    } else {
      setNewPrice(false);
    }
  }, [grnData?.ptoducts]);

  // console.log(newPrice);

  useEffect(() => {
    grnData?.ptoducts?.length > 0 && setGrnProducts(grnData.products);
    dispatch(
      selectCalculation({
        totalItem: grntotal_item,
        total: grntotal,
        tax: grntax,
        groundTotal: groundTotal,
      })
    );
  }, [grntotal, grnData.products]);

  // useEffect(() => {
  //   grnData?.ptoducts?.length > 0 && setGrnProducts(grnData.products);
  //   dispatch(
  //     selectCalculation({
  //       totalItem: grntotal_item,
  //       total: grntotal,
  //       tax: grntax,
  //       groundTotal: groundTotal,
  //     })
  //   );
  // }, []);

  // console.log(grnData);

  const handleSelectItem = (id) => {
    let newList = [];
    const selected = purchaseProduct?.products.find((p) => p.id === id);
    if (grnData.products.length > 0) {
      const exist = grnData?.products.find((p) => p.id === id);
      const rest = grnData?.products.filter((p) => p.id !== id);
      if (exist) {
        newList = [...grnData.products];
        dispatch(selectProducts(newList));
        notify("Products Already Selected", "error");
      } else {
        notify("Product is added", "success");
        newList = [
          ...rest,
          {
            id: selected?.id,
            article_code: selected?.article_code,
            priceId: selected?.priceId?._id,
            tp: selected?.priceId?.tp ? selected?.priceId?.tp : 0,
            newPrice: false,
            name: selected.name,
            mrp: selected?.priceId?.mrp ? selected?.priceId?.mrp : 0,
            tax: selected.tax,
            qty: selected.qty,
            unit: selected.unit,
            discount: 0,
            order: grnData.products.length + 1,
          },
        ];
      }

      console.log(grnData.products, purchaseProduct.products);
      dispatch(selectProducts(newList));
      setIsFull(false);
    } else {
      newList = [
        {
          id: selected?.id,
          article_code: selected?.article_code,
          priceId: selected?.priceId?._id,
          tp: selected?.priceId?.tp ? selected?.priceId?.tp : 0,
          newPrice: false,
          name: selected?.name,
          mrp: selected?.priceId?.mrp ? selected?.priceId?.mrp : 0,
          tax: selected?.tax,
          qty: selected?.qty,
          unit: selected?.unit,
          discount: 0,
          order: grnData?.products?.length + 1,
        },
      ];
      dispatch(selectProducts(newList));
    }
  };

  // HANDLE CUSTOM QTY
  const handleCustomQty = (e, id) => {
    const customQty = e.target.value !== "" ? e.target.value : 0;

    const seleted = purchaseProduct.products.find((p) => p.id === id);
    const item = grnData.products.find((p) => p.id === id);
    const remain = grnData.products.filter((p) => p.id !== id);
    // console.log(e.target.value, seleted.qty);
    if (item) {
      // let restItem = cartItems.filter((item) => item.article_code !== id);
      if (customQty >= 0) {
        if (seleted.qty >= customQty) {
          const newGrn = [
            ...remain,
            {
              ...item,
              qty: customQty,
            },
          ];
          dispatch(selectProducts(newGrn));
          setIsFull(false);
        }
      }
    }
  };
  // HANDLE CUSTOM TP
  const handleCustomTp = (e, id) => {
    const customTp = e.target.value !== "" ? e.target.value : 0;

    const item = grnData.products.find((p) => p.id === id);
    const remain = grnData.products.filter((p) => p.id !== id);
    if (item) {
      if (customTp >= 0) {
        const newGrn = [
          ...remain,
          {
            ...item,
            tp: customTp,
          },
        ];
        dispatch(selectProducts(newGrn));
        setIsFull(false);
      }
    }
  };

  // HANDLE CUSTOM MRP
  const handleCustomMrp = (e, id) => {
    const customMrp = e.target.value !== "" ? e.target.value : 0;

    const item = grnData.products.find((p) => p.id === id);
    const remain = grnData.products.filter((p) => p.id !== id);
    if (item) {
      // let restItem = cartItems.filter((item) => item.article_code !== id);
      if (customMrp >= 0) {
        const newGrn = [
          ...remain,
          {
            ...item,
            mrp: customMrp,
          },
        ];
        dispatch(selectProducts(newGrn));
        setIsFull(false);
      }
    }
  };

  const removeFromGrn = (id) => {
    const remain = grnData.products.filter((p) => p.id !== id);
    dispatch(selectProducts(remain));
    setIsFull(false);
  };
  const removeAllFromGrn = () => {
    dispatch(selectProducts([]));
    setIsFull(false);
  };

  const handleSelectAllProducts = (products) => {
    notify("All products added", "success");
    console.log("select all");
    let seletedProducts = [];
    let i = 1;
    products.map((pro) => {
      seletedProducts = [
        ...seletedProducts,
        {
          id: pro.id,
          article_code: pro?.article_code,
          priceId: pro?.priceId?._id,
          tp: pro?.priceId?.tp,
          newPrice: false,
          name: pro?.name,
          mrp: pro?.priceId?.mrp,
          tax: pro?.tax,
          qty: pro?.qty,
          unit: pro?.unit,
          discount: 0,
          order: pro.order,
        },
      ];
    });
    // console.log(seletedProducts);
    dispatch(selectProducts([]));
    dispatch(selectProducts(seletedProducts));
    setIsFull(true);
  };
  const handleDeselectAllProducts = () => {
    notify("All products removed", "error");
    dispatch(selectProducts([]));
    setIsFull(false);
  };

  // ADD NEW PRICE
  const addNewPrice = async () => {
    // console.log(purchaseProduct?.shipping_cost)
    // dispatch(selectShipping(purchaseProduct?.shipping_cost))
    // setLoader(true)
    // try {
    //   // if (grnData.products.length > 0) {
    //   //   console.log(grnData.products);
    //   //   //     // setUpdatePrice(false);
    //   //   grnData.products.map(async (pro) => {
    //   //     setNewPrice(false);
    //   //     //CHECK FOR NEW PRICE
    //   //     if (pro.newPrice === true) {
    //   //       console.log("old", pro.priceId);
    //   //       // ADD NEW PRODUCT
    //   //       let price = {};
    //   //       if (pro.newPrice) {
    //   //         price = {
    //   //           article_code: pro.id,
    //   //           supplier: grnData.supplier,
    //   //           warehouse: grnData.warehouse,
    //   //           tp: pro.tp,
    //   //           mrp: pro.mrp,
    //   //           status: "active",
    //   //         };
    //   //         const result = await addPrice(price);
    //   //         console.log(result);
    //   //         // RESET priceId & newPrice
    //   //         if (result?.data?.status === "success") {
    //   //           console.log("new", result?.data?.id);
    //   //           dispatch(
    //   //             selectNewPrice({
    //   //               id: pro.id,
    //   //               priceId: result?.data?.id,
    //   //               newPrice: false,
    //   //             })
    //   //           );
    //   //           notify("New Price Add Successful!", "success");
    //   //           setNewPrice(true);
    //   //           // setUpdatePrice(true);
    //   //           return true;
    //   //         }
    //   //       }
    //   //     }
    //   //   });
    //   //   //     setUpdatePrice(true);
    //   // }
    // } catch (err) {
    //   console.log(err);
    // } finally {
    //   setLoader(false)
    //   setNewPrice(true);
    // }
  };

  // CREATE GRN
  const handleGrnSubmit = async () => {
    console.log(poNo);
    console.log(statusRef.current.value);
    const statusP = statusRef.current.value;
    const sp = { poNo: poNo, status: statusP };
    if (statusP === "Received") {
      dispatch(selectStatus("Complete"));
    }
    console.log(grnData);
    setLoader(true);
    let newIn = [];
    if (grnData?.products.length > 0) {
      const confirm = window.confirm("Are you sure? Wanna create GRN?");
      if (confirm) {
        if (grnData.poNo === "") {
          notify("Please Select PO ", "error");
        } else {
          try {
            const response = await addGrn(grnData);
            console.log(response);
            if (response?.data?.status === "success") {
              await updatePurchase(sp);
              console.log("res", response?.data?.data?.products);
              if (response?.data?.data?.products?.length > 0) {
                response?.data?.data?.products?.map((pro) => {
                  newIn = [
                    ...newIn,
                    {
                      article_code: pro?.article_code,
                      qty: pro?.qty,
                      priceId: pro?.priceId,
                      name: pro?.name,
                    },
                  ];
                });
              }
            } else {
              apiUniqueErrHandle(response?.data);
            }
          } catch (err) {
            console.log(err);
          } finally {
            setPurchaseProduct([]);
            setLoader(false);
            notify("GRN Creation update successful!", "success");
            navigate("/grn");
          }
        }
      }
    } else {
      notify("There must be products for GRN", "error");
    }
  };

  const handleVendorChange = async (value) => {
    console.log(value?.option);

    setPoNo(value?.option);
    await axios
      .get(`${BASE_URL}/purchase/grn/${value?.option}`)
      .then((response) => {
        dispatch(selectShipping(response?.data?.shipping_cost));
        setPurchaseProduct(response.data);
        dispatch(selectSupplier(response.data.supplier._id));
        dispatch(selectWareHouse(response.data.warehouse));
        dispatch(selectPoNo({ id: response.data._id, no: response.data.poNo }));
        dispatch(selectUser(user.id));
        console.log(response.data);
        dispatch(selectProducts([]));
        setNewPrice(false);
      });
  };

  const handleOnChangePrice = async (id, e) => {
    let newCart = [];
    try {
      let price = await axios.get(`${BASE_URL}/price/${e.option}`);
      console.log(price);
      let selected = grnData.products.find((item) => item.id === id);
      let rest = grnData.products.filter((item) => item.id !== id);
      if (price.data) {
        newCart = [
          ...rest,
          {
            ...selected,
            mrp: price.data?.mrp,
            tp: price.data?.tp,
            priceId: price.data?._id,
          },
        ];
      }
    } catch (err) {
      notify(err, "error");
    } finally {
      dispatch(selectProducts(newCart));
      dispatch(selectProducts(newCart));
    }

    // localStorage.setItem("pos_cart", JSON.stringify(newCart));
    console.log(e.option);
    // updateCart();
  };

  const handleNewPrice = (id) => {
    let pro = grnData.products;
    const select = pro.find((p) => p.id === id);
    const rest = pro.filter((p) => p.id !== id);
    // console.log(pro, state);
    let newProduct = [...rest, { ...select, newPrice: !select.newPrice }];
    // console.log(rest, select, id);
    dispatch(selectProducts(newProduct));

    // return { ...state, products:  };
  };

  // selected PO
  // console.log(purchaseProduct);

  // console.log(purchaseProduct.products);
  return (
    <div>
      <div className="container-fluid ">
        <LoadingModal
          title={"Please Wait"}
          onShow={loader}
          handleClose={handleLoaderClose}
        ></LoadingModal>
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Goods Receive Note"></Header>
            <div className="row">
              {/* PURCHASE PRODUCT */}
              <div className="col-md-5">
                <div className="row">
                  <div className="col-12">
                    <Form.Label className="mt-3">
                      <h5>Purchase Order No</h5>
                    </Form.Label>
                    <SelectPurchase
                      poList={poList}
                      format={format}
                      poNo={poNo}
                      handleVendorChange={handleVendorChange}
                    ></SelectPurchase>
                  </div>
                  <div className="col-12">
                    <Form.Group className="mb-3" controlId="formBasicName">
                      <Form.Label> PO Status</Form.Label>

                      <select
                        ref={statusRef}
                        className="form-select"
                        id="status"
                      >
                        {/* <option  value="Partial">Partial</option> */}
                        <option selected value="Received">
                          Received
                        </option>
                        <option value="Ordered">Ordered</option>
                      </select>
                    </Form.Group>
                  </div>
                  <div className="col-12 py-2">
                    {purchaseProduct?.supplier?._id ? (
                      <div className="row">
                        <div className="col-6">
                          <p>
                            {/* {console.log(purchaseProduct?.supplier)} */}
                            <b>Vendor:</b> {purchaseProduct?.supplier?.company}
                            <br />
                            <b>Phone:</b> {purchaseProduct?.supplier?.phone}
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <b>PO:</b> {purchaseProduct?.poNo} <br />
                            <b>Date:</b>{" "}
                            {format(
                              new Date(purchaseProduct?.createdAt),
                              "MM/dd/yyyy"
                            )}
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
                          {/* <th>Tax</th> */}
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
                          purchaseProduct?.products
                            ?.slice()
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <tr key={item.article_code}>
                                <th>{i++}</th>
                                <td>{item.article_code}</td>
                                <td>{item.name}</td>
                                <td>{item.qty}</td>
                                <td>
                                  {parseFloat(item?.tp ? item?.tp : 0).toFixed(
                                    2
                                  )}
                                </td>
                                {/* <td>
                                {(
                                  parseFloat(item.qty) *
                                  (parseFloat(item.tp) *
                                    (parseFloat(item.tax) / 100))
                                ).toFixed(2)}
                              </td> */}
                                <td>
                                  {item?.tp
                                    ? (
                                        parseFloat(item.qty) *
                                        (parseFloat(item.tp) +
                                          item.tp *
                                            (parseFloat(item.tax) / 100))
                                      ).toFixed(2)
                                    : parseFloat(0).toFixed(2)}
                                  {/* {((parseFloat(item.tp) * (parseFloat(item.tax)) / 100)).toFixed(2)} */}
                                </td>
                                <td>
                                  {/* <BsSquareHalf className="me-2" /> */}
                                  <BsArchive
                                    onClick={() => handleSelectItem(item.id)}
                                  />
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <th colSpan={8} className="text-center">
                              {" "}
                              Please Select a GRN Order
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
                          <th>Items: {total_item}</th>
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
              {/* GRN PRODUCT */}
              <div className="col-md-7 mb-3">
                <h5 className="pt-2">Receivable Products List</h5>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Qty</th>
                      <th>TP</th>
                      <th>MRP</th>
                      <th>CP</th>
                      <th>Total</th>
                      <td>
                        <AiOutlineClose onClick={removeAllFromGrn} />
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {grnData?.products?.length > 0 ? (
                      grnData?.products
                        ?.slice()
                        ?.sort((a, b) => a.order - b.order)
                        ?.map((item) => (
                          <tr key={item?.id}>
                            <th>{j++}</th>
                            <td>{item?.article_code}</td>
                            <td>{item?.name}</td>
                            <td>
                              <div className="input-group ">
                                {/* quantity */}
                                <input
                                  type="text"
                                  className="form-control quantity"
                                  width="60%"
                                  id={item?.id}
                                  onChange={(e) => handleCustomQty(e, item?.id)}
                                  value={item?.qty}
                                  defaultValue={item?.qty}
                                />
                              </div>
                            </td>
                            <td>
                              {/* tp */}
                              <input
                                type="text"
                                disabled={!item?.newPrice ? "disabled" : ""}
                                className="form-control quantity"
                                width="60%"
                                id={item?.id}
                                onChange={(e) => handleCustomTp(e, item?.id)}
                                value={item?.tp ? item?.tp : 0}
                                // value={item?.tp === "NaN" ? item?.tp : 0}
                                defaultValue={
                                  parseFloat(item?.tp).toFixed(2)
                                    ? parseFloat(item?.tp).toFixed(2)
                                    : 0
                                }
                              />
                            </td>
                            <td style={{ width: "120px" }}>
                              {/* mrp */}
                              {item?.newPrice ? (
                                <input
                                  type="text"
                                  className="form-control quantity"
                                  width="60%"
                                  id={item?.id}
                                  onChange={(e) => handleCustomMrp(e, item?.id)}
                                  value={item?.mrp}
                                  // value={item?.mrp === "NaN" ? item?.mrp : 0}
                                  defaultValue={
                                    parseFloat(item?.mrp).toFixed(2)
                                      ? parseFloat(item?.mrp).toFixed(2)
                                      : 0
                                  }
                                />
                              ) : (
                                <SelectPriceGrn
                                  sc={item?.id}
                                  setVal={item?.mrp}
                                  handleOnChangeCategory={handleOnChangePrice}
                                  // handleCustomMrp={handleCustomMrp}
                                ></SelectPriceGrn>
                              )}
                              {/* <SelectPriceGrn
                                sc={item?.id}
                                setVal={item?.mrp}
                                handleOnChangeCategory={handleOnChangePrice}
                                // handleCustomMrp={handleCustomMrp}
                              ></SelectPriceGrn> */}
                            </td>
                            <td>
                              {/* PriceID */}
                              <Form.Check
                                type="switch"
                                checked={item?.newPrice ? "checked" : ""}
                                id="custom-switch"
                                onChange={() => handleNewPrice(item?.id)}
                                label=""
                              />
                              {/* {console.log(item?.id)} */}
                            </td>
                            <td>
                              {(
                                parseFloat(item?.qty) *
                                (parseFloat(item?.tp) +
                                  parseFloat(item?.tp) *
                                    (item?.tax
                                      ? parseFloat(item?.tax) / 100
                                      : 0))
                              ).toFixed(2)}
                              {/* {console.log(
                                typeof item.tp,
                                typeof item.mrp,
                                typeof item.qty,
                                typeof item.tax
                              )} */}
                            </td>
                            <td>
                              {/* <BsSquareHalf className="me-2" /> */}
                              <AiOutlineClose
                                onClick={() => removeFromGrn(item.id)}
                              />
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <th colSpan={8} className="text-center">
                          {" "}
                          Please Select a GRN Order
                        </th>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Shipping Cost</Form.Label>
                  <Form.Control
                    as="input"
                    type="number"
                    rows={3}
                    onChange={(e) => dispatch(selectShipping(e.target.value))}
                    // onChange={(e) => handleShippingData(e.target.value)}
                    // onChange={handleShippingData}
                  />
                </Form.Group>
                <Table className="bordered striped ">
                  <thead>
                    <tr>
                      <th>Items: {grntotal_item}</th>
                      <th>Tax: {grntax?.toFixed(2)}</th>
                      <th>Total: {grntotal?.toFixed(2)}</th>
                      {console.log(purchaseProduct)}
                      {/* <th>Order Discount: {purchase.discount}</th> */}
                      {/* <th>Shipping Cost: {purchase.shipping}</th> */}
                      <th>Shipping Cost: {grnData?.shipping_cost}</th>
                      {console.log(typeof grnData?.shipping_cost)}
                      {console.log(grntotal + grntax + grnData?.shipping_cost)}
                      <th>
                        Grand Total:{" "}
                        {parseFloat(
                          grntotal + grntax + parseFloat(grnData?.shipping_cost)
                        ).toFixed(2)}
                      </th>
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
                    required
                    onChange={(e) => dispatch(selectNote(e.target.value))}
                  />
                </Form.Group>
                {/* <button
                  // disabled={newPrice === true && "disabled"}
                  className="btn btn-dark me-3"
                // onClick={() => {
                 addNewPrice();
                // }}
                >
                  <Icons.CurrencyBangladeshiOutline size={20} /> Create New
                  Price
                </button> */}
                <button
                  // disabled={newPrice === false && "disabled"}
                  className="btn btn-dark"
                  onClick={() => {
                    handleGrnSubmit();
                  }}
                >
                  <Icons.SaveOutline size={20} /> Create GRN
                </button>
              </div>
            </div>
            <LoadingModal
              title="Please Wait..."
              onShow={onShow}
              handleClose={handleClose}
            />
            <Toaster position="bottom-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GRNCreate;
