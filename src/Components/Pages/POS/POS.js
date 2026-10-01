import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
// import { BsArchive, BsCheckSquare, BsSquare } from "react-icons/bs";

import { Button, Form, Modal } from "react-bootstrap";
import logo from "../../../pharmacy-logo.png";
import logo2 from "../../../tcmlogo1.jpg";

import {
  addQuantity,
  addToDb,
  customItemDiscount,
  customNoOfBox,
  customQuantity,
  customSoldInBox,
  deleteLastProduct,
  deleteShoppingCart,
  getStoredCart,
  removeFromDb,
  removeQuantity,
} from "../../Utility/cartDB";
import sendMessage from "../../Utility/smsSystem";
import PosCart from "./Parts/PosCart";
import PosFinalizes from "./Parts/PosFinalizes";
import PosFooter from "./Parts/PosFooter";
import PosHeader from "./Parts/PosHeader";
import "./POS.css";
import "../../Common/PrintReceipt/PrintReceipt.css";
import AlertService from "../../Utility/AlertService";

import { Toaster } from "react-hot-toast";
import { posFinalizer } from "../../Utility/PosCalculations";
// import useSales from "../../Hooks/useSales";
import * as Icons from "heroicons-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../Utility/Auth";
import { notify } from "../../Utility/Notify";
// import useInventory from "../../Hooks/useInventory";
import { v4 as uuidv4 } from "uuid";
import {
  saleFinalize,
  saleNewPoint,
  saleReset,
  salesPromoPrice,
  selcetBiller,
  selcetCustomer,
  selcetProductsCart,
  selectInvoiceId,
} from "../../../features/posSlice";
import PosSearchProduct from "../../Common/CustomSelect/PosSearchProduct";
import SelectCustomer from "../../Common/CustomSelect/selectCustomer";

import { itemPrice } from "../../Utility/PosCalculations";

// import { useValidUserMutation } from "../../../services/userApi";
// import { dispatch } from "react-hot-toast/dist/core/store";
import { useDispatch, useSelector } from "react-redux";
import useKeypress from "react-use-keypress";
import {
  useAddCustomerMutation,
  // useUpdateCustomerMutation,
  useUpdatePointCustomerMutation,
} from "../../../services/customerApi";
import {
  useAddSaleMutation,
  useSaleCountQuery,
  useLastSaleQuery,
} from "../../../services/saleApi";
import { useGroupListQuery } from "../../../services/groupApi";
// import Barcode from "react-barcode";
import { format } from "date-fns";
import {
  // itemVat,
  itemVatTotal,
} from "../../Utility/PosCalculations";
// import {
//   getNewPoint,
//   totalPoint,
//   remaningPoint,
// } from "../../Utility/customerPointCalculations";
// import axios from "../../../services/apiClient";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { saleVoidReset } from "../../../features/voidSlice";
import { useWarehouseQuery } from "../../../services/warehouseApi";
import GenericSearchModal from "../../Common/Modal/GenericSearchModal";
import PackageModal from "../../Common/Modal/PackageModal";
import ReturnModal from "../../Common/Modal/ReturnModal";
import VoidReturnModal from "../../Common/Modal/VoidReturnModal";
import CreateCustomerForm from "../../Customer/CreateCustomerForm";

const POS = () => {
  // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // let i = 1;

  /**
   * ===============================
   * NEW CODE FOR POS SCREEN
   * ===============================
   */

  /**
   * Constants
   * get pos data from redux stroge
   *
   */
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5006/api";
  const posSaleData = useSelector((state) => state.posReducer);
  const changeAmountRef = useRef(0);
  const [discountChecked, setDiscountChecked] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [isbill, setBill] = useState(false);
  const isBillRef = useRef(false);
  const [customerPoint, setCustomerPoint] = useState(0);
  const [holdSale, setHoldSale] = useState(false);

  const [show, setShow] = useState(false);
  const [returnShow, setReturnShow] = useState(false);
  const [voidReturnShow, setVoidReturnShow] = useState(false);
  const [showPermission, setShowPermission] = useState({
    show: false,
    type: "",
    data: "",
  });
  const [manager, setManager] = useState();
  const [pass, setPass] = useState();
  const customerUniqeId = uuidv4();
  const [loading, setLoading] = useState(true);

  const [showAddressFields, setShowAddressFields] = useState(false);
  const toggleAddressFields = () => {
    setShowAddressFields((prev) => !prev);
  };
  // console.log(posSaleData);
  const [group, setGroup] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  const [changeAmountModal, setChangeAmountModal] = useState(false);
  const [lastChangeAmount, setLastChangeAmount] = useState(0);

  const [genericSearchShow, setGenericSearchShow] = useState(false);
  const handleGenericSearchClose = () => setGenericSearchShow(false);

  const handleVoidReturnClose = () => setVoidReturnShow(false);
  // const { updateInventoryOut } = useInventory();

  const [whName, setWhName] = useState(" ");
  const user = signInUser();
  const { aamarId, storeSettings, warehouse } = user;
  // console.log("data", user);
  const { data: wh, refetch, isFetching } = useWarehouseQuery(user?.warehouse);
  const { data: countData } = useSaleCountQuery({ aamarId });
  const { data: groupList } = useGroupListQuery(aamarId);

  useEffect(() => {
    if (groupList?.length > 0 && !group) {
      setGroup(groupList[0]._id);
    }
  }, [groupList, group]);

  useEffect(() => {
    if (posSaleData?.warehouse) {
      refetch();
    }
  }, [posSaleData?.warehouse, refetch]);
  useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);
  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  // console.log('warehouse',wh)

  // UPDATE STATE
  const updateCartState = () => {
    // GET POS CART (New Products)[LocalStorage]
    let cartProduct = getStoredCart();

    // DISPATCH POS CART PRODUCT
    dispatch(selcetProductsCart(cartProduct));

    // GET RETURN CART (Return Product)[REDUX Storege]
    let ReturnProduct = posSaleData.returnProducts;

    // POS FINALIZER POS CART
    const posCartCal = posFinalizer(cartProduct, "cartProduct");

    // {
    //   totalItem,
    //   total,
    //   vatAmount,
    //   grossTotal,
    //   grossTotalRound,
    //   newPoint,
    // }

    // POS FINALIZER RETURN CART
    const returnCartCal = posFinalizer(ReturnProduct, "ReturnCartProduct");
    // console.log("cart Cal:", posCartCal);
    // console.log("return Cal:", returnCartCal);

    // DISPATCH TO REDUX Storege
    dispatch(
      saleFinalize({
        totalItem: posCartCal.totalItem,
        total: posCartCal.total?.toFixed(2), // - posSaleData.returnCal.total,
        vatAmount: posCartCal.vatAmount?.toFixed(2), // - posSaleData.returnCal.vatAmount,
        grossTotal: parseFloat(
          posCartCal.grossTotal - returnCartCal.total
        )?.toFixed(2),
        grossTotalRound: Math.round(
          posCartCal.grossTotal - returnCartCal.total
        ),
        newPoint:
          posSaleData.point.old ||
          0 + Number(posCartCal.newPoint) - Number(returnCartCal.newPoint),
        // Return Calculatoin
        reTotal: returnCartCal.total,
        reTotalItem: parseInt(returnCartCal.totalItem),
        reGrossTotal: returnCartCal.grossTotal?.toFixed(2),
        reGrossTotalRound: Math.round(returnCartCal.grossTotal),
        rePoint: returnCartCal.newPoint,
        reVat: returnCartCal.vatAmount,
        promo_discount: posCartCal.promoPrice,
      })
    );
    dispatch(salesPromoPrice(posCartCal.promoPrice));

    // let returnProduct = getStoredCart();
    // console.log(Number(posCartCal.newPoint) - Number(returnCartCal.newPoint));

    // console.log(posFinalizer(cartProduct, "cartProduct"));
    return true;
  };
  /**
   * Set Biller info
   * ===============================
   */

  useEffect(() => {
    updateCartState();
    dispatch(selcetBiller(user.id));
  }, []);

  /**
   * ADD TO CART
   * add product cart Local storage
   */
  const carts = useSelector((state) => state.posReducer.products);
  useLayoutEffect(() => {
    if (firstProductRef.current) {
      firstProductRef.current.focus();
    }
  }, [carts?.length]);

  const addToList = async (data) => {
    if (data) {
      // console.log("add to list:", data, data.priceList);
      await supplierProductsRef.current.blur();

      // ADD TO DB
      if (data?.length > 0) {
        const add = addToDb(data[0]);
        // console.log("add to list:", add, data);
        if (add) {
          const update = updateCartState();
          // console.log("update:", update);
          if (update === true) {
            firstProductRef?.current?.focus();
          }
          return true;
        }
      } else {
        const add = addToDb(data);
        // console.log("add to list:", add, data);
        if (add) {
          const update = updateCartState();
          // console.log("update:", update);
          if (update === true) {
            firstProductRef?.current?.focus();
          }
          return true;
        }
      }
    }
  };

  /**
   * Empty Local Cart
   */
  const emptyCart = () => {
    // console.log("empty cart");
    if (deleteShoppingCart()) {
      updateCartState();
      saleReset();
      notify("Refresh POS SALE", "success");
    }
    // setShowPermission({
    //   ...showPermission,
    //   type: "refresh",
    //   show: false,
    //   data: "",
    // });
    //   if (window.confirm("Refresh Cart! Start New Sale?") === true) {
    //     const deleted = deleteShoppingCart();
    //     if (deleted) {
    //       updateCartState();
    //       notify("Refresh POS SALE", "success");
    //     }
    //   } else {
    //     notify("Refresh Operation Cancelled by POSER", "error");
    //   }
  };
  const genericSearch = () => {
    setGenericSearchShow(true);
  };

  /**
   * removeFromCart
   * Remove Item Local Cart
   */
  const removeFromCart = (id) => {
    if (removeFromDb(id)) {
      updateCartState();
      setShowPermission({ show: false, type: "", data: "" });
      notify("Authorization Successful!", "success");
    } else {
      notify("Remove Item Unsuccessful!", "error");
    }
    // setShowPermission({
    //   ...showPermission,
    //   type: "removeFormCart",
    //   show: false,
    //   data: id,
    // });
    // console.log(id);
    // setPId(id);
    // updateCartState();
  };

  const handleReturn = () => {
    // console.log("return call");
    handleReturnShow();
    // setShowPermission({
    //   ...showPermission,
    //   type: "handelreturn",
    //   show: false,
    //   data: "",
    // });
  };

  // Handle Discount Permission
  const discountCheckbox = () => {
    setDiscountChecked(!discountChecked);
    // setShowPermission({
    //   ...showPermission,
    //   type: "discountCheck",
    //   show: false,
    //   data: "",
    // });
  };
  // console.log("hi")
  // Manager VALID PERMISSION
  // const [validUser] = useValidUserMutation();
  // const managerPermission = async (e, type, id) => {
  //   e.preventDefault();
  //   // const isValid = await validUser({ username: manager, password: pass });
  //   // console.log(isValid);
  //   // if (isValid?.data?.status === true) {

  //   // }
  //   console.log(e, type, id)
  //   switch (type) {
  //     case "removeFormCart":
  //       if (removeFromDb(id)) {
  //         updateCartState();
  //         setShowPermission({ show: false, type: "", data: "" });
  //         notify("Authorization Successful!", "success");
  //       } else {
  //         notify("Remove Item Unsuccessful!", "error");
  //       }
  //       break;
  //     case "handelreturn":
  //       console.log("handel return");
  //       setShowPermission({ show: false, type: "", data: "" });
  //       handleReturnShow();
  //       break;

  //     case "refresh":
  //       if (deleteShoppingCart()) {
  //         updateCartState();
  //         notify("Refresh POS SALE", "success");
  //       }
  //       setShowPermission({ show: false, type: "", data: "" });
  //       break;
  //     case "discountCheck":
  //       setDiscountChecked(!discountChecked);
  //       setShowPermission({ show: false, type: "", data: "" });
  //       break;

  //     default:
  //       console.log(type);
  //       break;
  //   }
  //   setManager("");
  //   setPass("");
  // };

  // DELETE FOR PERMISSION
  // const onSubmitPermission = async (e) => {
  //   e.preventDefault();
  //   const isValid = await validUser({ username: manager, password: pass });
  //   // console.log(isValid);
  //   // console.log(manager, pass, pId);
  //   if (isValid?.data && isValid?.data?.status === true) {
  //     if (removeFromDb(pId)) {
  //       updateCartState();
  //       setShowPermission(false);
  //       notify("Authorization Successful!", "success");
  //       // setManager("");
  //       // setPass("");
  //     }
  //   } else {
  //     notify("Invalid Manager", "error");
  //   }

  //   // console.log("Hi");
  // };

  /**
   * Add Qty
   * Remove Item Local Cart
   */
  const addQuantities = (id) => {
    // console.log(addQuantity(id));
    if (addQuantity(id)) {
      updateCartState();
    }
  };

  /**
   * remove Qty
   * Remove Item Local Cart
   */
  const removeQuantities = (id) => {
    if (removeQuantity(id)) {
      updateCartState();
    }
  };

  /**
   * Custom Qty
   * Custom Item Local Cart
   */
  const handleCustomQty = (e) => {
    const qty = e.target.value > 0 ? parseFloat(e.target.value) : 0;
    const article_code = e.target.attributes.getNamedItem("id").value;
    customQuantity(article_code, qty);
    updateCartState();
  };

  /**
   * Custom noInBox
   * Custom Item Local Cart
   */
  const handleNoOfBox = (e) => {
    // console.log(e);
    const noOfBox = e?.target?.value > 0 ? parseFloat(e.target.value) : 0;
    const article_code = e.target.attributes.getNamedItem("id").value;
    customNoOfBox(article_code, noOfBox);
    updateCartState();
  };

  /**
   * Custom Item Discount
   * Custom Item Local Cart
   */
  const handleItemDiscount = (e, index, article) => {
    e.preventDefault();
    // console.log(e);
    // console.log(article);
    const noOfBox = e?.target?.value > 0 ? parseFloat(e.target.value) : 0;
    const article_code = e?.target?.attributes?.getNamedItem("id")?.value;
    customItemDiscount(article, noOfBox);
    updateCartState();
  };

  /**
   * Custom Sold in Box
   * Custom Item Local Cart
   */
  const handleSoldInBox = (e) => {
    // console.log(e.target.value);
    const soldInBox = e.target.checked ? true : false;
    const article_code = e.target.attributes.getNamedItem("id").value;
    customSoldInBox(article_code, soldInBox);
    updateCartState();
  };

  // KEY PRESS
  // control keypress
  // TODO: Replace to Ref()
  const cashAmountField = document.getElementById("cashAmount");
  const cardAmountField = document.getElementById("cardAmount");
  const cardTypeField = document.getElementById("cardType");
  const mfsAmountField = document.getElementById("mfsAmount");
  const mfsNameField = document.getElementById("mfsName");
  // const itemQtyField = document.getElementById("itemQty");
  const discountField = document.getElementById("discountField");
  const discountCashField = document.getElementById("discountCashField");
  const billPrintButton = useRef(null);
  const firstProductRef = useRef(null);

  // const searchField = useRef(null);

  useKeypress("F1", (e) => {
    e.preventDefault();
    supplierProductsRef.current.focus();
  });

  useKeypress("F2", (e) => {
    e.preventDefault();
    discountField.focus();
  });
  useKeypress("F3", (e) => {
    e.preventDefault();
    deleteLastProduct();
    updateCartState();
  });

  useKeypress("Enter", (e) => {
    e.preventDefault();
    if (changeAmountModal) {
      setChangeAmountModal(false);
      return;
    }
    const active = document.activeElement;

    // if (active === itemQtyField) {
    //   supplierProductsRef.current.focus();
    // }
    if (active === discountField) {
      discountCashField.focus();
    }
    if (active === discountCashField) {
      cashAmountField.focus();
    }
    if (active === cashAmountField) {
      cardTypeField.focus();
    }
    if (active === cardTypeField) {
      cardAmountField.focus();
    }
    if (active === cashAmountField) {
      cardTypeField.focus();
    }
    if (active === cardAmountField) {
      mfsNameField.focus();
    }
    if (active === mfsNameField) {
      mfsAmountField.focus();
    }
    if (active === mfsAmountField) {
      billPrintButton.current.focus();
    }
    if (active === billPrintButton.current) {
      billPrintButton.current.click();
    }
    // console.log("pressed enter");
  });
  const handleKeyDownToSearch = (event) => {
    if (event.key === "Enter") {
      if (event.target === firstProductRef.current) {
        supplierProductsRef.current.focus();
      }
    }
  };

  /**
   * NEW CODE FOR POS SCREEN
   */

  const [hideEmpty, setHideEmpty] = useState(false);
  const [customer, setCustomer] = useState("62e301c1ee6c8940f6ac1515");
  // const [customerName, setCustomerName] = useState("01700000000");
  const [addCustomer] = useAddCustomerMutation();
  const [updateCustomerPoint] = useUpdatePointCustomerMutation();
  // const [getUserPoint] = useCustomerPointQuery();
  const [lastSale, setLastSale] = useState();
  const { data: lastSaleData } = useLastSaleQuery({
    warehouse,
    aamarId,
  });
  const [lastBillId, setLastBillId] = useState("");
  const [lastInvoiceId, setLastInvoiceId] = useState("");

  useEffect(() => {
    if (lastSaleData?.[0]?._id && !lastInvoiceId) {
      setLastInvoiceId(lastSaleData[0]._id);
      setLastBillId(lastSaleData[0]._id);
    }
  }, [lastSaleData]);
  const [preLoadValue, setPreLoadValue] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // RETURN PRODUCTS
  const [returnProducts, setReturnProducts] = useState([]);
  const [reCal, setReCal] = useState({});
  const [returnInvoice, setReturnInvoice] = useState("");
  const [invoice, setInvoice] = useState({});

  // RETURN PRODUCTS

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: preLoadValue,
  });
  // NEW CODE
  // const [newPoint, setNewPoint] = useState(0);
  // const [newTotalPoint, setNewTotalPoint] = useState(0);
  // const [restPoint, setRestPoint] = useState(0);

  // const [posCalculations, setPosCalculations] = useState([]);

  const supplierProductsRef = useRef(null);
  // dispatch new point
  useEffect(() => {
    // remaning point
    const restPoint = posSaleData.point.old - posSaleData.paidAmount.point;

    // new point total
    const newTotalPoint =
      restPoint + Math.floor(posSaleData.grossTotalRound / 100);
    // console.log(posSaleData.grossTotalRound / 100);
    // console.log(newTotalPoint);

    // dispatch new point
    newTotalPoint > 0 && dispatch(saleNewPoint(newTotalPoint));
  }, [posSaleData.paidAmount.point]);

  // Keep changeAmountRef updated to avoid stale closures in handlePrint
  useEffect(() => {
    changeAmountRef.current = posSaleData.changeAmount;
  }, [posSaleData.changeAmount]);

  // Hold Sale
  useEffect(() => {
    // console.log(data);
    const getHold = JSON.parse(localStorage.getItem("hold_cart"));
    getHold?.length > 0 ? setHoldSale(true) : setHoldSale(false);
  }, []);
  // UnHold sale
  const getData = JSON.parse(localStorage.getItem("pos_cart"));
  useEffect(() => {
    if (getData) {
      let newCart = getData?.sort((a, b) => b.order - a.order);
      // console.log(newCart);
      // dispatch(selcetProduct(newCart));
    }
  }, [getData, holdSale]);

  const navigate = useNavigate();
  const componentRef = useRef();

  // HANDLE PRINT RECIPT
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      // Capture change amount using Ref to avoid stale closure
      setLastChangeAmount(changeAmountRef.current);
      setChangeAmountModal(true);

      // RESET CART ITEM
      localStorage.setItem("last_sale", JSON.stringify(posSaleData));
      localStorage.setItem("pos_cart", JSON.stringify([]));
      updateCartState();
      dispatch(saleReset());
      dispatch(saleVoidReset());
      setInvoice({});
      setDiscountChecked(false);
      setIsPrint(false);
      isBillRef.current = false;
      setBill(false);
      // TODO:: reset redux state

      notify("Bill Printed Successful!", "success");
    },
    onPrintError: (errorLocation, error) => {
      console.error("Print error:", errorLocation, error);
      setIsPrint(false);
      isBillRef.current = false;
      setBill(false);
    },
    // onBeforePrint: handleOnBeforeGetContent,
  });

  // const [customer, setCustomer] = useState("Walk in Customer");

  // const searchField = document.getElementById("productSearch");
  useEffect(() => {
    if (isPrint !== false) {
      handlePrint();
      notify("Create Sale Successfully!", "success");
      // setLastSale({});
    } else {
      return;
    }
  }, [isPrint]);
  // console.log(isPrint);
  const [createSale] = useAddSaleMutation();

  // const { updateInventoryOut, updateInventoryInOnSaleDel } = useInventory();

  // const [customers, setCustomers] = useState([]);

  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClosePermission = () =>
    setShowPermission({ type: false, type: "", data: "" });
  const handleShowPermission = () =>
    setShowPermission({ ...showPermission, type: false, type: "", data: "" });
  const handleReturnClose = () => setReturnShow(false);
  const handleReturnShow = () => setReturnShow(true);

  // console.log(show)

  const createNewCustomer = async (customer) => {
    let customerData = customer;
    const message = `সন্মানিত গ্রাহক, আপনাকে ${storeSettings?.storeName} সেবার জগতে স্বাগতম। আপনার মেম্বারশিপ আইডি ${customer?.phone}। আগামীতে আরও রোমাঞ্চকর অফার ও সার্ভিস পেতে আমাদের সাথে সংযুক্ত থাকুন। বিস্তারিত - ${storeSettings?.phone}`;
    customerData.username = customer?.name;
    customerData.membership = customer?.membership;
    customerData.status = "active";
    // console.log(customerData);

    const newCustomer = {
      name: customer?.name,
      password: customer?.password,
      email: customer?.email,
      phone: customer?.phone,
      username: customer?.username,
      membership: customer?.membership,
      warehouse: user?.warehouse,
      aamarId: user?.aamarId,
      address: {
        type: "Home",
        id: customerUniqeId,
        holdingNo: customer?.holdingNo,
        sector: customer?.sector,
        street: customer?.street,
        town: customer?.town,
        city: customer?.city,
        division: customer?.division,
        country: customer?.country,
        zipCode: customer?.zipCode,
      },
      type: customer?.type,

      point: customer?.point ? customer?.point : 0,
      status: "active",
    };
    // console.log("newCustomer", newCustomer);
    try {
      await addCustomer(newCustomer)
        .then((res) => {
          // console.log("customer", res);
          // setCustomer(res.data.id);
          if (res?.data) {
            notify(`Create Customer as ${customer.name}`, "success");
          }
          dispatch(
            selcetCustomer({
              customerId: res.data.id,
              point: 0,
              name: customer.name,
              phone: customer.phone,
              aamarId: user?.aamarId,
              warehouse: user?.warehouse,
            })
          );

          // SEND SMS
          sendMessage(customerData?.phone, message);

          // notify(`Create Customer as ${customer.name}`, "success");
          // CLOSE POP UP
          handleClose();
          // RESET FORM DATA
          reset({
            name: "",
            phone: "",
            address: "",
          });
          // REFATCH CUSTOMEr DATA
        })
        .catch((err) => {
          notify(`Already a Customer`, "error");
        });
    } catch (err) {
      console.log(err);
    }
    // sendMessage("01742225636", message);

    // console.log(customerDW);
  };

  const onResetHandler = () => {
    // Reset all fields, but leave 'group' untouched
    reset();

    // Manually set the 'group' field value to the current group (preserving it)
    setValue("group", group, { shouldValidate: true, shouldDirty: true });
  };

  // handlePrintBill
  const handlePrintBill = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (isBillRef.current || isbill) {
      return;
    }
    isBillRef.current = true;
    setBill(true);

    const confirmed = await AlertService.confirm("Are you sure?", "Print this bill?");
    if (confirmed) {
      // let data = {};
      // console.log("before sale:", posSaleData);
      // die();
      try {
        // Create Sale
        if (posSaleData) {
          if (posSaleData.changeAmount >= 0) {
            console.log(posSaleData);
            const newSale = await createSale({
              ...posSaleData,
              aamarId: aamarId,
              warehouse: warehouse,
              group: group,
            });
            // console.log("new Sale", newSale);
            if (newSale?.data?.status === 200) {
              dispatch(selectInvoiceId(newSale?.data?.data?.invoiceId));
              setLastInvoiceId(newSale?.data?.data?._id);
              // console.log(lastInvoiceId);
              // TODO::Add customer point update system backend
              if (posSaleData.customerId !== "62e301c1ee6c8940f6ac1515") {
                const customerData = {
                  _id: posSaleData.customerId,
                  point: posSaleData.point.new,
                };
                const updateCustomer = await updateCustomerPoint(
                  customerData
                );
                // console.log("customer", updateCustomer);
                updateCustomer &&
                  notify(
                    `Update Points ${posSaleData.point.new || 0} for user ${posSaleData.customerName || "walkaway customer"
                    }`,
                    "success"
                  );
              }
              setIsPrint(true);
              // Bill remains disabled until printing is complete (handled in onAfterPrint/onPrintError)
            } else {
              notify("Sale generation failed! Please try again", "error");
              isBillRef.current = false;
              setBill(false);
              return false;
            }
          } else {
            notify("Cash received insufficient", "error");
            isBillRef.current = false;
            setBill(false);
            return false;
          }
        } else {
          isBillRef.current = false;
          setBill(false);
          return false;
        }
      } catch (err) {
        console.log(err);
        notify("Bill generation Unsuccessful", "error");
        isBillRef.current = false;
        setBill(false);
        return false;
      }
    } else {
      notify("You Cancel the Bill", "error");
      isBillRef.current = false;
      setBill(false);
      return false;
    }
  };

  // console.log(posSaleData.returnProducts);

  const handleHoldSale = async () => {
    // const holdCart = carts;
    // TODO:: Create Multiple invoice hold system
    // CHECK HOLD CART
    if (posSaleData?.products?.length > 0) {
      let hold = localStorage.getItem("hold_cart");
      let holdData = JSON.parse(hold);
      if (holdData !== null) {
        holdData = [
          ...holdData,
          { products: posSaleData.products, order: new Date() },
        ];
        // console.log(holdData);

        localStorage.setItem("hold_cart", JSON.stringify(holdData));
      } else {
        localStorage.setItem(
          "hold_cart",
          JSON.stringify([
            { products: posSaleData.products, order: new Date() },
          ])
        );
      }
      localStorage.setItem("pos_cart", JSON.stringify([]));
      // setHoldSale(true);
      dispatch(saleReset());
      updateCartState();
      // console.log(hold); //, holdData)
    } else {
      notify("There is no Products for hold", "error");
    }
  };

  const handleVoidReturn = () => {
    setVoidReturnShow(true);
  };

  // HANFLE SHOW HIDE 0 STOCK PRODUCT
  const handleHideEmpty = () => {
    setHideEmpty(!hideEmpty);
  };

  // console.log("store photos", storeSettings);

  return (
    <div className="pos-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <div className="pos-terminal mt-4">
              <div className="d-block d-md-none">
                <PosHeader logo={logo}></PosHeader>
              </div>
              <div className="d-md-flex justify-content-between  align-items-center">
                <div className="d-flex gap-2 gap-md-3 justify-content-center justify-content-md-between  align-items-center">
                  <div className=" col-md-10 ">
                    <Form.Control
                      value={user?.name}
                      name="biller_id"
                      readOnly
                    ></Form.Control>
                  </div>
                  <div className="col-md-10 ">
                    <Form.Control
                      value={whName}
                      name="warehouse"
                      readOnly
                    ></Form.Control>
                  </div>
                </div>
                <div className="col-md-4 mt-2 mt-md-0">
                  <div className="d-flex justify-content-between gap-1 align-items-center">
                    {/* SELECT CUSTOMER */}
                    <div className=" w-100 ">
                      <SelectCustomer aamarId={aamarId} />
                    </div>
                    <button
                      type="button"
                      onClick={handleShow}
                      className=" col-3 btn btn-outline-secondary"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-11">
                  {/* SEARCH PRODUCT */}
                  <PosSearchProduct
                    className="searchProduct"
                    addToList={addToList}
                    supplierProductsRef={supplierProductsRef}
                    hideEmpty={hideEmpty}
                    aamarId={aamarId}
                  ></PosSearchProduct>
                </div>
                <div className="col-md-1">
                  {hideEmpty ? (
                    <BsCheckSquare style={{ cursor: "pointer" }} onClick={() => handleHideEmpty()} />
                  ) : (
                    <BsSquare style={{ cursor: "pointer" }} onClick={() => handleHideEmpty()} />
                  )}
                  <b style={{ cursor: "pointer" }} onClick={() => handleHideEmpty()}>
                    {" "}
                    0<small> Stock </small>
                  </b>
                </div>
                <div className="col-12">
                  <div className="table-responsive mt-2">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Product</th>
                          <th scope="col">Group</th>
                          <th scope="col" className="text-center">
                            Stock
                          </th>
                          <th className="text-center" scope="col">
                            Box?
                          </th>
                          <th scope="col" className="text-center text-nowrap">
                            No of Box
                          </th>
                          <th scope="col">Price</th>
                          <th className="text-center sm-wider" scope="col">
                            Quantity
                          </th>
                          {/* <th scope="col" className="text-center">
                            Vat
                          </th> */}
                          <th scope="col">Discount</th>
                          <th scope="col" className="text-center text-nowrap">
                            Sub-Total
                          </th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody className="cart-list">
                        <PosCart
                          updateCart={updateCartState}
                          invoice={invoice}
                          returnProducts={returnProducts}
                          removeFromCart={removeFromCart}
                          addQuantities={addQuantities}
                          removeQuantities={removeQuantities}
                          handleCustomQty={handleCustomQty}
                          handleNoOfBox={handleNoOfBox}
                          handleItemDiscount={handleItemDiscount}
                          handleSoldInBox={handleSoldInBox}
                          reCal={reCal}
                          firstProductRef={firstProductRef}
                          handleKeyDownToSearch={handleKeyDownToSearch}
                        ></PosCart>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="d-none d-md-block">
              <PosHeader logo={logo}></PosHeader>
            </div>
            <PosFinalizes
              customerPoint={customerPoint}
              billPrintButton={billPrintButton}
              // discountValidPermission={managerPermission}
              discountCheckbox={discountCheckbox}
              posFinalizer={posFinalizer}
              handlePrintBill={handlePrintBill}
              returnProducts={returnProducts}
              reCal={reCal}
              customer={customer}
              isBill={isbill}
              setBill={setBill}
            ></PosFinalizes>
          </div>
        </div>
      </div>
      <PosFooter
        genericSearch={genericSearch}
        emptyCart={emptyCart}
        LastBillId={lastInvoiceId || lastSaleData?.[0]?._id}
        handleHoldSale={handleHoldSale}
        holdSale={holdSale}
        handleReturn={handleReturn}
        updateCartState={updateCartState}
        handleVoidReturn={handleVoidReturn}
      ></PosFooter>
      {/* PRINT BILL */}
      <div className="print-wrapper pt-0 mt-0 mb-0 pb-0">
        <div className="print-area" ref={componentRef}>
          <div className="container-fluid p-0">
            <div className="row m-0">
              <div className="col-12 p-0">
                <p className="text-center mb-1">
                  <img src={logo2} alt="" width="150" className="print-logo mb-0" />
                </p>
                <p className="text-center info header mb-0">
                  <i>BIN 0046016960102 | Mushak 6.3</i>
                </p>
                <p className="text-center info invoice mb-0">
                  <b>Invoice No: {posSaleData?.invoiceId}</b>
                </p>


                <p className="info mb-0">
                  Customer: {posSaleData?.customerName || "Walkaway customer"}
                  <span className="float-end">
                    {format(new Date(), "h:mm a")}
                  </span>
                </p>
                <p className="info mb-0">
                  Customer Phone: {posSaleData?.customerPhone}
                  <span className="float-end">
                    Date: {format(new Date(), "dd-MM-yyyy")}
                  </span>
                </p>
                <p className="info mb-0">
                  Biller: {user?.name}
                  <span className="float-end">
                    Outlet: <b>{whName}</b>
                  </span>
                </p>

                <p className="text-center order_details my-1">ORDER INVOICE</p>
                <table className="table p-0 d-flex-table mb-1">
                  <thead>
                    <tr>
                      <td style={{ width: "9%", padding: "1px 2px" }}>SL</td>
                      <td colSpan="3" style={{ width: "45%", padding: "1px 2px" }}>Item</td>
                      <td style={{ width: "12%", padding: "1px 2px" }}>Qty</td>
                      <td style={{ width: "16%", padding: "1px 2px" }}>Rate</td>
                      {/* <td>VAT</td> */}
                      {/* <td>Discount</td> */}
                      <td style={{ width: "18%", padding: "1px 2px" }}>
                        <span className="float-end">Total</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(bill.products)}  */}
                    {posSaleData?.products?.length > 0 ? (
                      posSaleData?.products?.map((item, i) => (
                        <tr className="d-print-table-row" key={item.id} style={{ whiteSpace: "nowrap" }}>
                          <td style={{ width: "9%", padding: "1px 2px", whiteSpace: "nowrap" }}>{i + 1}</td>
                          <td
                            colSpan="3"
                            className="item-name-cell"
                            style={{
                              width: "45%",
                              textTransform: "capitalize",
                              fontSize: ".75em",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "0",
                              padding: "1px 2px",
                            }}
                            title={item?.name}
                          >
                            {item?.name}
                          </td>
                          <td style={{ width: "12%", padding: "1px 2px", whiteSpace: "nowrap" }}>{item?.qty}</td>
                          <td style={{ width: "16%", padding: "1px 2px", whiteSpace: "nowrap" }}>{item.mrp}</td>
                          {/* <td>
                            {itemVat(
                              item?.qty && item?.vat,
                              item?.qty,
                              itemPrice(item.discount, item.mrp)
                            ).toFixed(2)}
                          </td> */}
                          {/* <td>{item?.discount} %</td> */}
                          <td style={{ width: "18%", padding: "1px 2px", whiteSpace: "nowrap" }}>
                            <span className="float-end">
                              {itemVatTotal(
                                item?.vat,
                                item?.qty,
                                itemPrice(item.discount, item.mrp)
                              ).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ padding: "1px 2px" }}>No Product in Purchase cart</td>
                      </tr>
                    )}
                    {posSaleData?.returnProducts?.length > 0 && (
                      <>
                        <tr>
                          <th colSpan={3} style={{ padding: "1px 2px" }}>
                            <b>Return Products</b>
                          </th>
                          <td colSpan={4} className="text-end" style={{ padding: "1px 2px" }}>
                            <b>Ref Invoice id:</b>
                            {posSaleData?.returnProducts?.returnInvoice}
                          </td>
                        </tr>
                        {posSaleData?.returnProducts?.map((item) => (
                          <tr className="d-print-table-row" key={item.id} style={{ whiteSpace: "nowrap" }}>
                            <td
                              colSpan="3"
                              className="item-name-cell"
                              style={{
                                width: "45%",
                                textTransform: "capitalize",
                                fontSize: ".75em",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "0",
                                padding: "1px 2px",
                              }}
                              title={item?.name}
                            >
                              {item?.name?.toLowerCase()}
                            </td>
                            <td style={{ width: "12%", padding: "1px 2px", whiteSpace: "nowrap" }}>{item?.qty}</td>
                            <td style={{ width: "16%", padding: "1px 2px", whiteSpace: "nowrap" }}>{item?.mrp}</td>
                            <td colSpan={2} style={{ width: "27%", padding: "1px 2px", whiteSpace: "nowrap" }}>
                              <span className="float-end">
                                {(item?.qty * item?.mrp).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
                <p className="bill-info border-bottom border-bottom-dashed">
                  Total Item:{posSaleData?.products?.length}
                  <span className="float-end">
                    Total Qty:{posSaleData.totalItem}
                  </span>
                </p>
                {reCal?.totalItem > 0 && (
                  <p className="bill-info border-bottom border-bottom-dashed">
                    Return Item:{" "}
                    <span className="float-end">{reCal?.totalItem}</span>
                  </p>
                )}
                <p className="bill-info border-bottom border-bottom-dashed">
                  Total:{" "}
                  <span className="float-end">
                    {parseFloat(posSaleData?.total)?.toFixed(2)}
                  </span>
                </p>
                {/* {console.log(posSaleData?.returnCal?.grossTotalRound)} */}
                {posSaleData?.returnCal?.grossTotalRound > 0 && (
                  <p className="bill-info">
                    Return Total:{" "}
                    <span className="float-end">
                      {posSaleData?.returnCal?.grossTotalRound}
                    </span>
                  </p>
                )}
                <p className="bill-info border-bottom border-bottom-dashed">
                  Due Adjustment:{" "}
                  <span className="float-end">
                    - {posSaleData?.discount ? posSaleData?.discount : 0}
                  </span>
                  {/* <span className="float-end">
                    - {posSaleData?.discount ? posSaleData?.discount + (posSaleData.total - posSaleData.grossTotal) : 0}
                  </span> */}
                </p>
                {/* <p className="bill-info border-bottom border-bottom-dashed">
                  Vat:{" "}
                  <span className="float-end">
                    {" "}
                    {parseFloat(
                      posSaleData.vat - posSaleData.returnCal.vat
                    )?.toFixed(2)}
                    {/* {reCal?.vatAmount > 0
                      ? posSaleData.vat - reCal?.vatAmount
                      : posSaleData.vat} */}
                {/* </span>
                </p> */}
                {/* <p className="bill-info border-bottom border-bottom-dashed">
                  Net Amount:{" "}
                  <span className="float-end border border-dark">
                    {parseFloat(posSaleData.grossTotal)?.toFixed(2) - parseFloat(posSaleData.discount)}
                  </span>
                </p> */}
                <p className="bill-info border-bottom border-bottom-dashed">
                  Net Amount:{" "}
                  <b>
                    <span className="float-end border border-dark px-1 py-0">
                      {parseInt(
                        posSaleData.grossTotalRound -
                        parseFloat(posSaleData.discount)
                      )}
                    </span>
                  </b>
                </p>
                {/* {posSaleData?.paidAmount?.cash > 0 && (
                  <p className="bill-info border-bottom border-bottom-dashed">
                    Received Cash:
                    <span className="float-end">
                      {posSaleData?.paidAmount?.cash}
                    </span>
                  </p>
                )} */}
                {/* {posSaleData?.paidAmount?.card?.amount > 0 && (
                  <p className="bill-info border-bottom border-bottom-dashed">
                    Received{" "}
                    {posSaleData?.paidAmount?.card?.name
                      ? posSaleData?.paidAmount?.card?.name
                      : "Visa"}{" "}
                    Card :
                    <span className="float-end">
                      {posSaleData?.paidAmount?.card.amount}
                    </span>
                  </p>
                )} */}
                {/* {posSaleData?.paidAmount?.mfs?.amount > 0 && (
                  <p className="bill-info border-bottom border-bottom-dashed">
                    Received {posSaleData?.paidAmount?.mfs?.name}:
                    <span className="float-end">
                      {posSaleData?.paidAmount?.mfs?.amount}
                    </span>
                  </p>
                )} */}
                {/* {posSaleData?.paidAmount?.point > 0 && (
                  <p className="bill-info border-bottom border-bottom-dashed">
                    Received Point:
                    <span className="float-end">
                      {posSaleData?.paidAmount?.point}
                    </span>
                  </p>
                )} */}

                <p className="bill-info border-bottom border-bottom-dashed">
                  Total Received:
                  {/* <b> */}
                  <span className="float-end">
                    {posSaleData?.totalReceived}
                  </span>
                  {/* </b> */}
                </p>
                <p className="bill-info border-bottom border-bottom-dashed">
                  Change Amount:
                  <span className="float-end">
                    {posSaleData?.changeAmount?.toFixed(2)}
                    BDT
                  </span>
                </p>
                {/* <p className="bill-info text-center ">
                  Previous Point: {posSaleData.point.old} | New Point :
                  {posSaleData.point.new}
                </p> */}

                <p className="nb">
                  বিঃদ্রঃ <br />
                  ১. তাপ সংবেদনশীল সকল ঔষধ, সুগার টেস্ট স্ট্রিপ এবং ঔষধের কাটা
                  পাতা অফেরতযোগ্য। <br />
                  ২. ঔষধ ক্রয়ের সময় নিজ দায়িত্বে ঔষধের পরিমাণ এবং মেয়াদ
                  উত্তীর্ণ তারিখ দেখে নিন।
                  <br />
                  ৩. ক্রয় কৃত পণ্য ৪৮ ঘণ্টার মধ্যে পরিবর্তনযোগ্য এবং সেলস স্লিপ
                  সাথে আনতে হবে। <br />
                  <span className="d-block text-center">
                    **************************<span className="fw-bold"> ধন্যবাদ </span>***************************
                  </span>

                </p>
                {/* <p className="text-center bar-code">
                  {/* {lastSale?.invoiceId && ( */}
                {/* {lastBillId && (
                    <Barcode
                      value={posSaleData.invoiceId}
                      height="60"
                      width="2"
                      fontSize="10"
                    />
                  )} */}
                {/* )} */}
                {/* </p> */}
                {storeSettings?.websiteUrl && (
                  <p className="text-center info footer mb-0">
                    {storeSettings.websiteUrl}
                  </p>
                )}
                <p className="text-center info mb-0">
                  <b>Hot Line: +8801742225636</b>
                </p>
                <p className="text-center info mb-0">
                  <b>Thank you for shopping with us.</b>
                </p>
                <hr className="my-1" />
                <p className="text-center info mb-0">
                  <i>Powered by Techsoul Call: +8801743-222335</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* PRINT BILL */}
      <Toaster position="bottom-right" />
      {/* Add Customer Modal */}
      {/* <form onSubmit={handleSubmit(createNewCustomer)}> */}
      <Modal show={show} onHide={handleClose}>
        {/* <form onSubmit={handleSubmit(createNewCustomer)}> */}
        <Modal.Header closeButton>
          <Modal.Title>
            <Icons.UserAddOutline /> Create Customer
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateCustomerForm onSubmit={createNewCustomer} useForm={useForm} />
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
          {/* <Button variant="dark" type="submit" className="btn btn-dark ">
            <Icons.Plus> </Icons.Plus> Add Customer
          </Button> */}
        </Modal.Footer>
        {/* </form> */}
      </Modal>
      {/* Return Modal */}
      <ReturnModal
        title="Return Product"
        onShow={returnShow}
        handleClose={handleReturnClose}
        returnProducts={returnProducts}
        setReturnProducts={setReturnProducts}
        updateCart={updateCartState}
        reCal={reCal}
        setReCal={setReCal}
        returnInvoice={returnInvoice}
        setReturnInvoice={setReturnInvoice}
        // handleReturnCustomerSelect={handleReturnCustomerSelect}
        invoice={invoice}
        setInvoice={setInvoice}
      ></ReturnModal>
      <VoidReturnModal
        returnProducts={returnProducts}
        setReturnProducts={setReturnProducts}
        onShow={voidReturnShow}
        setOnShow={setVoidReturnShow}
        handleClose={handleVoidReturnClose}
        updateCart={updateCartState}
        setLastInvoiceId={setLastInvoiceId}
        setInvoice={setInvoice}
      ></VoidReturnModal>
      <GenericSearchModal
        onShow={genericSearchShow}
        handleClose={handleGenericSearchClose}
      ></GenericSearchModal>
      {/* Permission Modal */}
      <Modal show={showPermission.show} onHide={handleClosePermission}>
        {/* {console.log(showPermission)} */}
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Process</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mb-3">
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputCustomer">Manager</label>
                {/* <input
                  name="manager"
                  type="text"
                  className="form-control"
                  id="inputCustomer"
                  placeholder="User name"
                  onBlur={(e) => setManager(e.target.value)}
                /> */}
                <select
                  onChange={(e) => setManager(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select User</option>
                  <option value="manager">Manager</option>
                  <option value="manishankarvakta">Manishankar</option>
                </select>
                <small id="emailHelp" className="form-text text-muted">
                  {/* We'll never share your email with anyone else. */}
                </small>
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputMC">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  id="phone"
                  onBlur={(e) => setPass(e.target.value)}
                  placeholder="Password"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="reset"
              className="btn btn-outline-dark"
              variant="outlineDark"
              onClick={handleClosePermission}
            >
              Cancel
            </Button>
            <Button
              variant="dark"
              type="submit"
              // onClick={(e) =>
              //   managerPermission(e, showPermission.type, showPermission.data)
              // }
              className="btn btn-dark "
            >
              <Icons.Check> </Icons.Check> Confirm
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Change Amount Modal */}
      <Modal
        show={changeAmountModal}
        onHide={() => setChangeAmountModal(false)}
        centered
        size="md"
        keyboard={true}
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Sale Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <h3 className="mb-3">Change Amount</h3>
          <h1 className="display-1 text-success">
            <b>{lastChangeAmount?.toFixed(2)}</b>
          </h1>
          <p className="lead text-muted">Please return this amount to the customer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            className="w-100 py-2"
            onClick={() => setChangeAmountModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default POS;
