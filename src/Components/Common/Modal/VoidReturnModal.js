import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { AllSaleDataVoid, saleReset, selectInvoiceId } from "../../../features/posSlice";
import {
  saleReturnProducts,
  saleTotalDiscount,
  saleVoidReset,
  salesReturnCal,
  selectVoidBiller,
} from "../../../features/voidSlice";
import logo from "../../../logo_pharma.jpg";
import { useAddSaleMutation } from "../../../services/saleApi";
import { useGroupListQuery } from "../../../services/groupApi";
import { useWarehouseQuery } from "../../../services/warehouseApi";
import { signInUser } from "../../Utility/Auth";
import { notify } from "../../Utility/Notify";
import AlertService from "../../Utility/AlertService";
import {
  customDiscount,
  itemVat,
  itemVatTotal,
  returnCalculation,
  toDecimal,
} from "../../Utility/PosCalculations";
import PosSearchProductReturn from "../CustomSelect/PosSearchProductReturn";
import SelectCustomerVoid from "../CustomSelect/selectCustomerVoid";

const VoidReturnModal = ({
  onShow,
  setOnShow,
  handleClose,
  updateCart,
  returnProducts,
  setReturnProducts,
  setLastInvoiceId,
  setInvoice,
}) => {
  const user = signInUser();
  const { storeSettings, warehouse, aamarId } = user;

  // console.log("user", user);
  const supplierProductsRef = useRef(null);
  const firstProductQtyRef = useRef(null);
  const [whName, setWhName] = useState(" ");

  const { data: wh, refetch, isFetching } = useWarehouseQuery(user?.warehouse);
  const { data: groupList } = useGroupListQuery(aamarId);

  const [group, setGroup] = useState("");
  useEffect(() => {
    if (groupList?.length > 0 && !group) {
      setGroup(groupList[0]._id);
    }
  }, [groupList, group]);

  const firstProductDisRef = useRef(null);
  // const [customerShow, setCustomerShow] = useState(false);
  // const handleShow = () => setCustomerShow(true);
  // const handleCLose = () => setCustomerShow(false);
  const [reProducts, setReProducts] = useState([]);
  const posSaleData = useSelector((state) => state.voidReducer);
  // console.log("POSSALEDATA", posSaleData);
  const carts = useSelector((state) => state.posReducer.products);
  const dispatch = useDispatch();
  const [createSale] = useAddSaleMutation();
  const componentRef = useRef();
  const [isPrint, setIsPrint] = useState(false);
  const [lastBillId, setLastBillId] = useState("01717000000");
  // const { register, handleSubmit, reset } = useForm({});
  // const customerUniqeId = uuidv4();
  // const [addCustomer] = useAddCustomerMutation();

  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5006";
  const prevLength = useRef(0);
  const prevOnShow = useRef(false);

  useLayoutEffect(() => {
    const currentLength = posSaleData.returnProducts?.length || 0;
    const justOpened = onShow && !prevOnShow.current;
    const itemAdded = onShow && currentLength > prevLength.current;

    if ((justOpened || itemAdded) && firstProductQtyRef.current) {
      firstProductQtyRef.current.focus();
    }

    prevLength.current = currentLength;
    prevOnShow.current = onShow;
  }, [posSaleData.returnProducts?.length, onShow]);

  useEffect(() => {
    updateCart();
  }, [posSaleData.returnProducts]);

  // useKeypress("F1", (e) => {
  //     e.preventDefault();
  //     supplierProductsRef.current.focus();
  // });
  // const handleKeyDownToSearch = (event) => {
  //     if (event.key === "Enter") {
  //         if (event.target === firstProductQtyRef.current) {
  //             firstProductDisRef.current.focus();
  //         }
  //     }
  // }
  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      // RESET CART ITEM
      localStorage.setItem("last_sale", JSON.stringify(posSaleData));
      localStorage.setItem("pos_cart", JSON.stringify([]));
      dispatch(saleReset());
      dispatch(saleVoidReset());
      setInvoice({});
      setIsPrint(false);
      handleClose();
      // TODO:: reset redux state

      notify("Bill Printed Successful!", "success");
    },
    // onBeforePrint: handleOnBeforeGetContent,
  });
  useEffect(() => {
    if (isPrint !== false) {
      handlePrint();
      notify("Create Sale Successfully!", "success");
      // setLastSale({});
    } else {
      return;
    }
  }, [isPrint]);

  const addToListReturn = async (product) => {
    // console.log(product);
    const seleted = posSaleData?.returnProducts?.filter(
      (item) => item.article_code === product.article_code
    );
    const rest = posSaleData?.returnProducts?.filter(
      (item) => item.article_code != product.article_code
    );
    let returnList = [];

    if (seleted?.length === 0) {
      returnList = [
        {
          ...product,
          qty: 1,
          aamarId: aamarId,
          warehouse: warehouse,
          order: posSaleData?.returnProducts?.length + 1,
          discount: 0,
        },
        ...rest,
      ];
    } else {
      returnList = rest;
    }
    // console.log(returnList);
    dispatch(saleReturnProducts(returnList));
    dispatch(selectVoidBiller(user?.id));

    // setReturnProducts(returnList);
    setReProducts(returnList);
    const {
      totalItem,
      total,
      vatAmount,
      grossTotal,
      grossTotalRound,
      newPoint,
    } = returnCalculation(returnList);
    // console.log(
    //   totalItem,
    //   total,
    //   vatAmount,
    //   grossTotal,
    //   grossTotalRound,
    //   newPoint
    // );
    const reCal = {
      totalItem: totalItem,
      total: total,
      vatAmount: vatAmount,
      grossTotal: grossTotal,
      grossTotalRound: grossTotalRound,
      newPoint: newPoint,
    };
    dispatch(salesReturnCal(reCal));
  };
  const handleReturn = async () => {
    // console.log("posSaleData", posSaleData);
    // dispatch(AllSaleDataVoid(posSaleData))
    // console.log(posSaleData2)
    const confirmed = await AlertService.confirm("Are you sure?", "Print this bill?");
    if (confirmed) {
      if (
        !posSaleData.returnProducts ||
        posSaleData.returnProducts.length === 0
      ) {
        notify("Please add at least one product to return", "error");
        return;
      }
      // let data = {};
      // console.log("before sale:", posSaleData);
      // die();
      try {
        // Create Sale
        if (posSaleData) {
          console.log("posSaleData", posSaleData);
          console.log("posSaleData", posSaleData);
          const createSaleData = { ...posSaleData, aamarId, warehouse, group }
          console.log("createSaleData", createSaleData);
          const newSale = await createSale(createSaleData);

          console.log("new Sale", newSale);
          if (newSale?.data?.status === 200) {
            dispatch(selectInvoiceId(newSale?.data?.data?.invoiceId));
            setLastInvoiceId(newSale?.data?.data?._id);
          }
          setIsPrint(true);
        } else {
          notify("Sale generation failed! Please try again", "error");
          return false;
        }
      } catch (err) {
        console.log(err);
        notify("Bill generation Unsuccessful", "error");
      } finally {
        return false;
      }
    } else {
      notify("You Cancel the Bill", "error");
    }
  };
  const handleProductQtyChange = (e, reItem) => {
    let selectedItem = posSaleData.returnProducts.find(
      (p) => p.article_code === reItem.article_code
    );
    let restItem = posSaleData.returnProducts.filter(
      (p) => p.article_code !== reItem.article_code
    );

    // console.log(posSaleData.returnProducts, reItem._id, e.target.value);

    selectedItem = {
      ...selectedItem,
      qty: e.target.value > 0 ? e.target.value : 0,
    };
    restItem = [...restItem, selectedItem];

    // console.log(restItem);
    const returnItems = restItem.sort((a, b) => a.order - b.order);
    dispatch(saleReturnProducts(returnItems));
    const {
      totalItem,
      total,
      vatAmount,
      grossTotal,
      grossTotalRound,
      newPoint,
    } = returnCalculation(returnItems);
    // console.log(
    //   totalItem,
    //   total,
    //   vatAmount,
    //   grossTotal,
    //   grossTotalRound,
    //   newPoint
    // );
    const reCal = {
      totalItem: totalItem,
      total: total,
      vatAmount: vatAmount,
      grossTotal: grossTotal,
      grossTotalRound: grossTotalRound,
      newPoint: newPoint,
    };
    dispatch(salesReturnCal(reCal));
  };
  // console.log(returnProducts);
  const handleItemDiscount = (e, index, reItem) => {
    // console.log(reItem);
    // console.log(e.target.value, reItem.qty, reItem.tp);
    let selectedItem = posSaleData.returnProducts.find(
      (p) => p.article_code === reItem.article_code
    );
    let restItem = posSaleData.returnProducts.filter(
      (p) => p.article_code !== reItem.article_code
    );

    // console.log(posSaleData.returnProducts, reItem._id, e.target.value);

    let value = parseFloat(e.target.value);
    if (value > 100) {
      value = 100;
    }
    if (value < 0 || isNaN(value)) {
      value = 0;
    }

    selectedItem = {
      ...selectedItem,
      discount: value,
    };
    restItem = [...restItem, selectedItem];

    // console.log(restItem);
    const returnItems = restItem.sort((a, b) => a.order - b.order);
    // console.log(returnItems);
    dispatch(saleReturnProducts(returnItems));
    const {
      totalItem,
      total,
      vatAmount,
      grossTotal,
      grossTotalRound,
      newPoint,
    } = returnCalculation(returnItems);
    // console.log(
    //   totalItem,
    //   total,
    //   vatAmount,
    //   grossTotal,
    //   grossTotalRound,
    //   newPoint
    // );
    const reCal = {
      totalItem: totalItem,
      total: total,
      vatAmount: vatAmount,
      grossTotal: grossTotal,
      grossTotalRound: grossTotalRound,
      newPoint: newPoint,
    };
    dispatch(salesReturnCal(reCal));
    // customDiscount(e.target.value, reItem.qty, reItem.tp)
  };
  const removeFromCart = (reItem) => {
    let selectedItem = posSaleData.returnProducts.find(
      (p) => p.article_code === reItem.article_code
    );
    let restItem = posSaleData.returnProducts.filter(
      (p) => p.article_code !== reItem.article_code
    );
    const returnItems = restItem.sort((a, b) => a.order - b.order);
    dispatch(saleReturnProducts(returnItems));
    const {
      totalItem,
      total,
      vatAmount,
      grossTotal,
      grossTotalRound,
      newPoint,
    } = returnCalculation(returnItems);
    // console.log(
    //   totalItem,
    //   total,
    //   vatAmount,
    //   grossTotal,
    //   grossTotalRound,
    //   newPoint
    // );
    const reCal = {
      totalItem: totalItem,
      total: total,
      vatAmount: vatAmount,
      grossTotal: grossTotal,
      grossTotalRound: grossTotalRound,
      newPoint: newPoint,
    };
    dispatch(salesReturnCal(reCal));
  };

  const handleTotalDiscount = (e) => {
    dispatch(saleTotalDiscount(e.target.value));
  };

  let i = 1;
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      centered={true}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Void Return</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-md-12 mb-2">
          <div className="row g-0">
            <div className="col-md-8 mb-2">
              <PosSearchProductReturn
                className="searchProduct"
                addToList={addToListReturn}
                supplierProductsRef={supplierProductsRef}
              ></PosSearchProductReturn>
            </div>
            <div className="col-md-4 mb-2  ">
              <div className="row g-0">
                {/* SELECT CUSTOMER */}
                <div className="col-12">
                  <SelectCustomerVoid />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="overflow-x-auto">
            <table className="table mt-3">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Product</th>
                  <th scope="col">Group</th>
                  <th scope="col">TP</th>
                  <th scope="col">MRP</th>
                  <th className="text-center" scope="col">
                    Quantity
                  </th>
                  <th scope="col">Price</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Total</th>
                  <th className="text-center text-nowrap" scope="col">
                    Sub-Total
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody className="cart-list">
                {posSaleData?.returnProducts
                  ?.slice()
                  .sort((a, b) => b.order - a.order)
                  ?.map((reItem, index) => (
                    <tr key={reItem?.article_code}>
                      <th scope="row">{i++}</th>
                      <td title={reItem?.article_code}>{reItem?.name}</td>
                      <td>{reItem?.group?.name}</td>
                      <td>{reItem?.tp}</td>
                      <td>{reItem?.mrp}</td>
                      <td className="col-md-1">
                        <input
                          type="number"
                          className="form-control quantity"
                          id={reItem?.article_code}
                          onChange={(e) => handleProductQtyChange(e, reItem)}
                          value={reItem?.qty}
                          ref={index === 0 ? firstProductQtyRef : null}
                        />
                      </td>
                      <td>
                        {parseFloat(
                          itemVat(
                            reItem?.vat ? reItem?.vat : 0,
                            reItem?.qty,
                            reItem?.tp
                          )
                        )?.toFixed(2)}
                      </td>
                      <td>
                        <div className="input-group">
                          <input
                            className="form-control quantity col-md-1"
                            type="number"
                            min={1}
                            max={100}
                            value={reItem?.discount || ""}
                            onChange={(e) =>
                              handleItemDiscount(e, index, reItem)
                            }
                            ref={index === 0 ? firstProductDisRef : null}
                            id={reItem?.article_code}
                            style={{ maxWidth: "60px" }}
                          />
                          <span
                            className="input-group-text px-2"
                            id="basic-addon2"
                          >
                            %
                          </span>
                        </div>
                      </td>
                      <td>
                        {toDecimal(
                          itemVatTotal(
                            reItem?.vat ? reItem?.vat : 0,
                            reItem?.qty,
                            reItem?.mrp
                          )
                        )}
                      </td>
                      <td>
                        {toDecimal(
                          customDiscount(
                            reItem.discount ? reItem.discount : 0,
                            reItem.qty,
                            reItem.mrp
                          )
                        )}
                      </td>
                      <td>
                        <Icons.X
                          className="float-end"
                          onClick={() => removeFromCart(reItem)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="col-md-3 mt-2">
                    <label><b>Adjust</b></label>
                    <input
                        type="number"
                        className="form-control quantity"
                        onChange={(e) =>
                            handleTotalDiscount(e)
                        }
                        value={posSaleData?.discount}
                    />

                </div> */}
        <div className="col-md-12 mt-2">
          <div className="row">
            <div className="col-md-3 col-6">
              <b>Item No:</b> {posSaleData.returnCal.totalItem}
            </div>
            <div className="col-md-3  col-6">
              <b>Total:</b> {posSaleData.returnCal.total?.toFixed(2)}
            </div>
            <div className="col-md-3 col-6">
              <b>Gross Total:</b>{" "}
              {(posSaleData?.returnCal?.grossTotal).toFixed(2)}
            </div>
            <div className="col-md-3 col-6">
              <b>Round Total:</b> {posSaleData.returnCal.grossTotalRound}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="col-md-12 mt-2">
          <div className="row">
            <div className="col-md-3 mt-2">
              {/* <div className='d-flex'>
                                <b>Adjust: </b>
                                <input
                                    type="number"
                                    className="form-control quantity ms-1"
                                    onChange={(e) =>
                                        handleTotalDiscount(e)
                                    }
                                    value={posSaleData?.discount}
                                />
                            </div> */}
            </div>

            <div className="col-md-3  mt-2">
              <b>Return Amount: </b>
              {posSaleData.changeAmount}
            </div>
            <div className="col-md-2  mt-2"></div>
            <div className="col-md-4">
              <div className="d-flex">
                <Button
                  className="me-2"
                  variant="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  variant="dark"
                  onClick={() => {
                    console.log(
                      "Return Products: ",
                      posSaleData?.returnProducts
                    );
                    handleReturn();
                  }}
                >
                  Create Return
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Footer>
      <div className="print-wrapper pt-0 mt-0 pb-0">
        <div className=" print-area" ref={componentRef}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <p className="text-center">
                  <img
                    src={
                       logo
                    }
                    alt=""
                    width="180"
                    className="print-logo"
                  />
                </p>
                <h5 className="text-center">
                  <b>{storeSettings?.storeName || "Aamar Dokan"}</b>
                </h5>
                <p className="text-center info header">
                  <i>BIN {storeSettings?.binNumber} | Mushak 5</i>
                </p>
                <p className="text-center info invoice">
                  Invoice No: {posSaleData.invoiceId}
                </p>
                <p className="info pt-2">
                  Phone: {posSaleData.customerPhone}
                  <span className="float-end">
                    Date: {format(new Date(), "MMMM d, yyyy")}
                  </span>
                </p>

                <p className="info pt-2">
                  Customer: {posSaleData.customerName}
                  <span className="float-end">
                    {format(new Date(), "h:mm a")}
                  </span>
                </p>
                <p className="info pt-2">
                  Biller: {user.name}
                  <span className="float-end">
                    Outlet: <b>{whName}</b>
                  </span>
                </p>

                <p className="text-center pt-2 order_details">ORDER DETAILS</p>
                <table className="table px-2 d-flex-table">
                  <thead>
                    <tr>
                      <td>SL</td>
                      <td>Item</td>
                      <td colSpan="3">Qty</td>
                      <td>Rate</td>
                      <td>VAT</td>
                      <td>Discount</td>
                      <td>
                        <span className="float-end">Total</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {posSaleData?.returnProducts?.length > 0 && (
                      <>
                        <tr>
                          <th colSpan={3}>
                            <b>Return Products</b>
                          </th>
                          <td colSpan={6} className="text-end">
                            <b>Ref Invoice id:</b>
                            {posSaleData?.returnProducts?.returnInvoice}
                          </td>
                        </tr>
                        {posSaleData?.returnProducts?.map((item, i) => (
                          <tr className="d-print-table-row" key={item.id}>
                            <td>{i + 1}</td>
                            <td
                              style={{
                                textTransform: "capitalize",
                                fontSize: ".7em",
                              }}
                            >
                              {item?.name.toLowerCase().substring(0, 30)}
                              {item?.name?.length > 30 ? "..." : ""}
                            </td>
                            <td colSpan="3">{item?.qty}</td>
                            <td>
                              {" "}
                              {toDecimal(
                                customDiscount(
                                  item.discount ? item.discount : 0,
                                  item.qty,
                                  item.tp
                                )
                              )}
                            </td>
                            <td>
                              --
                              {/* {itemVat(
                                item?.qty && item?.vat,
                                item?.qty,
                                item?.mrp
                              ).toFixed(2)} */}
                            </td>
                            <td>--</td>
                            <td>
                              <span className="float-end">
                                {toDecimal(
                                  customDiscount(
                                    item.discount ? item.discount : 0,
                                    item.qty,
                                    item.tp
                                  )
                                )}
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
                {posSaleData?.returnCal?.totalItem > 0 && (
                  <p className="bill-info border-bottom border-bottom-dashed">
                    Return Item:{" "}
                    <span className="float-end">
                      {posSaleData?.returnCal?.totalItem}
                    </span>
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
                </p>
                {/* <p className="bill-info border-bottom border-bottom-dashed">
                                    Vat:{" "}
                                    <span className="float-end">
                                        {" "}
                                        {parseFloat(
                                            posSaleData.vat - posSaleData.returnCal.vat
                                        )?.toFixed(2)} */}
                {/* {returnCal?.vatAmount > 0
                      ? posSaleData.vat - reCal?.vatAmount
                      : posSaleData.vat} */}
                {/* </span>
                                </p> */}
                {/* <p className="bill-info border-bottom border-bottom-dashed">
                                    Gross Total:{" "}
                                    <span className="float-end">
                                        {parseFloat(posSaleData.grossTotal)?.toFixed(2)}
                                    </span>
                                </p> */}
                <p className="bill-info border-bottom border-bottom-dashed">
                  Net Amount:{" "}
                  <span className="float-end border border-dark px-1">
                    {posSaleData.grossTotalRound}
                  </span>
                </p>
                {posSaleData?.paidAmount?.cash > 0 && (
                  <p className="bill-info border-bottom border-bottom-dashed">
                    Received Cash:
                    <span className="float-end">
                      {posSaleData?.paidAmount?.cash}
                    </span>
                  </p>
                )}
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
                  <span className="float-end">
                    {posSaleData?.totalReceived}
                  </span>
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
                  ******************************ধন্যবাদ******************************
                </p>
                <p className="text-center bar-code">
                  {/* {lastSale?.invoiceId && ( */}
                  {lastBillId && (
                    <Barcode
                      value={posSaleData.invoiceId}
                      height="60"
                      width="2"
                      fontSize="10"
                    />
                  )}
                  {/* )} */}
                </p>
                <p className="text-center info footer">
                  {storeSettings?.websiteUrl}
                </p>
                <p className="text-center info">
                  <b>Hot Line: {storeSettings?.phone}</b>
                </p>
                <p className="text-center info ">
                  <i>Thank you for shopping with us.</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VoidReturnModal;
