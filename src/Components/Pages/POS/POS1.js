import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { Button, Form, Modal } from "react-bootstrap";
import logo from "../../../logo.png";
import ProductSearch from "../../Common/ProductSearch/ProductSearch";
import PosCart from "./Parts/PosCart";
import PosFinalizes from "./Parts/PosFinalizes";
import PosFooter from "./Parts/PosFooter";
import PosHeader from "./Parts/PosHeader";
import "./POS.css";
import useProducts from "../../Hooks/useProducts";
import {
  addToDb,
  customQuantity,
  getStoredCart,
  removeFromDb,
  deleteShoppingCart,
  removeQuantity,
  addQuantity,
} from "../../Utility/facedb";
import useCarts from "../../Hooks/useCarts";
import PrintReceipt from "../../Common/PrintReceipt/PrintReceipt";
import toast, { Toaster } from "react-hot-toast";
import useSales from "../../Hooks/useSales";
import { Navigate, useNavigate } from "react-router-dom";
import { signInUser } from "../../Utility/Auth";
import { notify } from "../../Utility/Notify";
import { useForm } from "react-hook-form";
import * as Icons from "heroicons-react";
import useInventory from "../../Hooks/useInventory";
import axios from "../../../services/apiClient";
import AlertService from "../../Utility/AlertService";

const POS = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => notify("Bill Printed Successful!", "success"),
  });
  const [preLoadValue, setPreLoadValue] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const { register, handleSubmit, reset } = useForm({
    defaultValues: preLoadValue,
  });

  const [products, setProducts] = useProducts();
  const { carts, setCarts, updateCart, handleQuantityInput } = useCarts();
  const [searchResult, setSearchResult] = useState([]);
  const [lastInvoiceId, setLastInvoiceId] = useState("");
  const [sales, setSales] = useSales(carts);
  const [customer, setCustomer] = useState("Walk in Customer");

  const searchField = document.getElementById("productSearch");

  const user = signInUser();

  const { updateInventoryOut } = useInventory();

  const [show, setShow] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // console.log(show)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}customer`)
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);
  // console.log(customer)

  // UPDATE PRODUCTS TO ORDER
  useEffect(() => {
    if (carts) {
      // console.log(carts.length, sales.products.length)
      if (carts.length !== sales.products.length) sales.products = [];
      for (const index in carts) {
        sales.products[index] = {
          name: carts[index]?.name,
          article_code: carts[index]?.article_code,
          quantity: carts[index]?.quantity,
          vat: carts[index]?.vat,
          discount: carts[index]?.discount,
          tp: carts[index]?.cost,
          mrp: carts[index]?.price,
        };
      }
      setSales(sales);
    }
  }, [carts]);

  const handleProductOnChange = async (e) => {
    let cancelToken;
    const searchString = e.target.value;

    const match1 = searchString.match(/^[a-zA-Z0-9 ]*/);
    const match2 = searchString.match(/\s*/);
    if (match2[0] === searchString || searchString === "") {
      setSearchResult([]);
      return;
    }

    if (match1[0] === searchString && searchString) {
      console.log(searchString);

      if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel("Cancel The Previous Request");
      }

      cancelToken = axios.CancelToken.source();
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}search/${searchString}`,
        { cancelToken: cancelToken.token }
      );
      console.log(result.data.search);
      const search = result.data.search;
      // const result.data;
      // .then(data => {
      if (searchString !== "") {
        setSearchResult(search);
      } else {
        setSearchResult([]);
      }

      if (search < 0) {
        // e.target.value = '';
        notify("No Product Found", "error");
        console.log("No product Found", e.target.value);
        setSearchResult([]);
        return;
      } else {
        const getProduct =
          (await search?.find(
            ({ name }) => name !== "" && name?.toString() === searchString
          )) ||
          search?.find(
            ({ ean }) => ean !== "" && ean?.toString() === searchString
          ) ||
          search?.find(
            ({ article_code }) => article_code?.toString() === searchString
          );
        if (getProduct) {
          addToCart(getProduct.article_code);
          e.target.value = "";
          if (e.target.value) setSearchResult([]);
          return;
        }
      }
      if (searchString === "") {
        setSearchResult([]);
      }
      console.log(searchResult);
      // })
    } else {
      setSearchResult([]);
    }
    if (searchString === "") {
      setSearchResult([]);
    }
  };

  // POS Cart
  const addToCart = async (id) => {
    let cancelToken;
    let savedCart = [];
    let productIds = [];
    const cartDB = addToDb(id);

    if (cartDB) {
      const storedCart = getStoredCart();
      for (const key in storedCart) {
        productIds.push(`${key}`);
      }
      // console.log(productIds)
      if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel("Cancel The Previous Request");
      }

      cancelToken = axios.CancelToken.source();
      // get carts product
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}products`,
        { data: productIds },
        { cancelToken: cancelToken.token }
      );
      if (result) {
        console.log(result.data);
        const selectedProducts = result.data;
        for (const id in storedCart) {
          const addedProduct = selectedProducts.find(
            (product) => product.article_code.toString() === id
          );
          const quantity = parseFloat(storedCart[id]);
          if (addedProduct) {
            addedProduct.quantity = parseFloat(quantity);
          }
          savedCart.push(addedProduct);
        }
        setCarts(savedCart);
      }
      const searchField = document.getElementById("productSearch");
      searchField.value = "";
      searchField.focus();
      setSearchResult([]);
    }
  };

  const emptyCart = async () => {
    const confirmed = await AlertService.confirm("Refresh Cart?", "Start New Sale?");
    if (confirmed) {
      if (deleteShoppingCart()) {
        setCarts([]);
        // delete sales.paid_amount;
        // sales.paid_amount = []
        // setSales(sales)
      }
    } else {
      console.log("Refresh Operation Cancelled by POSER");
    }
  };

  const removeFromCart = (id) => {
    if (removeFromDb(id)) {
      updateCart(products);
    }
  };

  const addQuantities = (id) => {
    if (addQuantity(id)) {
      updateCart(products);
    }
  };

  const removeQuantities = (id) => {
    if (removeQuantity(id)) {
      updateCart(products);
    }
  };

  const handleCustomQty = (e) => {
    const qty = e.target.value !== null ? e.target.value : 1;
    const article_code = e.target.attributes.getNamedItem("id").value;
    const regex = /^[0-9]+\.?$/;
    const findDot = qty.match(regex);
    // console.log(findDot)

    // if(findDot){
    //     qty = `${qty}.00`;
    //     }
    console.log(qty, article_code);
    customQuantity(article_code, qty);
    updateCart();
  };

  // handlePrintBill
  const handlePrintBill = async (e) => {
    e.preventDefault();

    const confirmed = await AlertService.confirm("Are you sure?", "Print this bill?");
    if (confirmed) {
      notify(
        "Create Sale Successfully !, Bill will Printing within 5 sec. Check your POS printer",
        "success"
      );
    } else {
      notify("You Cancel the Bill", "error");
    }

    sales.customer_id = customer ? customer : "Walk in Customer";
    // console.log(sales);

    // updateInventoryOut(sales.products);
    // send data to the server
    if (sales.products.length > 0) {
      try {
        fetch(`${process.env.REACT_APP_API_URL}sale`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sales),
        })
          .then((res) => res.json())
          .then((data) => {
            delete sales.invoice_id;
            sales.invoice_id = data.insertedId;
            setLastInvoiceId(data.insertedId);

            deleteShoppingCart();
            updateCart();

            searchField.focus();
            // setSales(sales);
          });
      } catch (err) {
        notify(err, "error");
      } finally {
        if (lastInvoiceId) {
          // update inventory
          console.log("hi");
          // updateInventoryOut(sales.products);

          setTimeout(function () {
            // notify('Bill Printed Successful!', 'success');
            handlePrint();
          }, 2000);
          setSales({
            invoice_id: "",
            date: new Date(),
            ware_house: "TCM",
            status: "complete",
            products: [],
            return_products: [],
            paid_amount: {
              cash: 0,
              card: ["dbbl", 0],
              mfs: ["bkash", 0],
            },
            change_amount: 0,
            biller_id: user.name,
            customer_id: customer,
            royalty_point: 0,
            total_item: 0,
            total: 0,
            discount: 0,
            vat: 0,
            total_round: 0,
            sub_total: 0,
            total_received: 0,
          });
        }
      }
    } else {
      notify("You must add products for print the bill", "error");
      setSales({
        invoice_id: "",
        date: "",
        ware_house: "TCM",
        status: "complete",
        products: [],
        return_products: [],
        paid_amount: {
          cash: 0,
          card: ["dbbl", 0],
          mfs: ["bkash", 0],
        },
        change_amount: 0,
        biller_id: user.name,
        customer_id: customer,
        royalty_point: 0,
        total_item: 0,
        total: 0,
        discount: 0,
        vat: 0,
        total_round: 0,
        sub_total: 0,
        total_received: 0,
      });
      searchField.focus();
    }
  };
  // console.log(sales);

  const createNewCustomer = (customer) => {
    fetch(`${process.env.REACT_APP_API_URL}customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then((res) => res.json())
      .then((data) => {
        customer._id = data;
        notify(`Add Customer ${customer.name} - Successful!`, "success");
        // alert('Add customer Successfully !');
        reset({
          name: "",
          phone: "",
          address: "",
        });
        console.log(data);
        const newCustomer = [...customers, customer];
        setCustomers(newCustomer);
        setShow(false);
      });
  };

  return (
    <div className="pos-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <div className="pos-terminal mt-4">
              <div className="row">
                <div className="col-md-4">
                  {/* <Form.Select aria-label="Biller" name='biller'>
                                        <option defaultValue='biller_1'>Biller 1</option>
                                        <option value="biller_2">Biller 2</option>
                                        <option value="biller_3">Biller 3</option>
                                        <option value="biller_4">Biller 3</option>
                                    </Form.Select> */}
                  <Form.Control
                    value={user.name}
                    name="biller_id"
                    readOnly
                  ></Form.Control>
                </div>
                <div className="col-md-4">
                  <Form.Control
                    value="TCM"
                    name="warehouse"
                    readOnly
                  ></Form.Control>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => setCustomer(e.target.value)}
                    >
                      <option value="Walk in Customer">Walk in Customer</option>
                      {customers?.map((customer) => (
                        <option key={customer._id} value={customer.phone}>
                          {customer.name}-{customer.phone}
                        </option>
                      ))}
                    </Form.Select>

                    <button
                      type="button"
                      onClick={handleShow}
                      className="btn btn-outline-dark"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <ProductSearch
                  addToCart={addToCart}
                  searchResult={searchResult}
                  handleProductOnChange={handleProductOnChange}
                />
                <div className="col-md-12">
                  <table className="table mt-3">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Vat</th>
                        <th scope="col">Sub-Total</th>
                      </tr>
                    </thead>
                    <tbody className="cart-list">
                      <PosCart
                        updateCart={updateCart}
                        carts={carts}
                        removeFromCart={removeFromCart}
                        addQuantities={addQuantities}
                        removeQuantities={removeQuantities}
                        handleCustomQty={handleCustomQty}
                        sales={sales}
                        setSales={setSales}
                      ></PosCart>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <PosHeader logo={logo}></PosHeader>
            <PosFinalizes
              carts={carts}
              handlePrintBill={handlePrintBill}
              sales={sales}
              setSales={setSales}
            ></PosFinalizes>
          </div>
        </div>
      </div>
      <PosFooter emptyCart={emptyCart} handlePrint={handlePrint}></PosFooter>
      <PrintReceipt ref={componentRef} invoiceId={lastInvoiceId} />

      <Toaster position="bottom-right" />
      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit(createNewCustomer)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mb-3">
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputCustomer">Customer Name</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="form-control"
                  id="inputCustomer"
                  aria-describedby="emailHelp"
                  placeholder="Customer Name"
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputMC">Customer Phone</label>
                <input
                  {...register("phone")}
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Customer Phone"
                />
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="MCId">Address</label>
                <textarea
                  {...register("address")}
                  className="form-control"
                  id="address"
                  placeholder="Address"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="reset"
              className="btn btn-outline-dark"
              variant="outlineDark"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button variant="dark" type="submit" className="btn btn-dark ">
              <Icons.Plus> </Icons.Plus>Add Customer
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default POS;
