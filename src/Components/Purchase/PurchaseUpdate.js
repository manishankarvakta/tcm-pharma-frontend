import axios from "../../services/apiClient";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectCalculation,
  selectDiscount,
  selectNote,
  selectPo,
  selectProducts,
  selectShipping,
  selectStatus,
  selectSupplier,
  selectTax,
  selectUser,
  selectWareHouse,
} from "../../features/purchaseSlice";
import {
  usePurchaseSupplierQuery,
  useUpdatePurchasePMutation,
} from "../../services/purchasApi";
import CsvPurchaseProduct from "../Common/CsvImporter/CsvPurchaseProduct";
import SelectSupplierPurchaseUpdate from "../Common/CustomSelect/SelectSupplierPurchaseUpdate";
import WareHouseDWPurchaseUpdate from "../Common/CustomSelect/WareHouseDWPurchaseUpdate";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import usePurchaseCarts from "../Hooks/usePurchaseCarts";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { total } from "../Utility/PurchaseCalculations";
import PurchaseCart from "./parts/PurchaseCart";
import SupplierProduct from "./parts/SupplierProduct";
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

const PurchaseUpdate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // console.log("purchaseId", id);
  const [updatePurchase] = useUpdatePurchasePMutation();

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    usePurchaseSupplierQuery(`${id}`);
  console.log("data", data);
  const purchaseData = useSelector((state) => state.purchaseReducer);
  console.log("purchaseData", purchaseData);
  const [productList, setProductList] = useState([]);
  const [selectedProductList, setSelectedProductList] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState(productList);
  const [csvData, setCsvData] = useState([]);
  const { register, handleSubmit, isSubmitSuccessful, reset } = useForm();
  // console.log("filteredProduct", filteredProduct);
  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);
  const user = signInUser();

  const [wh, setWh] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [q, setQ] = useState("");
  const [purchaseView, setPurchaseView] = useState([]);

  const {
    purchaseCarts,
    setPurchaseCarts,
    updatePurchaseCart,
    handleQuantityInput,
  } = usePurchaseCarts();

  useEffect(() => {
    if (data) {
      setWh(data?.warehouse?._id);
      setSupplierId(data.supplier._id);
      dispatch(selectPo(data?.poNo));
      dispatch(selectWareHouse(data?.warehouse?._id));
      dispatch(selectSupplier(data?.supplier?._id));
      dispatch(selectStatus(data?.status));
      dispatch(selectProducts(data?.products ? data?.products : []));
      dispatch(
        selectShipping(data?.shipping_cost > 0 ? data?.shipping_cost : 0)
      );
      dispatch(selectDiscount(data?.discount > 0 ? data?.discount : 0));
      dispatch(selectTax(data?.tax > 0 ? data?.tax : 0));
      dispatch(selectNote(data?.note ? data?.note : ""));
      setSupplierProducts(data?.supplier?.products);
    }
  }, [data]);

  // console.log("supplier", supplierProducts);
  const emptyCart = async () => {
    const confirmed = await AlertService.confirm("Refresh Cart?", "Start New Purchase?");
    if (confirmed) {
      dispatch(selectProducts([]));
    } else {
      console.log("Refresh Operation Cancelled by POSER");
    }
  };

  // const handleSupplierProduct = async (id) => {
  //     const result = await axios.get(`${BASE_URL}/supplier/${id}`);
  //     console.log(result)
  //     console.log("supplier", result?.data);
  //     setSupplierProducts(result?.data?.products)
  //     // dispatch(selectSupplier(result?.data._id));
  //     dispatch(selectProducts([]));
  // }
  // useEffect(() => {
  //     if (data) {
  //         handleSupplierProduct(data?.supplier?._id)
  //     }

  // }, [data])
  useEffect(() => {
    setOnShow(true);
    if (data) {
      setOnShow(false);
    }
  }, [data]);
  useEffect(() => {
    if (data?.supplier?.products?.length > 0) {
      const productsmap = data?.supplier?.products;

      setProductList(productsmap);
    }
  }, [data?.supplier]);

  useEffect(() => {
    // ORDER SELECTED PRODUCT
    // console.log(purchaseData.products);
    if (purchaseData?.products?.length > 0) {
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
      setSelectedProductList(orderdList);
    }
  }, [purchaseData.products]);

  const handleSearch = (q) => {
    console.log("supplierProducts", productList);
    console.log("q", q);
    if (q.length > 0) {
      const re = new RegExp(q, "i");
      const filtered = productList.filter((entry) =>
        Object.values(entry).some(
          (val) => typeof val === "string" && val.match(re)
        )
      );

      setFilteredProduct(filtered);
      console.log("Original:", productList);
      console.log("filter:", filtered);
    } else {
      setFilteredProduct(productList);
    }
  };
  const localStorageAddFromCart = (items) => {
    console.log("items", items);
    const priceList = items?.id?.priceList;
    const activePriceList =
      priceList?.filter((pr) => pr?.status === "active") || [];
    console.log("activePriceList", activePriceList);
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
        notify("Product is already added", "error");
      } else {
        console.log("not matched");
        notify("Product is added", "success");
        console.log("activePriceList", activePriceList);
        const maxDate = activePriceList?.reduce((max, item) => {
          const date = new Date(item?.updatedAt);
          return date > max ? date : max;
        }, new Date("1900-01-01T00:00:00.000Z"));
        // console.log("maxDate", maxDate?.toISOString());
        const maxinUpdatedAt = maxDate?.toISOString();
        const latestPrice = activePriceList?.find(
          (price) => price?.updatedAt === maxinUpdatedAt
        );
        console.log("latestPrice", latestPrice);
        list = [
          ...rest,
          {
            id: items?.id._id,
            article_code: items?.id?.article_code,
            priceId: latestPrice?._id,
            qty: 1,
            tp: items?.tp,
            tax: 0,
            discount: 0,
            unit: getUnit(items?.unit),
            name: items?.name,
            order: purchaseData?.products?.length + 1,
          },
        ];
      }
    } else {
      // console.log(items.id);
      const maxDate = activePriceList.reduce((max, item) => {
        const date = new Date(item.updatedAt);
        return date > max ? date : max;
      }, new Date("1900-01-01T00:00:00.000Z"));
      console.log("maxDate", maxDate.toISOString());
      // const maxinUpdatedAt = maxDate.toISOString()
      const latestPrice = activePriceList.find(
        (price) => price.updatedAt === maxDate.toISOString()
      );
      //   console.log("latestPrice", latestPrice);

      list = [
        {
          id: items?.id?._id,
          article_code: items?.id?.article_code,
          priceId: latestPrice?._id,
          qty: 1,
          tp: latestPrice?.tp,
          tax: 0,
          discount: 0,
          unit: getUnit(items?.unit),
          name: items?.name,
          order: 1,
        },
      ];
    }
    console.log("list", list);

    dispatch(selectProducts(list));
    // let localData = JSON.parse(localStorage.getItem("purchase_cart"));
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
  const removeFromCart = (code) => {
    const rest = purchaseData.products.filter(
      (pro) => pro.article_code !== code
    );
    notify("Product is removed", "error");
    // console.log(code);
    dispatch(selectProducts(rest));
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
            const purchaseProducts = purchaseData.products;
            // console.log(importProducts);
            const newP = [...importProducts, ...purchaseProducts];
            dispatch(selectProducts(newP));
          }
        }
      });
    } else {
      setOnShow(false);
      notify("There is no products to import", "error");
    }
    console.log(importProducts);
  };

  // console.log(purchaseData, id);
  // UPDATE PURCHASE
  const handleBillUpdateSubmit = async () => {
    const updatePurchaseData = { ...purchaseData, _id: id };
    // console.log("updatePurchaseData", updatePurchaseData);

    await updatePurchase(updatePurchaseData)
      .then((res) => {
        // console.log("updateResponse", res);
        notify("Purchase Order is Updated", "success");
        navigate(`/purchase`);
      })
      .catch((err) => {
        console.log(err);
        notify("Purchase Order is Update Cancel", "error");
      });
  };
  // console.log("wh", wh)
  // console.log("wh", supplierProducts);
  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mt-2">
            <Header title="Update Purchase"></Header>

            <Form className="pt-3">
              <div className="row">
                <div className="col-6">
                  {/* <input type="hidden" {...register("_id")} /> */}
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    <WareHouseDWPurchaseUpdate
                      id="warehouse"
                      name="warehouse"
                      wh={wh !== "" ? wh : 0}
                      {...register("warehouse")}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group className="">
                    <Form.Label>Supplier</Form.Label>
                    <SelectSupplierPurchaseUpdate
                      supplier_code={supplierId}
                      {...register("supplier_code", { required: true })}
                    ></SelectSupplierPurchaseUpdate>
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
                            />
                          </div>
                        </div>
                        {filteredProduct?.length > 0 ? (
                          <Table
                            className="mt-3 table-responsive"
                            style={{
                              overflowY: "scroll",
                              display: "block",
                              height: "200px",
                            }}
                          >
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
                                localStorageAddFromCart={
                                  localStorageAddFromCart
                                }
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
                        ) : (
                          <Table
                            className="mt-3 table-responsive"
                          // style={{
                          //   overflowY: "scroll",
                          //   display: "block",
                          //   height: "200px",
                          // }}
                          >
                            <thead>
                              <tr>
                                {/* <th>#</th> */}
                                <th>Code</th>
                                <th>Name</th>
                                <th>Stock</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <SupplierProduct
                                updatePurchaseCart={updatePurchaseCart}
                                productList={productList}
                                localStorageAddFromCart={
                                  localStorageAddFromCart
                                }
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
                        )}
                      </div>
                    </div>
                    <div className="col-7">
                      <div className="card">
                        <div className="card-header">
                          Purchase Products List
                        </div>
                        <Table
                          className="mt-3 table-responsive"
                          style={{
                            overflowY: "scroll",
                            display: "block",
                            height: "300px",
                          }}
                        >
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
                              // {...setValue("products", product)}
                              updatePurchaseCart={updatePurchaseCart}
                              purchaseCarts={selectedProductList}
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
                      defaultValue={purchaseData.discount}
                      value={purchaseData.discount}
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
                      defaultValue={purchaseData.shipping_cost}
                      value={purchaseData.shipping_cost}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-12 mb-2">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Note</Form.Label>
                    <textarea
                      defaultValue={purchaseData.note}
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
                onClick={handleBillUpdateSubmit}
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
        {/* <LoadingModal
                    onShow={onShow}
                    title="Please Wait.."
                    handleClose={handleClose}
                /> */}
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
};

export default PurchaseUpdate;
