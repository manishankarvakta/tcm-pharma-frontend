import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
// import ProductSearch from "../Common/ProductSearch/ProductSearch";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
import AlertService from "../Utility/AlertService";
// import { useForm } from "react-hook-form";
// import * as Icons from "heroicons-react";
// import CsvImporter from "../Common/CsvImporter/CsvImporter";
import { Toaster } from "react-hot-toast";
import { notify } from "../Utility/Notify";
// import usePurchase from "../Hooks/usePurchase";
// import useRtvCarts from "../Hooks/useRtv";
import axios from "../../services/apiClient";
import { signInUser } from "../Utility/Auth";
// import useInventory from "../Hooks/useInventory";
import { AiOutlineClose } from "react-icons/ai";
import { BsArchive, BsCheckSquare, BsSquare } from "react-icons/bs";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import WareHouseDWPurchase from "../Common/CustomSelect/WareHouseDWPurchase";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetRtv,
  selectCalculation,
  selectNote,
  selectProducts,
  selectSupplier,
  selectUser,
  selectWareHouse,
} from "../../features/rtvSlice";
import { useAddRtvMutation, useRtvCountQuery } from "../../services/rtvApi";
import { apiUniqueErrHandle } from "../Utility/Utility";
// import SelectPriceGrn from "../Common/CustomSelect/ScelectPriceGrn";
import CsvPurchaseProduct from "../Common/CsvImporter/CsvPurchaseProduct";
import SelectGrnAccount from "../Common/CustomSelect/SelectGrnAccount";
import LoadingModal from "../Common/Modal/LoadingModal";
import useRtv from "../Hooks/useRtv";
// import { usePurchaseSupplierAccountQuery } from "../../services/purchasApi";
import { useGrnBySupplierQuery } from "../../services/grnApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import PackageModal from "../Common/Modal/PackageModal";
// import { ImEyeMinus } from "react-icons/im";

const PurchaseCreate = () => {
  let i = 1;
  let j = 1;
  let navigate = useNavigate();
  // const purchaseCart = JSON.parse(localStorage.getItem("rtvCart"));
  const [addRtv] = useAddRtvMutation();
  const [supplier, setSupplier] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [isPO, setIsPO] = useState(false);
  const [isGRN, setIsGRN] = useState(false);

  const [isShowPO, setIsShowPO] = useState(false);
  const [isShowGrn, setIsShowGrn] = useState(false);
  // const [whName, setWhName] = useState("TCM");
  const [poInfo, setPoInfo] = useState({});
  const [grnInfo, setGrnInfo] = useState({});
  const [supplierId, setSupplierId] = useState("");
  // const [isFull, setIsFull] = useState(false);

  const dispatch = useDispatch();
  const rtvData = useSelector((state) => state.rtvReducer);
  // const [calcTotal, setCalcTotal] = useState([]);
  const user = signInUser();
  const { aamarId } = user;
  // console.log("user", user);
  const lang = useSelector((state) => state.languageReducer);

  const [wh, setWh] = useState("");
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const [filteredProduct, setFilteredProduct] = useState(
    supplier.products || []
  );

  // console.log(rtvData);
  const { totalItems } = useRtv();

  const { totalItem, total } = totalItems(rtvData.products);

  // const { data: po, isSuccess: poIsSuccess, refetch: poRefetch } = usePurchaseSupplierAccountQuery(`${supplierId}`);
  const {
    data: grn,
    isSuccess: grnIsSuccess,
    refetch: grnRefetch,
  } = useGrnBySupplierQuery(`${supplierId}`);

  useEffect(() => {
    dispatch(selectCalculation({ totalItem, total }));
  }, [totalItem, total]);

  useEffect(() => {
    // poRefetch()
    grnRefetch();
  }, [supplierId]);
  const [whName, setWhName] = useState("TCM");

  const { data: warehouseData, refetch: whRefetch } = useWarehouseQuery(
    user?.warehouse
  );
  const { data: countData } = useRtvCountQuery({ aamarId });
  useEffect(() => {
    if (user?.warehouse) {
      whRefetch();
    }
  }, [user?.warehouse, whRefetch]);
  useEffect(() => {
    if (warehouseData) {
      setWhName(warehouseData?.name);
      whRefetch();
    }
  }, [warehouseData, whRefetch]);
  console.log("warehouse", warehouseData);
  // SUBMIT RTV
  const handleBillSubmit = async (e) => {
    // e.preventdefault();

    const response = await addRtv({ ...rtvData, aamarId });

    if (response) {
      // console.log(response);
      if (response?.error) {
        apiUniqueErrHandle(response);
        notify("Please Select All Fields", "error");
      } else {
        let newIn = [];
        // console.log(response?.data?.data?.products);
        if (response?.data?.data?.products?.length > 0) {
          response?.data?.data?.products?.map(async (pro) => {
            // const updateInventory = await updateInventoryOUTOnRTVIn(
            //   response?.data?.data?.products
            // );
            newIn = [
              ...newIn,
              {
                article_code: pro?.article_code,
                qty: pro?.qty,
                aamarId: aamarId,
                warehouse: user?.warehouse,
                tp: pro?.tp,
                name: pro?.name,
              },
            ];
            // console.log(pro);
          });

          // const updateInventory = await updateInventoryOUTOnRTVIn(newIn);
          // console.log(updateInventory)
          notify(response?.data?.message, "success");
          dispatch(resetRtv());
          setSupplier({});
          return navigate("/rtv");
        }
      }
    }
  };

  // SELECT SUPPLIER
  const handleVendorChange = async (value) => {
    console.log(value.option);

    const warehouseParam = wh || user?.warehouse || "";
    const result = await axios.get(
      `${BASE_URL}/supplier/${value.option}?warehouse=${warehouseParam}`
    );
    // setPurchase({ value.option });
    console.log("RTV DATA::>", result.data.productDetails);
    setSupplierProducts(result.data.productDetails);
    setFilteredProduct(result.data.productDetails);
    setSupplier(result.data);
    setSupplierId(value.option);
    dispatch(selectSupplier(result.data._id));
    dispatch(selectUser(user.id));
    dispatch(selectProducts([]));
    // poRefetch()
    grnRefetch();
    setIsPO(false);
    setIsGRN(false);
  };

  const handleOnchangeWareHouse = async (e) => {
    setWh(e.option);
    dispatch(selectWareHouse(e.option));
    if (supplierId) {
      try {
        const result = await axios.get(
          `${BASE_URL}/supplier/${supplierId}?warehouse=${e.option}`
        );
        setSupplierProducts(result.data.productDetails);
        setFilteredProduct(result.data.productDetails);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // POS Cart

  const emptyCart = async () => {
    const confirmed = await AlertService.confirm("Refresh Cart?", "Start New RTV?");
    if (confirmed) {
      dispatch(selectProducts([]));
    } else {
      console.log("Refresh Operation Cancelled by POSER");
    }
  };

  // console.log(purchaseView)

  const handleSelectItem = (id) => {
    // console.log(id);
    // console.log(supplier);
    let newList = [];
    const selected = supplier?.productDetails.find((p) => p.id === id);
    // console.log(selected);
    if (rtvData.products.length > 0) {
      const exist = rtvData?.products.find((p) => p.id === id);
      const rest = rtvData?.products.filter((p) => p.id !== id);
      if (exist) {
        // newList = [...rtvData.products];
        // dispatch(selectProducts(newList));
        notify("Products Already Selected", "error");
      } else {
        notify("Products is Selected", "success");
        newList = [
          ...rest,
          {
            id: selected?.id,
            article_code: selected?.article_code,
            tp: selected?.tp,
            newPrice: false,
            name: selected?.name,
            mrp: selected?.mrp,
            aamarId: aamarId,
            warehouse: user?.warehouse,
            tax: 0,
            qty: 1,
            unit: selected?.unit,
            discount: 0,
            order: rtvData.products.length + 1,
          },
        ];
        dispatch(selectProducts(newList));
      }

      // console.log(rtvData.products, supplier.products);
    } else {
      newList = [
        {
          id: selected?.id,
          article_code: selected?.article_code,
          tp: selected?.tp,
          newPrice: false,
          name: selected?.name,
          mrp: selected?.mrp,
          aamarId: aamarId,
          warehouse: user?.warehouse,
          tax: 0,
          qty: 1,
          unit: selected?.unit,
          discount: 0,
          order: rtvData.products.length + 1,
        },
      ];
      dispatch(selectProducts(newList));
    }
  };

  // HANDLE CUSTOM QTY
  const handleCustomQty = (e, id) => {
    const customQty = e.target.value !== "" ? e.target.value : 0;

    const item = rtvData.products.find((p) => p.id === id);
    const remain = rtvData.products.filter((p) => p.id !== id);
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
        dispatch(selectProducts(newGrn));
        // setIsFull(false);
      }
    }
  };

  const removeFromGrn = (id) => {
    const remain = rtvData.products.filter((p) => p.id !== id);
    dispatch(selectProducts(remain));
    notify("Product Removed", "error");
    // setIsFull(false);
  };

  const handleSearch = (q) => {
    // console.log(q);
    if (q.length > 0) {
      const re = new RegExp(q, "i");
      const filtered = supplierProducts.filter((entry) =>
        Object.values(entry).some(
          (val) => typeof val === "string" && val.match(re)
        )
      );

      setFilteredProduct(filtered);
      // console.log("Original:", supplierProducts);
      // console.log("filter:", filtered);
    } else {
      setFilteredProduct(supplierProducts);
    }
  };
  const handleImportButton = async () => {
    let importProducts = [];
    let i = 1;
    // console.log("csv", csvData);
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
                  id: data?.id,
                  article_code: data?.article_code,
                  tp: data?.tp > 0 ? data?.tp : 0,
                  mrp: data?.mrp > 0 ? data?.mrp : 0,
                  name: data?.name,
                  aamarId: aamarId,
                  warehouse: user?.warehouse,
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
            // console.log(importProducts);
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
    // console.log(importProducts);
  };

  const handleDeSelectIsPO = () => {
    setIsPO(false);
    setIsShowPO(false);
  };
  const handleIsPO = () => {
    setIsPO(true);
    if (isGRN === true) {
      setIsGRN(false);
    }
  };
  const handleDeselectIsGRN = () => {
    setIsGRN(false);
    setIsShowGrn(false);
  };
  const handleIsGRN = () => {
    setIsGRN(true);
    if (isPO === true) {
      setIsPO(false);
    }
  };

  const handlePOChange = (e) => {
    // console.log(e);
    setPoInfo(e.po);
    setIsShowPO(true);
    setIsShowGrn(false);
    dispatch(selectProducts(e.po.products));
  };
  const handleGRNChange = (e) => {
    // console.log(e);
    if (e && e.option) {
      setGrnInfo(e.grn);
      setIsShowGrn(true);
      setIsShowPO(false);
      dispatch(selectProducts(e.grn.products));
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
            <Header title={lang?.createNewRTV}></Header>

            <Form className="pt-3">
              <div className="row">
                <div className="col-md-1 col-2">
                  <b>GRN </b>
                  <br />
                  {isGRN ? (
                    <BsCheckSquare onClick={() => handleDeselectIsGRN()} />
                  ) : (
                    <BsSquare onClick={() => handleIsGRN()} />
                  )}
                </div>

                <div className="col-md-5 col-10">
                  <Form.Group controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    {user.type !== "admin" ? (
                      <p>{whName}</p>
                    ) : (
                      <WareHouseDWPurchase
                        id="warehouse"
                        name="warehouse"
                        handleOnChange={handleOnchangeWareHouse}
                        defaultValue={whName}
                      />
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="">
                    <Form.Label>Supplier</Form.Label>
                    <SelectSupplier
                      supplier_code={supplier._id}
                      // setPurchase={setPurchase}
                      handleOnchange={handleVendorChange}
                    // {...setValue("supplier", `${supplierProductId}`)}
                    // {...register("supplier_code", { required: true })}
                    ></SelectSupplier>
                  </Form.Group>
                </div>
                <div className="col-md-4 mb-3">
                  {isGRN ? (
                    <div className="col-12">
                      <Form.Group className="" controlId="warehouse">
                        <Form.Label>GRN NO</Form.Label>
                        <SelectGrnAccount
                          data={grn}
                          isSuccess={grnIsSuccess}
                          handleVendorChange={handleGRNChange}
                        ></SelectGrnAccount>
                      </Form.Group>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-md-8 mb-3">
                  <CsvPurchaseProduct
                    title="Supplier Product"
                    setCsvData={setCsvData}
                    handleImportButton={handleImportButton}
                  />
                </div>
                <div className="col-md-8 mb-3">
                  <div className="row">
                    {/* {
                      isPO ? <div className="col-12">
                        <Form.Group className="" controlId="warehouse">
                          <Form.Label>Purchase NO</Form.Label>
                          <SelectPurchaseAccount
                            data={po}
                            isSuccess={poIsSuccess}
                            handleVendorChange={handlePOChange}
                          ></SelectPurchaseAccount>
                        </Form.Group>
                      </div> : <></>
                    } */}
                  </div>
                </div>
                {/* <div className="col-6">
                  <Form.Group className="" {...register("attached_doc")}>
                    <Form.Label>Attached Documents</Form.Label>
                    <input type="file" className="from-control" name="" />
                  </Form.Group>
                </div> */}
                <div className="container">
                  <div className="row">
                    <div className="col-md-5">
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
                          <div
                            className="mx-2"
                            style={{
                              overflowY: "scroll",
                              display: "block",
                              maxHeight: "220px",
                            }}
                          >
                            <Table className="mt-3 table-responsive w-100">
                              <thead>
                                <tr>
                                  {/* <th>Code</th> */}
                                  <th>#</th>
                                  <th>Name</th>
                                  <th>Stock</th>
                                  <th className="px-4">TP</th>
                                  <th className="px-4">MRP</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredProduct?.length > 0 ? (
                                  filteredProduct?.map((item) => (
                                    <tr key={item?.article_code}>
                                      <td>{i++}</td>
                                      <td
                                        title={item?.article_code}
                                        className="text-warp"
                                      >
                                        {item?.name} - {item?.group?.name}
                                      </td>
                                      <td>
                                        {typeof item?.stock === "object"
                                          ? (item?.stock?.currentQty ?? 0)
                                          : (item?.stock ?? 0)}
                                      </td>
                                      <td className="px-4">{item?.tp}</td>
                                      <td className="px-4">{item?.mrp}</td>

                                      <td className="text-center">
                                        {/* <BsSquareHalf className="me-2" /> */}
                                        <BsArchive
                                          onClick={() =>
                                            handleSelectItem(item.id)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <th colSpan={8} className="text-center">
                                      {" "}
                                      Please Select a Supplier
                                    </th>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>
                        ) : (
                          <div
                            className="mx-2 "
                            style={{
                              overflowY: "scroll",
                              display: "block",
                              maxHeight: "220px",
                            }}
                          >
                            <Table className="mt-3 table-responsive">
                              <thead>
                                <tr>
                                  {/* <th>#</th> */}
                                  <th>Code</th>
                                  <th>Name</th>
                                  <th>Stock </th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th colSpan={8} className="text-center">
                                    {" "}
                                    Please Select a Supplier
                                  </th>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-7 mt-2 mt-md-0">
                      <div className="card ">
                        <Table className="">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Quantity</th>
                              <th>TP</th>
                              <th>MRP</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rtvData?.products?.length > 0 ? (
                              rtvData?.products
                                .slice()
                                ?.sort((a, b) => b.order - a.order)
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
                                          onChange={(e) =>
                                            handleCustomQty(e, item?.id)
                                          }
                                          value={item?.qty}
                                          defaultValue={item?.qty}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      {/* tp */}
                                      <input
                                        type="text"
                                        disabled={
                                          !item?.newPrice ? "disabled" : ""
                                        }
                                        className="form-control quantity"
                                        width="60%"
                                        id={item?.id}
                                        // onChange={(e) =>
                                        //   handleCustomTp(e, item?.id)
                                        // }
                                        value={parseFloat(item?.tp).toFixed(2)}
                                        defaultValue={parseFloat(
                                          item?.tp
                                        ).toFixed(2)}
                                      />
                                    </td>
                                    <td style={{ width: "120px" }}>
                                      {/* mrp */}

                                      <input
                                        type="text"
                                        className="form-control quantity"
                                        width="60%"
                                        id={item?.id}
                                        // onChange={(e) =>
                                        //   handleCustomMrp(e, item?.id)
                                        // }
                                        value={item?.mrp}
                                        defaultValue={parseFloat(
                                          item?.mrp
                                        ).toFixed(2)}
                                      />
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
                                  Please Select a Product to return
                                </th>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Group className="" controlId="formBasicEmail">
                      <Form.Label>Note</Form.Label>
                      <textarea
                        onChange={(e) => dispatch(selectNote(e.target.value))}
                        type="text"
                        className="form-control"
                        placeholder="Note"
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>

              <Button
                variant="dark"
                className="float-end my-2 mt-2"
                type="button"
                onClick={(e) => handleBillSubmit(e)}
              >
                Submit
              </Button>
              <Button
                variant="dark"
                className="float-end my-2 mx-2 mt-2"
                type="button"
                onClick={emptyCart}
              >
                Reset Cart
              </Button>

              <Table className="bordered striped ">
                <thead>
                  <tr>
                    <th>Items: {totalItem}</th>
                    <th>Total: {total}</th>
                    <th>Round Total:{Math.round(total)}</th>
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
