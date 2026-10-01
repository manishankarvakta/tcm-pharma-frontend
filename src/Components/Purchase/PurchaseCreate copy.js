import React, { useEffect, useState } from "react";
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
import SupplierProduct from "./parts/SupplierProduct";
import { total, toDecimal } from "../Utility/PurchaseCalculations";
import { useNavigate } from "react-router-dom";
import { useAddPurchaseMutation } from "../../services/purchasApi";
import { apiUniqueErrHandle } from "../Utility/Utility";

const PurchaseCreate = () => {
  let navigate = useNavigate();
  const [addPurchase] = useAddPurchaseMutation();
  const [purchaseView, setPurchaseView] = useState([]);
  // Supplier Info
  const [supplier, setSupplier] = useState([]);
  // supplier Product
  const [productList, setProductList] = useState([]);
  const { register, handleSubmit, isSubmitSuccessful, reset, setValue } =
    useForm();

  const [supplierProductId, setSupplierProductId] = useState("");
  const [isFull, setIsFull] = useState(false);
  const purchaseCart = JSON.parse(localStorage.getItem("purchase_cart"));

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const {
    purchaseCarts,
    setPurchaseCarts,
    updatePurchaseCart,
    handleQuantityInput,
  } = usePurchaseCarts();
  const [calcTotal, setCalcTotal] = useState([]);
  const user = signInUser();
  const { totalItems, purchase, setPurchase } = usePurchase();
  const { updateInventoryIn, inventory, setInventory } = useInventory();
  const [wh, setWh] = useState("");
  // console.log("purchaseCart", purchaseCart);

  // SELECT SUPPLIER
  const handleVendorChange = async (value) => {
    const supplierId = value.option;
    setSupplierProductId(value.option);

    const result = await axios.get(`${BASE_URL}/supplier/${supplierId}`);
    // setPurchase({ value.option });
    console.log(result.data);
    setSupplier(result.data);
    setProductList(result.data.products);
    localStorage.setItem("purchase_cart", JSON.stringify([]));
    reset({
      supplier: value.option,
      userId: user.id,
    });
  };

  // console.log("supplier", supplier);

  const product = {
    products: purchaseCart?.map((item) => ({
      id: item.id,
      tp: item.tp,
      tax: item.tax,
      qty: item.qty,
      unit: item.unit,
      mrp: item.mrp,
      discount: item.discount,
      order: item.order,
    })),
  };
  // console.log(product);

  const handleBillSubmit = async (data) => {
    console.log(data);
    let newPurchase = data;
    newPurchase = { ...newPurchase, products: purchaseCart };
    const response = await addPurchase(newPurchase);

    if (response) {
      console.log(response);
      if (response?.error) {
        apiUniqueErrHandle(response);
      } else {
        reset({
          supplier: "",
          warehouse: "",
          products: [],
          type: "",
          note: "",
          doc: null,
          totalItem: "",
          total: "",
          discount: "",
          tax: "",
          userId: "",
          status: "",
        });
        console.log(response?.data?.message);
        localStorage.removeItem("purchase_cart");
        return navigate("/purchase");
      }
    }
  };
  // console.log(data);

  // console.log(supplier);
  const handleOnchangeWareHouse = (e) => {
    setWh(e.option);
    // reset({
    //   warehouse: e.option,
    // });
  };

  useEffect(
    (purchaseCarts) => {
      // if (purchaseCart) {
      // const newPurchaseCart = purchaseCart?.sort((a, b) => a.order - b.order);
      setPurchaseView(purchaseCarts);
      // }
    },
    [purchaseCarts]
  );

  useEffect(() => {
    setCalcTotal(total(purchaseCarts));
    setPurchaseView(purchaseCarts);
    // const [tot]
  }, [purchaseCarts]);

  // POS Cart

  const emptyCart = () => {
    if (window.confirm("Refresh Cart! Start New Purchase?") === true) {
      if (deletepurchaseCart()) {
        setPurchaseCarts([]);
        deletepurchaseCart();

        // delete sales.paid_amount;
        // sales.paid_amount = []
        // setSales(sales)
      }
    } else {
      console.log("Refresh Operation Cancelled by POSER");
    }
  };

  // console.log(purchaseCart);

  const localStorageAddFromCart = async (items) => {
    console.log("item", items);

    let localData = JSON.parse(localStorage.getItem("purchase_cart"));
    let newCart = [];
    console.log("purchase Cart", localData);
    // lastPrice.then((result) => {
    //   console.log(result.data);
    // });
    // if (lastPrice.status === 200) {
    if (localData?.length > 0) {
      // let selectedProduct = localData?.find((cartItem) => cartItem.article_code === items.article_code);
      let rest = localData?.filter(
        (cartItem) => cartItem.article_code !== items.article_code
      );
      newCart = [
        ...rest,
        {
          ...items,
          mrp: items.mrp,
          qty: 1,
          tp: items.tp,
          tax: 0,
          discount: 0,
        },
      ];
      localStorage.setItem("purchase_cart", JSON.stringify(newCart));
    } else {
      newCart = [
        {
          ...items,
          mrp: items.mrp,
          qty: 1,
          tp: items.tp,
          tax: 0,
          discount: 0,
        },
      ];
      localStorage.setItem("purchase_cart", JSON.stringify(newCart));
    }
    // }
  };

  // if (removeFromDb(id)) {
  //   updatePurchaseCart();
  // }
  // };

  const addQuantities = (id) => {
    if (addQuantity(id)) {
      updatePurchaseCart();
    }
  };

  const removeQuantities = (id) => {
    if (removeQuantity(id)) {
      updatePurchaseCart();
    }
  };

  const handleCustomQty = (e, id) => {
    const customQty = e.target.value !== "" ? e.target.value : 0;
    console.log(customQty, id);
    const cartItems = getStoredCart();
    const item = cartItems.find((item) => item.article_code === id);
    if (item) {
      let restItem = cartItems.filter((item) => item.article_code !== id);
      if (customQty >= 0) {
        item.qty = customQty;

        restItem.push(item);
        localStorage.setItem("purchase_cart", JSON.stringify(restItem));
        updatePurchaseCart();
      }
    }
  };

  const handleCustomTax = (e, id) => {
    const tax = e.target.value !== "" ? e.target.value : 0;
    // console.log(tax, id);
    const cartItems = getStoredCart();
    const item = cartItems.find((item) => item.article_code === id);
    if (item) {
      let restItem = cartItems.filter((item) => item.article_code !== id);
      if (tax >= 0) {
        item.tax = tax;

        restItem.push(item);
        localStorage.setItem("purchase_cart", JSON.stringify(restItem));
        updatePurchaseCart();
      }
    }
  };

  const handleCustomTp = (e, id) => {
    const tp = e.target.value !== "" ? e.target.value : 0;
    console.log("TP", tp, id);
    const cartItems = getStoredCart();
    const item = cartItems.find((item) => item.article_code === id);
    if (item) {
      let restItem = cartItems.filter((item) => item.article_code !== id);
      if (tp >= 0) {
        item.tp = tp;

        restItem.push(item);
        localStorage.setItem("purchase_cart", JSON.stringify(restItem));
        updatePurchaseCart();
      }
    }
  };

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));
  // useEffect(() => {
  //   reset({
  //     userId: loggedInUser.id,
  //   });
  // }, [loggedInUser]);

  // const handleSelectAllProducts = (products) => {
  //   setPurchaseView([]);
  //   setPurchaseView(products);
  //   setIsFull(true);
  // };
  // const handleDeselectAllProducts = (products) => {
  //   setPurchaseView([]);
  //   setIsFull(false);
  // };

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mt-2">
            <Header title="Create New Purchase"></Header>

            <Form onSubmit={handleSubmit(handleBillSubmit)} className="pt-3">
              <div className="row">
                <div className="col-6">
                  {/* <input type="hidden" {...register("_id")} /> */}
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    <WareHouseDWPurchase
                      {...setValue("warehouse", `${wh}`)}
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
                      supplier_code={purchase.supplier_code}
                      setPurchase={setPurchase}
                      handleOnchange={handleVendorChange}
                      {...setValue("supplier", `${supplierProductId}`)}
                      // {...register("supplier_code", { required: true })}
                    ></SelectSupplier>
                  </Form.Group>
                </div>
                <div className="col-6 mb-2">
                  <Form.Group className="">
                    <Form.Label>Purchase Status</Form.Label>
                    <Form.Select {...register("status")}>
                      <option value="Pending">Pending</option>
                      <option value="Ordered">Ordered</option>
                      <option value="Received">Received</option>
                      <option value="Canceled">Canceled</option>
                    </Form.Select>
                  </Form.Group>
                </div>
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
                        <Table className="mt-3">
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
                              localStorageAddFromCart={localStorageAddFromCart}
                              addQuantities={addQuantities}
                              removeQuantities={removeQuantities}
                              handleCustomQty={handleCustomQty}
                              handleCustomTax={handleCustomTax}
                              handleCustomTp={handleCustomTp}
                              setPurchaseCarts={setPurchaseCarts}
                            ></SupplierProduct>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                    <div className="col-7">
                      <div className="card">
                        <Table className="mt-3 ">
                          <thead>
                            <tr>
                              <th>#</th>
                              {/* <th>Code</th> */}
                              <th>Name</th>
                              <th>Tax</th>
                              <th>Quantity</th>
                              <th>TP</th>
                              <th>Tax</th>
                              <th>Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            <PurchaseCart
                              {...setValue("products", product)}
                              updatePurchaseCart={updatePurchaseCart}
                              purchaseCarts={purchaseCarts}
                              // localStorageAddFromCart={localStorageAddFromCart}
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
                <div className="row">
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
                        {...register("discount")}
                        type="text"
                        className="discount"
                        placeholder="Discount"
                        onChange={(e) =>
                          setPurchase({
                            ...purchase,
                            discount: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group className="" controlId="formBasicEmail">
                      <Form.Label>Shipping Cost</Form.Label>
                      <Form.Control
                        {...register("shipping_cost")}
                        onChange={(e) =>
                          setPurchase({
                            ...purchase,
                            shipping: e.target.value,
                          })
                        }
                        type="text"
                        className="shipping"
                        placeholder="Shipping Cost"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-12">
                    <Form.Group className="" controlId="formBasicEmail">
                      <Form.Label>Note</Form.Label>
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Note"
                        {...register("note")}
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>

              <Button variant="dark" className="float-end my-2" type="submit">
                Submit
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
                    <th {...setValue("totalItem", purchaseCarts?.length)}>
                      Items: {purchaseCarts?.length}
                    </th>
                    <th>Total Tax: {calcTotal[0]?.toFixed(2)}</th>
                    <th>Order Total: {calcTotal[1]?.toFixed(2)}</th>
                    <th>Order Discount: {purchase.discount}</th>
                    <th>Shipping Cost: {purchase.shipping}</th>
                    <th
                      {...setValue(
                        "total",
                        calcTotal[0] +
                          calcTotal[1] +
                          Number(purchase?.shipping) -
                          purchase?.discount
                      )?.toFixed(2)}
                    >
                      Grand Total:{" "}
                      {(
                        calcTotal[0] +
                        calcTotal[1] +
                        Number(purchase?.shipping) -
                        purchase?.discount
                      )?.toFixed(2)}
                    </th>
                  </tr>
                </thead>
              </Table>
            </Form>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
};

export default PurchaseCreate;
