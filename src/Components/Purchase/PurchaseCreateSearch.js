import axios from "../../services/apiClient";
import * as Icons from "heroicons-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useKeypress from "react-use-keypress";
import {
  resetPurchase,
  selectCalculation,
  selectDiscount,
  selectNote,
  selectProducts,
  selectShipping,
  selectSupplier,
  selectUser,
  selectWareHouse,
} from "../../features/purchaseSlice";
import { useAddPurchaseMutation } from "../../services/purchasApi";
import CsvPurchaseProduct from "../Common/CsvImporter/CsvPurchaseProduct";
import PosSearchProductPurchase from "../Common/CustomSelect/PosSearchProductPurchase";
import SelectSupplierPo from "../Common/CustomSelect/SelectSupplierPo";
import WareHouseDWPurchase from "../Common/CustomSelect/WareHouseDWPurchase";
import Header from "../Common/Header/Header";
import LoadingModal from "../Common/Modal/LoadingModal";
import SideBar from "../Common/SideBar/SideBar";
import usePurchase from "../Hooks/usePurchase";
import usePurchaseCarts from "../Hooks/usePurchaseCarts";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { total } from "../Utility/PurchaseCalculations";
import { apiUniqueErrHandle } from "../Utility/Utility";
import PurchaseCartSearch from "./parts/PurchaseCartSearch";
import AlertService from "../Utility/AlertService";

const getUnit = (u) => {
  if (Array.isArray(u)) {
    if (u.length === 0) return "";
    return typeof u[0] === "object" && u[0] !== null ? (u[0].symbol || u[0].name || "") : String(u[0]);
  }
  if (typeof u === "object" && u !== null) {
    return u.symbol || u.name || "";
  }
  return u || "";
};

const PurchaseCreateSearch = () => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const purchaseData = useSelector((state) => state.purchaseReducer);
  const [addPurchase] = useAddPurchaseMutation();

  const [isPO, setIsPO] = useState(true);
  const [wh, setWh] = useState("");
  const [onShow, setOnShow] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [productList, setProductList] = useState([]);
  const user = signInUser();
  const { aamarId } = user;

  const { totalItems, purchase, setPurchase } = usePurchase();
  const handleClose = () => setOnShow(false);
  const supplierProductsRef = useRef(null);
  const firstQtyRef = useRef(null);
  const {
    purchaseCarts,
    setPurchaseCarts,
    updatePurchaseCart,
    handleQuantityInput,
  } = usePurchaseCarts();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // ORDER SELECTED PRODUCT
    console.log(purchaseData.products);
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
      firstQtyRef?.current?.focus();
    }
  }, [productList?.length]);

  useKeypress("F1", (e) => {
    e.preventDefault();
    supplierProductsRef.current.focus();
  });
  const handleKeyDownToSearch = (event) => {
    // event.preventDefault()
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target === firstQtyRef.current) {
        supplierProductsRef.current.focus();
      }
    }
  };
  const handleDeSelectIsPO = () => {
    setIsPO(false);
    navigate(`/purchase-create`, { state: { fromUntick: true } });
  };
  const handleIsPO = () => {
    setIsPO(true);
    navigate(`/purchase-createSearch`);
  };
  const handleOnchangeWareHouse = (e) => {
    setWh(e.option);
    dispatch(selectWareHouse(e?.option));
  };
  const handleVendorChange = async (value) => {
    console.log(value);
    try {
      setOnShow(true);
      // const result = await axios.get(`${BASE_URL}/supplier/${value.option}`);
      // setPurchase({ value.option });
      // console.log("supplier", result?.data);
      // setSupplierProducts(result.data.productDetails)
      dispatch(selectSupplier(value?.option));
      dispatch(selectProducts([]));
      // setPurchase(result?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setOnShow(false);
    }
  };
  const addToPurchaseProduct = async (items) => {
    console.log(items);
    console.log("items", items);
    // console.log("items price", items.id.priceList)

    // console.log("purchase data", purchaseData.id)
    let list = [];
    if (purchaseData.products.length > 0) {
      let matched = [];
      let rest = [];
      if (items?.length > 0) {
        console.log("items,items", items);
        matched = purchaseData.products.find(
          (pro) => pro?.id === items[0]?._id
        );
        rest = purchaseData.products.filter((pro) => pro?.id !== items[0]?.id);
        console.log("matched", matched);
        console.log("rest", rest);
        if (matched) {
          console.log("matched");
          list = [...purchaseData?.products];
          notify("Product is already added", "error");
        } else {
          console.log("not matched");
          notify("Product is added", "success");
          list = [
            ...rest,
            {
              id: items[0]?._id,
              article_code: items[0]?.article_code,
              qty: 0,
              tp: items[0]?.tp,
              mrp: items[0]?.mrp,
              tax: 0,
              discount: 0,
              unit: getUnit(items[0]?.unit),
              name: items[0]?.name,
              order: purchaseData?.products?.length + 1,
            },
          ];
        }
      } else {
        console.log("items,items,items", items);

        matched = purchaseData.products.find((pro) => pro?.id === items?._id);
        rest = purchaseData.products.filter((pro) => pro?.id !== items?.id);
        console.log("matched", matched);
        console.log("rest", rest);
        if (matched) {
          console.log("matched");
          list = [...purchaseData?.products];
          notify("Product is already added", "error");
        } else {
          console.log("not matched");
          notify("Product is added", "success");

          list = [
            ...rest,
            {
              id: items?._id,
              article_code: items?.article_code,
              qty: 0,
              tp: items?.tp,
              mrp: items?.mrp,
              tax: 0,
              discount: 0,
              unit: getUnit(items?.unit),
              name: items?.name,
              order: purchaseData?.products?.length + 1,
            },
          ];
        }
      }
    } else {
      // console.log(items.id)

      if (items.length > 0) {
        list = [
          {
            id: items[0]?._id,
            article_code: items[0]?.article_code,
            qty: 0,
            tp: items[0]?.tp,
            mrp: items[0]?.mrp,
            tax: 0,
            discount: 0,
            unit: getUnit(items[0]?.unit),
            name: items[0]?.name,
            order: 1,
          },
        ];
      } else {
        list = [
          {
            id: items?._id,
            article_code: items?.article_code,
            qty: 0,
            tp: items?.tp,
            mrp: items?.mrp,
            tax: 0,
            discount: 0,
            unit: getUnit(items?.unit),
            name: items?.name,
            order: 1,
          },
        ];
      }
    }
    dispatch(selectProducts(list));
  };

  const handleImportButton = async () => {
    let importProducts = [];
    let i = 1;
    console.log("csv", csvData);
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
                  unit: getUnit(data?.unit),
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
    console.log(importProducts);
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    console.log("purchaseData", purchaseData);
    setOnShow(true);
    try {
      const confirmed = await AlertService.confirm("Are you Sure?", "Create this Purchase?");
      if (confirmed) {
        if (purchaseData.supplier === "") {
          notify("Please Select Supplier", "error");
        } else {
          const response = await addPurchase(purchaseData);
          if (response) {
            console.log(response);
            if (response?.error) {
              apiUniqueErrHandle(response);
            } else {
              dispatch(resetPurchase());
              console.log(response?.data?.message);
              console.log(purchaseData);
              setPurchase({});
              notify("Purchase create is successful", "success");
              // dispatch(resetPurchase());
              return navigate("/purchase");
            }
          }
        }
      } else {
        notify("Can not create purchase", "error");
        return;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setOnShow(false);
    }
  };

  const emptyCart = async () => {
    const confirmed = await AlertService.confirm("Refresh Cart?", "Start New Purchase?");
    if (confirmed) {
      dispatch(selectProducts([]));
    } else {
      console.log("Refresh Operation Cancelled by POSER");
    }
  };
  const removeFromCart = (code) => {
    const rest = purchaseData.products.filter(
      (pro) => pro.article_code !== code
    );
    notify("Product is removed", "error");
    // console.log(code);
    dispatch(selectProducts(rest));
  };

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
        list = [...restItem, { ...item, qty: parseFloat(item.qty) + 1 }];
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
        list = [...restItem, { ...item, qty: parseFloat(item.qty) - 1 }];
      } else {
        list = [...restItem];
      }
      dispatch(selectProducts(list));
    }
  };
  const handleCustomQty = (e, id) => {
    e.preventDefault();
    let list = [];
    const customQty = e.target.value !== "" ? e.target.value : 0;
    // console.log(customQty, id);
    // const cartItems = getStoredCart();
    const item = purchaseData?.products?.find(
      (item) => item?.article_code === id
    );
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
    const item = purchaseData?.products?.find(
      (item) => item?.article_code === id
    );
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
    e.preventDefault();
    let list = [];
    const tp = e.target.value !== "" ? e.target.value : 0;
    // console.log("TP", tp, id);
    const item = purchaseData?.products?.find(
      (item) => item?.article_code === id
    );
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
  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mt-2">
            <Header title="Create New Purchase"></Header>
            <div className="col-12">
              <div className="col-md-4 d-flex justify-content-start align-items-center">
                <Form.Label>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <b>Purchase Without Supplier: </b>
                      {isPO ? (
                        <BsCheckSquare onClick={() => handleDeSelectIsPO()} />
                      ) : (
                        <BsSquare onClick={() => handleIsPO()} />
                      )}
                    </div>
                  </div>
                </Form.Label>
              </div>
            </div>

            <Form className="pt-3">
              <div className="row">
                {/* <div className="row"> */}
                <div className="col-md-6 mb-3">
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    {user?.type !== "admin" ? (
                      <div>{wh}</div>
                    ) : (
                      <WareHouseDWPurchase
                        handleOnChange={handleOnchangeWareHouse}
                        wh={wh}
                      />
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-6  mb-3">
                  <Form.Group className="w-100">
                    <Form.Label>Supplier</Form.Label>
                    <SelectSupplierPo
                      sp={purchase?.supplier_code}
                      setPurchase={setPurchase}
                      handleOnchange={handleVendorChange}
                    // {...setValue("supplier", `${supplierProductId}`)}
                    // {...register("supplier_code", { required: true })}
                    ></SelectSupplierPo>
                  </Form.Group>
                  {/* </div> */}
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Group className="">
                    <Form.Label>Products</Form.Label>
                    <PosSearchProductPurchase
                      className="searchProduct"
                      addToList={addToPurchaseProduct}
                      supplierProductsRef={supplierProductsRef}
                    ></PosSearchProductPurchase>
                  </Form.Group>
                </div>
                <div className="col-md-6 mb-3">
                  <CsvPurchaseProduct
                    title="Product"
                    setCsvData={setCsvData}
                    handleImportButton={handleImportButton}
                  />
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">Purchase Products List</div>
                    <div>
                      <Table className="mt-3 mb-3">
                        <thead>
                          <tr>
                            <th>#</th>
                            {/* <th>Code</th> */}
                            <th>Name</th>
                            {/* <th>Tax</th> */}
                            <th>Quantity</th>
                            <th>TP</th>
                            <th>Mrp</th>
                            {/* <th>Tax</th> */}
                            <th>Total</th>
                          </tr>
                        </thead>

                        <tbody>
                          <PurchaseCartSearch
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
                            handleKeyDownToSearch={handleKeyDownToSearch}
                          ></PurchaseCartSearch>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Tax</Form.Label>
                    <Form.Select id="tax">
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
                      onChange={(e) => {
                        e.preventDefault();
                        dispatch(selectDiscount(e.target.value));
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Shipping Cost</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        e.preventDefault();
                        dispatch(selectShipping(e.target.value));
                      }}
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
        // onShow={onShow}
        // title="Please Wait.."
        // handleClose={handleClose}
        />
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
};

export default PurchaseCreateSearch;
