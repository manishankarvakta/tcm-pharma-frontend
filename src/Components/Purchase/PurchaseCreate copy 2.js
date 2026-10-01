import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import ProductSearch from "../Common/ProductSearch/ProductSearch";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
import { useForm } from "react-hook-form";
import * as Icons from "heroicons-react";
import CsvImporter from "../Common/CsvImporter/CsvImporter";
import { notify } from "../Utility/Notify";
import { Toaster } from "react-hot-toast";
import usePurchase from "../Hooks/usePurchase";
import usePurchaseCarts from "../Hooks/usePurchaseCarts";
import { hash, signInUser } from "../Utility/Auth";
import axios from "../../services/apiClient";
import useInventory from "../Hooks/useInventory";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import WareHouseDWPurchase from "../Common/CustomSelect/WareHouseDWPurchase";
import { BsArchive, BsCheckSquare, BsSquare } from "react-icons/bs";

import PurchaseCart from "./parts/PurchaseCart";
import SupplierProduct from "./parts/SupplierProduct";
import { total, toDecimal } from "../Utility/PurchaseCalculations";
import { useNavigate } from "react-router-dom";
import { useAddPurchaseMutation } from "../../services/purchasApi";
import { apiUniqueErrHandle } from "../Utility/Utility";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProducts,
  selectSupplier,
  selectUser,
  selectWareHouse,
  selectDiscount,
  selectCalculation,
  selectShipping,
  selectNote,
  selectStatus,
  resetPurchase,
} from "../../features/purchaseSlice";
import CsvPurchaseProduct from "../Common/CsvImporter/CsvPurchaseProduct";
import LoadingModal from "../Common/Modal/LoadingModal";
import useKeypress from "react-use-keypress";

// import SearchProduct from "../Common/CustomSelect/SearchProduct";
// import PosCart from "../Pages/POS/Parts/PosCart";
// import useProducts from "../Hooks/useProducts";

const PurchaseCreate = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [addPurchase] = useAddPurchaseMutation();
  const [productList, setProductList] = useState([]);
  const [supplierProductId, setSupplierProductId] = useState("");
  const [purchaseView, setPurchaseView] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const { register, handleSubmit, isSubmitSuccessful, reset } =
    useForm();

  const {
    purchaseCarts,
    setPurchaseCarts,
    updatePurchaseCart,
    handleQuantityInput,
  } = usePurchaseCarts();
  const [q, setQ] = useState("");
  const [calcTotal, setCalcTotal] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [onShow, setOnShow] = useState(false);
  const [supplierProducts, setSupplierProducts] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0);

  const user = signInUser();
  const { totalItems, purchase, setPurchase } = usePurchase();
  // const { updateInventoryIn, inventory, setInventory } = useInventory();
  const [filteredProduct, setFilteredProduct] = useState(productList)
  const [wh, setWh] = useState("");
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const supplierSearchRef = useRef(null);
  const firstProductRef = useRef(null);
  const firstQtyRef = useRef(null);
  const tableRef = useRef(null);

  useKeypress("F2", (e) => {
    e.preventDefault();
    supplierSearchRef.current.focus();
  });

  const handleClose = () => setOnShow(false);
  // const /
  // console.log("purchaseCart", totalItems);
  const purchaseData = useSelector((state) => state.purchaseReducer);
  useEffect(() => {
    // ORDER SELECTED PRODUCT
    console.log(purchaseData.products)
    let orderdList = purchaseData.products
      .slice()
      .sort((a, b) => a.order - b.order);
    const totalcal = total(purchaseData.products);

    // SELECT CAL TOTAL
    dispatch(
      selectCalculation({
        totalItem: totalcal[2],
        total: totalcal[1],
        tax: totalcal[0],
      })
    );
    // SELECT USER
    dispatch(selectUser(user.id));
    // setCalcTotal(totalcal);
    setProductList(orderdList);
  }, [purchaseData.products]);

  useLayoutEffect(() => {
    if (productList.length > 0 && firstQtyRef.current) {
      firstQtyRef.current.focus();

    }
  }, [productList, purchaseData, firstQtyRef]);
  // useEffect(() => {
  //   if (productList.length > 0 && firstQtyRef.current) {
  //     firstQtyRef.current.focus();
  //   }
  // }, [productList, purchaseData, firstQtyRef]);

  const handleSearch = (q) => {
    console.log(q)
    if (q.length > 0) {

      const re = new RegExp(q, 'i');
      const filtered = supplierProducts.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.match(re)));

      setFilteredProduct(filtered)
      console.log("Original:", supplierProducts)
      console.log("filter:", filtered)
    } else {
      setFilteredProduct(supplierProducts)
    }

  }

  useEffect(() => {
    setFilteredProduct(supplierProducts)
  }, [supplierProducts])

  // useEffect(() => {
  //   if (q.length > 0) {
  //     handleSearch(q)
  //   }
  // }, [q])

  console.log(purchaseData);

  const handleBillSubmit = async () => {
    // console.log(purchaseData)
    // setOnShow(true)
    // try {
    //   const confirm = window.confirm("Are you Sure? Create this Purchase?");
    //   if (confirm) {
    //     const response = await addPurchase(purchaseData);
    //     if (response) {
    //       console.log(response);
    //       if (response?.error) {
    //         apiUniqueErrHandle(response);
    //       } else {
    //         dispatch(resetPurchase());
    //         console.log(response?.data?.message);
    //         console.log(purchaseData);
    //         setPurchase({});
    //         notify("Purchase create is successful", "success")
    //         return navigate("/purchase");
    //       }
    //     }
    //   } else {
    //     notify("Can not create purchase", "error")
    //     return;
    //   }
    // } catch (err) {
    //   console.log(err)
    // } finally {
    //   setOnShow(false)
    //   dispatch(resetPurchase());
    // }
  };

  /**
   * HANDLE IMPORT PRODUCT
   */

  const handleImportButton = async () => {
    let importProducts = [];
    let i = 1;
    console.log('csv', csvData);
    setOnShow(true);
    if (csvData?.length > 0) {
      csvData.map(async (pro) => {
        // console.log(pro);
        if (pro?.article_code) {
          try {
            const details = await axios(
              `${BASE_URL}/product/pro-details/${pro.article_code}`
            );
            // console.log(details);
            if (details.status === 200) {
              const data = details.data;
              importProducts = [
                ...importProducts,
                {
                  id: data?._id,
                  article_code: data?.article_code,
                  tp: data?.tp > 0 ? data?.tp : 0,
                  mrp: data?.mrp > 0 ? data?.mrp : 0,
                  name: data?.name,
                  qty: pro?.qty,
                  tax: 0,
                  discount: 0,
                  order: pro?.order,
                },
              ];
              setOnShow(false);
            }
          } catch (err) {
            notify(err, "error");
          } finally {
            console.log(importProducts);
            dispatch(selectProducts(importProducts));
            // if (importProducts?.length === csvData?.length) {
            // }
          }
        }

      });
    } else {
      setOnShow(false);
      notify("There is no products to import", "error");
    }
    console.log(importProducts)
  };

  // console.log(productList[0].tp)
  // HANDLE SELECT SUPPLIER
  const handleVendorChange = async (value) => {
    console.log(value)
    try {
      setOnShow(true)
      setSupplierProductId(value?.option);
      const result = await axios.get(`${BASE_URL}/supplier/${value.option}`);
      // setPurchase({ value.option });
      console.log("supplier", result?.data);
      setSupplierProducts(result.data.products)
      dispatch(selectSupplier(result?.data._id));
      dispatch(selectProducts([]));
      setPurchase(result?.data);
    } catch (err) {
      console.log(err)
    } finally {
      setOnShow(false)
    }
  };

  const handleOnchangeWareHouse = (e) => {
    setWh(e.option);
    dispatch(selectWareHouse(e?.option));
  };

  const emptyCart = () => {
    if (window.confirm("Refresh Cart! Start New Purchase?") === true) {
      dispatch(selectProducts([]));
    } else {
      console.log("Refresh Operation Cancelled by POSER");
    }
  };

  const removeFromCart = (code) => {
    const rest = purchaseData.products.filter(
      (pro) => pro.article_code !== code
    );
    notify("Product is removed", "error")
    // console.log(code);
    dispatch(selectProducts(rest));
  };

  // console.log(purchaseCart);

  const localStorageAddFromCart = (items) => {
    // console.log(purchaseData);
    console.log("items", items)
    // console.log("items price", items.id.priceList)

    // console.log("purchase data", purchaseData.id)
    let list = [];
    if (purchaseData.products.length > 0) {

      const matched = purchaseData.products.find(
        (pro) => pro?.id === items?.id?._id
      );
      const rest = purchaseData.products.filter(
        (pro) => pro?.id !== items?.id?._id
      );
      console.log("matched", matched);
      console.log("rest", rest);
      if (matched) {
        console.log("matched");
        list = [...purchaseData?.products];
        notify("Product is already added", "error")
      } else {
        console.log("not matched");
        notify("Product is added", "success")



        list = [
          ...rest,
          {
            id: items?.id._id,
            article_code: items?.id?.article_code,
            qty: 0,
            tp: items?.id?.tp,
            mrp: items?.id?.mrp,
            tax: 0,
            discount: 0,
            unit: items?.unit,
            name: items?.name,
            order: purchaseData?.products?.length + 1,
          },
        ];
      }
    } else {
      console.log(items.id)

      list = [
        {
          id: items?.id?._id,
          article_code: items?.id?.article_code,
          qty: 0,
          tp: items?.id?.tp,
          mrp: items?.id?.mrp,
          tax: 0,
          discount: 0,
          name: items?.name,
          order: 1,
        },
      ];
    }
    dispatch(selectProducts(list));
    // let localData = JSON.parse(localStorage.getItem("purchase_cart"));
  };

  // useEffect(() => {
  //   const purchaseCart = getStoredCart();
  //   setPurchaseCarts(newPurchaseCart);
  // }, []);
  const addQuantities = (id) => {
    if (purchaseData?.products) {
      let list = [];
      const item = purchaseData?.products?.find(
        (item) => item?.article_code === id
      );
      const restItem = purchaseData.products.filter(
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

  const removeQuantities = (id) => {
    if (purchaseData.products) {
      let list = [];
      const item = purchaseData.products.find(
        (item) => item.article_code === id
      );
      const restItem = purchaseData.products.filter(
        (item) => item.article_code !== id
      );

      if (item) {
        list = [...restItem, { ...item, qty: item.qty - 1 }];
      } else {
        list = [...restItem];
      }
      dispatch(selectProducts(list));
    }
  };

  const handleCustomQty = (e, id) => {
    let list = [];
    const customQty = e.target.value !== "" ? e.target.value : 0;
    // console.log(customQty, id);
    // const cartItems = getStoredCart();
    const item = purchaseData?.products?.find((item) => item?.article_code === id);
    if (item) {
      let restItem = purchaseData?.products?.filter(
        (item) => item?.article_code !== id
      );
      if (customQty >= 0) {
        // item.qty = customQty;
        list = [...restItem, { ...item, qty: customQty }];
        dispatch(selectProducts(list));
      }
    }
  };

  const handleCustomTax = (e, id) => {
    let list = [];
    const tax = e.target.value !== "" ? e.target.value : 0;
    // console.log(tax, id);
    const item = purchaseData?.products?.find((item) => item?.article_code === id);
    if (item) {
      let restItem = purchaseData?.products.filter(
        (item) => item.article_code !== id
      );
      if (tax >= 0) {
        // item.qty = customQty;
        list = [...restItem, { ...item, tax: tax }];
        dispatch(selectProducts(list));
      }
    }
  };

  const handleCustomTp = (e, id) => {
    let list = [];
    const tp = e.target.value !== "" ? e.target.value : 0;
    // console.log("TP", tp, id);
    const item = purchaseData?.products?.find((item) => item?.article_code === id);
    if (item) {
      let restItem = purchaseData?.products?.filter(
        (item) => item?.article_code !== id
      );
      if (tp >= 0) {
        // item.qty = customQty;
        list = [...restItem, { ...item, tp: tp }];
        dispatch(selectProducts(list));
      }
    }
  };

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));
  // useEffect(() => {
  //   dispatch(selectUser(loggedInUser.id);
  // }, [loggedInUser]);

  const handleSelectAllProducts = (products) => {
    setPurchaseView([]);
    setPurchaseView(products);
    setIsFull(true);
  };
  const handleDeselectAllProducts = (products) => {
    setPurchaseView([]);
    setIsFull(false);
  };
  // const handleProductSearch = (e) => {
  //   console.log(e.target.value)
  //   setQ(e.target.value)
  // }

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex < filteredProduct.length - 1 ? prevIndex + 1 : prevIndex));
    }
  };
  const handleOnEnter = (event) => {
    console.log("event", event)
    if (event.keyCode === 40) {
      // if (event.target === firstProductRef.current) {
      // }
      // console.log("focus")
      // console.log()
      tableRef.current.focus(); // Check if the ref and focus() method are correct
      // if (firstProductRef && firstProductRef.current) {
      //   console.log("focus2")
      // }

    }
  }
  const handleAddKeyPress = (e, item) => {
    console.log(e)
    const selectedRowItem = filteredProduct[selectedIndex];

    console.log("Selected item:", selectedRowItem);
    localStorageAddFromCart(selectedRowItem)
    console.log(firstQtyRef.current)
    if (firstQtyRef.current) {
      firstQtyRef.current.focus()
    }
  }
  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mt-2">
            <Header title="Create New Purchase"></Header>

            <Form className="pt-3">
              <div className="row">
                <div className="col-6">
                  {/* <input type="hidden" {...register("_id")} /> */}
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    <WareHouseDWPurchase
                      // {...setValue("warehouse", `${wh}`)}
                      id="warehouse"
                      name="warehouse"
                      handleOnChange={handleOnchangeWareHouse}
                      wh={wh !== "" ? wh : 0}
                    // {...register("warehouse")}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group className="">
                    <Form.Label>Supplier</Form.Label>
                    <SelectSupplier
                      supplier_code={purchase?.supplier_code}
                      setPurchase={setPurchase}
                      handleOnchange={handleVendorChange}
                    // {...setValue("supplier", `${supplierProductId}`)}
                    // {...register("supplier_code", { required: true })}
                    ></SelectSupplier>
                  </Form.Group>
                </div>
                <div className="col-4 mb-3">
                  <Form.Group className="">
                    <Form.Label>Purchase Status</Form.Label>
                    <Form.Select
                      onChange={(e) => dispatch(selectStatus(e.target.value))}
                      disabled
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ordered">Ordered</option>
                      <option value="Received">Received</option>
                      <option value="Canceled">Canceled</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-8 mb-3">
                  <CsvPurchaseProduct
                    title="Supplier Product"
                    setCsvData={setCsvData}
                    handleImportButton={handleImportButton}
                  />
                </div>
                {/* <div className="col-8 mb-3">
                  <label>Supplier Products</label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div> */}
                {/* <div className="col-6">
                  <Form.Group className="" {...register("attached_doc")}>
                    <Form.Label>Attached Documents</Form.Label>
                    <input type="file" className="from-control" name="" />
                  </Form.Group>
                </div> */}
                <div className="container">
                  <div className="row">
                    <div className="col-5">
                      <div className="card">
                        <div className="card-header">
                          Supplier Products List
                          <div className="">
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              placeholder="Search Product"
                              onChange={(e) => handleSearch(e.target.value)}
                              ref={supplierSearchRef}
                              onKeyDown={(e) => { handleOnEnter(e) }}
                            />
                          </div>
                        </div>
                        {
                          filteredProduct?.length > 0 ?
                            <Table
                              ref={tableRef}
                              onKeyDown={(e) => { handleKeyPress(e) }}
                              onKeyPress={(e) => handleAddKeyPress(e)}
                              tabIndex="0"
                              className="mt-3 table-responsive" style={{ overflowY: "scroll", display: "block", height: "200px" }}>
                              <thead>
                                <tr>
                                  <th>#</th>
                                  {/* <th>Code</th> */}
                                  <th>Name</th>
                                  <th>Stock</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <SupplierProduct
                                  // firstProductRef={firstProductRef}
                                  selectedIndex={selectedIndex}
                                  updatePurchaseCart={updatePurchaseCart}
                                  productList={filteredProduct}
                                  localStorageAddFromCart={localStorageAddFromCart}
                                  addQuantities={addQuantities}
                                  removeQuantities={removeQuantities}
                                  handleCustomQty={handleCustomQty}
                                  handleCustomTax={handleCustomTax}
                                  handleCustomTp={handleCustomTp}
                                  setPurchaseCarts={setPurchaseCarts}
                                  q={q}
                                ></SupplierProduct>
                              </tbody>
                            </Table> : <Table className="mt-3 table-responsive">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  {/* <th>Code</th> */}
                                  <th>Name</th>
                                  <th>Stock</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <SupplierProduct
                                  updatePurchaseCart={updatePurchaseCart}
                                  productList={filteredProduct}
                                  localStorageAddFromCart={localStorageAddFromCart}
                                  addQuantities={addQuantities}
                                  removeQuantities={removeQuantities}
                                  handleCustomQty={handleCustomQty}
                                  handleCustomTax={handleCustomTax}
                                  handleCustomTp={handleCustomTp}
                                  setPurchaseCarts={setPurchaseCarts}
                                  q={q}
                                ></SupplierProduct>
                              </tbody>
                            </Table>
                        }

                      </div>
                    </div>
                    <div className="col-7">
                      <div className="card">
                        <div className="card-header">
                          Purchase Products List
                        </div>
                        <Table className="mt-3 ">
                          <thead>
                            <tr>
                              <th>#</th>
                              {/* <th>Code</th> */}
                              <th>Name</th>
                              {/* <th>Tax</th> */}
                              <th>Quantity</th>
                              <th>TP</th>
                              {/* <th>Tax</th> */}
                              <th>Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            <PurchaseCart
                              firstQtyRef={firstQtyRef}
                              updatePurchaseCart={updatePurchaseCart}
                              purchaseCarts={productList}
                              removeFromCart={removeFromCart}
                              addQuantities={addQuantities}
                              removeQuantities={removeQuantities}
                              handleCustomQty={handleCustomQty}
                              handleCustomTax={handleCustomTax}
                              handleCustomTp={handleCustomTp}
                              setPurchaseCarts={setPurchaseCarts}
                              purchaseView={purchaseView}
                            ></PurchaseCart>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="row"> */}
                <div className="col-md-4">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Tax</Form.Label>
                    <Form.Select id="tax" {...register("tax")}>
                      <option value="0" selected>
                        0
                      </option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      type="number"
                      className="discount"
                      placeholder="Discount"
                      onChange={(e) => dispatch(selectDiscount(e.target.value))}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Shipping Cost</Form.Label>
                    <Form.Control
                      onChange={(e) => dispatch(selectShipping(e.target.value))}
                      type="number"
                      className="shipping"
                      placeholder="Shipping Cost"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-12 mb-2">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Note</Form.Label>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Note"
                      onChange={(e) => dispatch(selectNote(e.target.value))}
                    />
                  </Form.Group>
                </div>
              </div>
              {/* </div> */}

              <Button
                variant="dark"
                onClick={handleBillSubmit}
                className="float-end my-2"
                type="button"
              >
                <Icons.SaveOutline size={20} /> Submit
              </Button>
              <Button
                variant="dark"
                className="float-end my-2 mx-2"
                type="button"
                onClick={emptyCart}
              >
                Reset Cart
              </Button>

              <Table className="bordered striped ">
                <thead>
                  <tr>
                    <th
                    // {...setValue("totalItem", purchaseData?.products?.length)}
                    >
                      Items: {purchaseData?.totalItem}
                    </th>
                    <th>Total Tax: {purchaseData.tax?.toFixed(2)}</th>
                    <th>Order Total: {purchaseData.total?.toFixed(2)}</th>
                    <th>Order Discount: {purchaseData.discount}</th>
                    <th>Shipping Cost: {purchaseData.shipping_cost}</th>
                    <th>
                      Grand Total:{" "}
                      {parseInt(purchaseData.tax) +
                        parseInt(purchaseData.total) +
                        Number(purchaseData?.shipping_cost) -
                        Number(purchaseData?.discount)}
                    </th>
                  </tr>
                </thead>
              </Table>
            </Form>
          </div>
        </div>
        <LoadingModal
          onShow={onShow}
          title="Please Wait.."
          handleClose={handleClose}
        />
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
};

export default PurchaseCreate;
