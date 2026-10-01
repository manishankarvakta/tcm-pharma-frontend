import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
// import useCarts from "../Hooks/useCarts";
import axios from "../../services/apiClient";
import { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  usePurchaseQuery,
  useUpdatePurchaseMutation,
} from "../../services/purchasApi";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import WareHouseDWPurchase from "../Common/CustomSelect/WareHouseDWPurchase";
import useInventory from "../Hooks/useInventory";
import usePurchase from "../Hooks/usePurchase";
import usePurchaseCarts from "../Hooks/usePurchaseCarts";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { total } from "../Utility/PurchaseCalculations";
import {
  addQuantity,
  deletepurchaseCart,
  getStoredCart,
  removeQuantity,
} from "../Utility/purchaseDb";
import PurchaseCart from "./parts/PurchaseCart";
import SupplierProduct from "./parts/SupplierProduct";

const UpdatePurchase = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [updatePurchase] = useUpdatePurchaseMutation();
  const purchaseData = usePurchaseQuery(`${id}`);
  const [purchaseUpdateData, setPurchaseUpdateData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [supplierProductId, setSupplierProductId] = useState("");
  const [purchaseView, setPurchaseView] = useState([]);
  const { register, handleSubmit, isSubmitSuccessful, reset, setValue } =
    useForm({});

  //   useEffect(() => {
  //     if (data) {
  //         setPurchaseData(data)

  //     }
  // }, [data]);

  useEffect(() => {
    purchaseData?.isSuccess
      ? setPurchaseUpdateData(purchaseData.data)
      : setPurchaseUpdateData([]);
  }, [purchaseData]);

  useEffect(() => {
    if (purchaseUpdateData.data) {
      reset({
        poNo: purchaseUpdateData.data.poNo,
        supplier: purchaseUpdateData.data.supplier._id,
        warehouse: purchaseUpdateData.data.warehouse._id,
        products: [],
        type: purchaseUpdateData.data.type,
        note: purchaseUpdateData.data.note,
        doc: null,
        totalItem: purchaseUpdateData.data.totalItem,
        total: purchaseUpdateData.data.total,
        discount: purchaseUpdateData.data.discount,
        tax: purchaseUpdateData.data.tax,
        userId: purchaseUpdateData.data.userId._id,
        status: purchaseUpdateData.data.status,
      });
    }
  }, [purchaseUpdateData.data]);

  console.log(purchaseUpdateData.data);

  const updateHandler = async (data) => {
    const response = await updatePurchase(data);
    console.log(data);
    if (response) {
      console.log(response);
      notify("User Update Successful!");
      navigate("/purchase");
      localStorage.removeItem("purchase_cart");
    }
  };

  const handleVendorChange = async (value) => {
    setSupplierProductId(value.option);

    const result = await axios.get(`${BASE_URL}/supplier/${value.option}`);
    // setPurchase({ value.option });
    console.log(result.data);
    setProductList(result.data.products);
    reset({
      supplier: value.option,
    });
  };

  const handleOnchangeWareHouse = (e) => {
    setWh(e.option);
    reset({
      warehouse: e.option,
    });
  };

  const purchaseCart = JSON.parse(localStorage.getItem("purchase_cart"));

  useEffect(() => {
    if (purchaseCart) {
      const newPurchaseCart = purchaseCart?.sort((a, b) => a.order - b.order);
      setPurchaseView(newPurchaseCart);
    }
  }, [purchaseCart]);

  useEffect(() => {
    const productCart = JSON.parse(localStorage.getItem("purchase_cart"));
    reset({
      products: productCart,
    });
  }, [reset]);

  // const [products, setProducts] = useProducts();
  // const { carts, setCarts, updatePurchaseCart, handleQuantityInput } = useCarts([]);
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
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    setCalcTotal(total(purchaseCarts));
    // const [tot]
  }, [purchaseCarts]);

  const emptyCart = async () => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Refresh Cart! Start New Purchase?");
    if (confirmed) {
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

  // console.log(purchaseView)

  const localStorageAddFromCart = (items) => {
    console.log("items", items);
    let localData = JSON.parse(localStorage.getItem("purchase_cart"));
    let newCart = [];
    console.log(localData);
    if (localData?.length > 0) {
      // let selectedProduct = localData?.find((cartItem) => cartItem.article_code === items.article_code);
      let rest = localData?.filter(
        (cartItem) => cartItem.article_code !== items.article_code
      );
      newCart = [
        ...rest,
        {
          ...items,
          mrp: 0,
          qty: 0,
          tp: 0,
          tax: 0,
          discount: 0,
        },
      ];
      localStorage.setItem("purchase_cart", JSON.stringify(newCart));
    } else {
      newCart = [
        {
          ...items,
          mrp: 0,
          qty: 0,
          tp: 0,
          tax: 0,
          discount: 0,
        },
      ];
      localStorage.setItem("purchase_cart", JSON.stringify(newCart));
    }

    // if (removeFromDb(id)) {
    // updatePurchaseCart();
    // }
  };

  // useEffect(() => {
  //   const purchaseCart = getStoredCart();
  //   setPurchaseCarts(newPurchaseCart);
  // }, []);
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
    console.log(tax, id);
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
    console.log(tp, id);
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

  const loggedInUser = signInUser();
  useEffect(() => {
    reset({
      userId: loggedInUser.id,
    });
  }, [loggedInUser]);
  return (
    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mt-2">
            <Header title="Create New Purchase"></Header>

            <Form onSubmit={handleSubmit(updateHandler)} className="pt-3">
              <div className="row">
                <div className="col-6">
                  {/* <input type="hidden" {...register("_id")} /> */}
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    <WareHouseDWPurchase
                      id="warehouse"
                      name="warehouse"
                      handleOnChange={handleOnchangeWareHouse}
                      {...setValue("warehouse", `${wh}`)}
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
                              // handleCustomQty={handleCustomQty}
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
                              {...setValue("products", purchaseCart)}
                              {...setValue("poNo", "453434")}
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
    </>
  );
};

export default UpdatePurchase;
