/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
// import { Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SelectBrand from "../Common/CustomSelect/selectBrand";
// import SelectMC from "../Common/CustomSelect/selectMC";
import SelectUnit from "../Common/CustomSelect/selectUnit";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
// import productPhoto from "../../product.jpg";
import {
  useAddProductMutation,
  useProductCountQuery,
  useProductLastQuery,
} from "../../services/productApi";
import { apiUniqueErrHandle } from "../Utility/Utility";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCheckSquare, BsPlusCircle, BsSquare } from "react-icons/bs";
import SelectGeneric from "../Common/CustomSelect/selectGeneric";
import SelectGroup from "../Common/CustomSelect/selectGroup";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import LoadingModal from "../Common/Modal/LoadingModal";
// import SelectBrandNew from "../Common/CustomSelect/selectBrandNew";
import { useDispatch, useSelector } from "react-redux";
import {
  alertQtyInput,
  discountInput,
  // inputMulti,
  inputName,
  inputProductCode,
  inputProductDetails,
  inputShippingMethod,
  maxQtyInput,
  minQtyInput,
  mrpInput,
  pcsBoxInput,
  productName,
  productNameSize,
  // productTypeInput,
  resetProductAdd,
  selectBrand,
  selectBrandName,
  selectCategory,
  selectDiscountType,
  selectGeneric,
  selectGroup,
  selectStatus,
  selectSubCategory,
  selectSupplier,
  selectType,
  selectUnit,
  selectVatMethod,
  sizeInput,
  tpInput,
  vatInput,
} from "../../features/productAddSlice";
import BrandAddModal from "../Common/Modal/BrandAddModal";
import GenericAddModal from "../Common/Modal/GenericAddModal";
import GroupAddModal from "../Common/Modal/GroupAddModal";
// import { productNumber } from "../Utility/generateProductNumber";
import axios from "../../services/apiClient";
import { format } from "date-fns";
import useKeypress from "react-use-keypress";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import PackageModal from "../Common/Modal/PackageModal";
import AlertService from "../Utility/AlertService";

const AddProduct = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.productAddReducer);
  const { register, handleSubmit, reset } = useForm({});
  const [gp, setGp] = useState("");
  const [gn, setGn] = useState("");
  const [bn, setBn] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  // const [scValue, setScValue] = useState("");
  // const [brand, setBrand] = useState([]);
  // const [unit, setUnit] = useState([]);
  const [addProduct] = useAddProductMutation();
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  const groupRef = useRef(null);

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  const [groupShow, setGroupShow] = useState(false);
  const handleGroupClose = () => setGroupShow(false);

  const [genericShow, setGenericShow] = useState(false);
  const handleGenericClose = () => setGenericShow(false);

  const [brandShow, setBrandShow] = useState(false);
  const handleBrandClose = () => setBrandShow(false);
  const [profit, setProfit] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const [isArticleEditable, setIsArticleEditable] = useState(false);
  const isArticleEditedRef = useRef(false);
  const lastCodeRef = useRef("");

  const { data: lastProduct, isSuccess, refetch: refetchLast } = useProductLastQuery();
  const { data: countData } = useProductCountQuery({ aamarId });

  useKeypress("F1", (e) => {
    e.preventDefault();
    groupRef.current.focus();
  });

  useEffect(() => {
    refetchLast();
  }, []);

  useEffect(() => {
    if (lastProduct) {
      generateNumber(lastProduct);
    }
  }, [lastProduct, isSuccess]);

  useEffect(() => {
    if (productData?.mrp > 0 && productData?.tp > 0) {
      const profitAmount = productData?.mrp - productData?.tp; // Difference between MRP and TP
      const profitMargin = (profitAmount / productData?.tp) * 100; // Calculate profit percentage
      setProfit(profitMargin?.toFixed(2)); // Set the profit rounded to two decimal places
    } else {
      setProfit(0); // Set to 0 if MRP or TP is invalid
    }
  }, [productData?.mrp, productData?.tp]);


  useEffect(() => {
    generateName();
  }, [productData?.brandName, productData?.size, productData?.product_type]);

  const generateNumber = (sourceLastProduct) => {
    if (isArticleEditedRef.current) return;

    const prod = sourceLastProduct || lastProduct;
    const lastCode = (prod?.[0]?.article_code || lastCodeRef.current || "")?.toString();

    const date = format(new Date(new Date()), "yyyyMMdd");
    let productCode = "";

    if (lastCode && lastCode.length >= 8) {
      const firstEight = lastCode.substring(0, 8);
      const lastSix = lastCode.substring(lastCode.length - 6);

      if (date === firstEight && !isNaN(parseInt(lastSix))) {
        const nextNumber = parseInt(lastSix) + 1;
        const nextNumberString = nextNumber?.toString().padStart(6, "0");
        productCode = date + nextNumberString;
      } else {
        productCode = date + "000001";
      }
    } else {
      productCode = date + "000001";
    }

    lastCodeRef.current = productCode;
    console.log("produtCode", productCode);
    dispatch(inputProductCode(productCode));
    return productCode;
  };
  const generateName = () => {
    const parts = [
      productData?.brandName,
      productData?.size,
      productData?.product_type,
    ].filter(Boolean);
    const name = parts.join(" ");
    dispatch(inputName(name));
  };

  const isValidValue = (val) => {
    if (!val) return false;
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (!trimmed || trimmed === "please select") return false;
    }
    return true;
  };

  const validateProductFields = () => {
    const missing = [];
    const groupVal = gp || productData?.group;
    if (!isValidValue(groupVal)) {
      missing.push("Group");
    }

    const genericVal = gn || productData?.generic;
    if (!isValidValue(genericVal)) {
      missing.push("Generic Name");
    }

    const brandVal = bn || productData?.brand;
    if (!isValidValue(brandVal)) {
      missing.push("Brand");
    }

    const sizeVal = productData?.size;
    if (!isValidValue(sizeVal)) {
      missing.push("Size");
    }

    const nameVal = productData?.name;
    if (!isValidValue(nameVal)) {
      missing.push("Product Name");
    }

    if (missing.length > 0) {
      notify(`Please fill required fields: ${missing.join(", ")}`, "error");
      return false;
    }

    return true;
  };

  const handleMultiProductAdd = async () => {
    if (!validateProductFields()) {
      return;
    }
    console.log("productData", productData);
    setLoader(true);
    try {
      const response = await addProduct({
        ...productData,
        supplier: selectedSupplier,
        aamarId,
      });
      if (response) {
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          const addedCode = response?.data?.product?.article_code || productData?.article_code;
          if (dispatch(resetProductAdd())) {
            isArticleEditedRef.current = false;
            setIsArticleEditable(false);
            dispatch(selectGroup(response?.data?.product?.group));
            dispatch(selectGeneric(response?.data?.product?.generic));
            dispatch(selectBrand(response?.data?.product?.brand));
            if (selectedSupplier) {
              dispatch(selectSupplier(selectedSupplier));
            }
            const brandName = await axios.get(
              `${BASE_URL}/brand/${response?.data?.product?.brand}`
            );
            dispatch(selectBrandName(brandName?.data?.name));
            dispatch(productName(brandName?.data?.name));
            notify("Product Add Successfully", "success");
          }
          generateNumber([{ article_code: addedCode }]);
          refetchLast();
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handelAddProduct = async (data) => {
    if (!validateProductFields()) {
      return;
    }
    setLoader(true);
    try {
      const response = await addProduct({
        ...productData,
        supplier: selectedSupplier,
        aamarId,
      });
      if (response) {
        if (response?.error) {
          apiUniqueErrHandle(response);
          notify("Product addition failed", "error");
        } else {
          const addedCode = response?.data?.product?.article_code || productData?.article_code;
          dispatch(resetProductAdd());
          reset();
          setGp("");
          setGn("");
          setBn("");
          setSelectedSupplier(null);
          setProfit(0);
          setResetKey((prev) => prev + 1);
          isArticleEditedRef.current = false;
          setIsArticleEditable(false);
          AlertService.alert("Success", "Product added successfully");
          generateNumber([{ article_code: addedCode }]);
          refetchLast();
        }
      }
    } catch (err) {
      console.log(err);
      notify("An error occurred while adding the product", "error");
    } finally {
      setLoader(false);
    }
  };
  const handleProductPageExit = () => {
    dispatch(resetProductAdd());
    navigate("/product");
  };

  // SUPPLIER SELECT HANDLE
  const handleOnchangeSupplier = (e) => {
    if (e && e.option) {
      setSelectedSupplier(e.option);
      dispatch(selectSupplier(e.option));
    } else {
      setSelectedSupplier(null);
      dispatch(selectSupplier(null));
    }
  };
  const handleOnchangeMasterCategory = (e) => {
    // console.log("e", e);
  };
  const handleOnchangeGroup = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectGroup(e.value));
      setGp(e.value);
    } else {
      dispatch(selectGroup(null));
      setGp("");
    }
  };
  const handleOnchangeGeneric = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectGeneric(e.value));
      setGn(e.value);
    } else {
      dispatch(selectGeneric(null));
      setGn("");
    }
  };
  const handleOnchangeBrand = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectBrand(e.value));
      dispatch(selectBrandName(e.label));
      dispatch(productName(e.label));
      setBn(e.value);
    } else {
      dispatch(selectBrand(null));
      dispatch(selectBrandName(""));
      dispatch(productName(""));
      setBn("");
    }
  };
  const handleOnchangeCategory = (e) => {
    console.log("Selected Category:", e); // Logging to check the value
    if (e !== null) {
      dispatch(selectCategory(e.value)); // Action to select category
    } else {
      dispatch(selectCategory(null)); // Action when null is passed
    }
  };
  const handleOnchangeSubCategory = (e) => {
    console.log("e", e);
    if (e !== null) {
      dispatch(selectSubCategory(e.value));
    } else {
      dispatch(selectSubCategory(null));
    }
  };

  const handleOnchangeUnit = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectUnit(e.value));
    } else {
      dispatch(selectUnit(null));
    }
  };

  const handleProductSize = (e) => {
    dispatch(sizeInput(e.target.value));
    dispatch(productNameSize(e.target.value));
  };

  return (
    <div>
      <div className="container-fluid">
        <LoadingModal
          title={"Please Wait"}
          onShow={loader}
          handleClose={handleLoaderClose}
        ></LoadingModal>
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mb-4">
            <Header title="Add New Product"></Header>
            <div className="row">
              <div className="col-md-12">
                <form
                  onSubmit={handleSubmit(handelAddProduct)}
                  className="mt-4"
                >
                  {/* 1st row */}
                  <div className="row">
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="group" className="form-label">
                          Group <span className="text-danger">*</span>
                        </label>
                        <SelectGroup
                          key={`group_${resetKey}`}
                          gp={gp}
                          groupRef={groupRef}
                          required
                          handleOnchange={(e) => {
                            handleOnchangeGroup(e);
                          }}
                        ></SelectGroup>
                        <BsPlusCircle onClick={() => setGroupShow(true)} />{" "}
                        <span>Add new Group ??</span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="generic" className="form-label">
                          Generic Name <span className="text-danger">*</span>
                        </label>
                        <SelectGeneric
                          key={`generic_${resetKey}`}
                          gn={gn}
                          required
                          handleOnchange={(e) => {
                            handleOnchangeGeneric(e);
                          }}
                        ></SelectGeneric>
                        <BsPlusCircle onClick={() => setGenericShow(true)} />{" "}
                        <span>Add new Generic ??</span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="brand" className="form-label">
                          Brand <span className="text-danger">*</span>
                        </label>
                        <SelectBrand
                          key={`brand_${resetKey}`}
                          bn={bn}
                          required
                          handleOnchange={(e) => {
                            handleOnchangeBrand(e);
                          }}
                        ></SelectBrand>
                        <BsPlusCircle onClick={() => setBrandShow(true)} />{" "}
                        <span>Add new Brand ??</span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="p_size" className="form-label">
                          Size <span className="text-danger">*</span>
                        </label>
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              placeholder="Size"
                              className="form-control"
                              id="p_size"
                              required
                              aria-describedby="sizeHelp"
                              value={productData?.size || ""}
                              onChange={(e) => {
                                handleProductSize(e);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 2nd row */}
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="supplier">
                          Supplier
                        </label>
                        <SelectSupplier
                          key={`supplier_${resetKey}`}
                          sp={selectedSupplier}
                          handleOnchange={handleOnchangeSupplier}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_name">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          placeholder="Product name"
                          className="form-control"
                          id="p_name"
                          required
                          aria-describedby="nameHelp"
                          value={productData?.name || ""}
                          onChange={(e) => dispatch(inputName(e.target.value))}
                        />
                        <div id="nameHelp" className="form-text">
                          Product Name with pack size
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_article_code">
                          Article Code
                        </label>
                        <input
                          placeholder="Article Code"
                          className="form-control "
                          id="p_article_code"
                          aria-describedby="article_codeHelp"
                          value={productData?.article_code || ""}
                          onChange={(e) => {
                            isArticleEditedRef.current = true;
                            dispatch(inputProductCode(e.target.value));
                          }}
                          onClick={() => setIsArticleEditable(true)}
                          onFocus={() => setIsArticleEditable(true)}
                          readOnly={!isArticleEditable}
                          style={{ cursor: isArticleEditable ? "text" : "pointer" }}
                          title="Click to edit Article Code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3rd row */}
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="masterCategory" className="form-label">
                          Unit
                        </label>

                        <SelectUnit
                          key={`unit_${resetKey}`}
                          ut={productData?.unit}
                          handleOnchange={(e) => {
                            handleOnchangeUnit(e);
                          }}
                        ></SelectUnit>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_type">
                          Pieces in Box
                        </label>
                        <input
                          placeholder="PCs in Box"
                          className="form-control"
                          id="p_name"
                          aria-describedby="nameHelp"
                          value={productData?.pcsBox || ""}
                          onChange={(e) => {
                            dispatch(pcsBoxInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 ">
                      <div className="mb-3  ">
                        <label className="form-label" htmlFor="p_article_code">
                          Type
                        </label>
                        <select
                          {...register("type")}
                          className="form-select  "
                          id="type"
                          placeholder="type"
                          value={productData?.type || "LOCAL"}
                          onChange={(e) => {
                            dispatch(selectType(e.target.value));
                          }}
                        >
                          <option value="LOCAL">local</option>
                          <option value="FOREIGN">Foreign</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 4rd row  */}
                  <div className="row">
                    <div className="col-md-2">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_type">
                          TP
                        </label>
                        <input
                          placeholder="TP"
                          className="form-control"
                          id="p_name"
                          aria-describedby="nameHelp"
                          value={productData?.tp ?? ""}
                          onChange={(e) => {
                            dispatch(tpInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_type">
                          MRP
                        </label>
                        <input
                          placeholder="MRP"
                          className="form-control"
                          id="p_name"
                          aria-describedby="nameHelp"
                          value={productData?.mrp ?? ""}
                          onChange={(e) => {
                            dispatch(mrpInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_type">
                          Profit
                        </label>
                        <div className="input-group mb-3">
                          <input
                            placeholder="Profit"
                            className="form-control"
                            id="p_name"
                            aria-describedby="nameHelp"
                            value={profit}
                            disabled
                          />
                          <span className="input-group-text p-1" id="basic-addon2">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_type">
                          Max Order Qty
                        </label>
                        <input
                          placeholder="Max Order Qty"
                          className="form-control"
                          id="p_name"
                          aria-describedby="nameHelp"
                          value={productData?.maxQty ?? ""}
                          onChange={(e) => {
                            dispatch(maxQtyInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_type">
                          Min Order Qty
                        </label>
                        <input
                          placeholder="Min Order Qty"
                          className="form-control"
                          id="p_name"
                          aria-describedby="nameHelp"
                          value={productData?.minQty ?? ""}
                          onChange={(e) => {
                            dispatch(minQtyInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_type">
                          Alert Qty
                        </label>
                        <input
                          placeholder="Alert Qty"
                          className="form-control"
                          id="p_name"
                          aria-describedby="nameHelp"
                          value={productData?.alert_qty ?? ""}
                          onChange={(e) => {
                            dispatch(alertQtyInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5th row  */}
                  <div className="row">
                    <div className="col-md-2">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_vat">
                          VAT
                        </label>
                        <input
                          placeholder="VAT"
                          className="form-control"
                          id="p_vat"
                          value={productData?.vat ?? ""}
                          aria-describedby="vatHelp"
                          onChange={(e) => {
                            dispatch(vatInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_vat_method">
                          Vat Method
                        </label>
                        <select
                          className="form-select"
                          value={productData?.vat_method ? "true" : "false"}
                          onChange={(e) => {
                            dispatch(selectVatMethod(e.target.value));
                          }}
                        >
                          <option value="true">Include</option>
                          <option value="false">Exclude</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_shipping">
                          Shipping Method
                        </label>
                        <select
                          className="form-select"
                          value={productData?.shipping_method || "cod"}
                          onChange={(e) => {
                            dispatch(inputShippingMethod(e.target.value));
                          }}
                        >
                          <option value="cod">COD</option>
                          <option value="free">Free Shipping</option>
                          <option value="uttara">Inside Uttara</option>
                        </select>
                        <div id="shippingHelp" className="form-text">
                          What is the delivery method?
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_vat">
                          Discount
                        </label>
                        <div className="row">
                          <div className="col-md-10">
                            <input
                              placeholder="Discount"
                              className="form-control ml-5"
                              id="p_vat"
                              aria-describedby="Discount"
                              value={productData?.discount ?? ""}
                              onChange={(e) => {
                                dispatch(discountInput(e.target.value));
                              }}
                            />
                          </div>
                          <div className="col-md-2">
                            {productData?.discount_type === false ? (
                              <BsSquare
                                onClick={() =>
                                  dispatch(selectDiscountType(true))
                                }
                              />
                            ) : (
                              <BsCheckSquare
                                onClick={() =>
                                  dispatch(selectDiscountType(false))
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_shipping">
                          Status
                        </label>
                        <select
                          className="form-select"
                          value={productData?.status || "active"}
                          onChange={(e) => {
                            dispatch(selectStatus(e.target.value));
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 6th row */}
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3 ">
                        <label
                          className="form-label"
                          htmlFor="p_product_details"
                        >
                          Product Description
                        </label>
                        <textarea
                          placeholder="Product Description"
                          className="form-control"
                          id="p_product_details"
                          aria-describedby="product_detailsHelp"
                          value={productData?.details}
                          onChange={(e) => {
                            dispatch(inputProductDetails(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="reset"
                    onClick={() => {
                      dispatch(resetProductAdd());
                      reset();
                      setGp("");
                      setGn("");
                      setBn("");
                      setSelectedSupplier(null);
                      setProfit(0);
                      setResetKey((prev) => prev + 1);
                      isArticleEditedRef.current = false;
                      setIsArticleEditable(false);
                      generateNumber(lastProduct);
                    }}
                    className="btn btn-dark col-4 col-md-2 m-1"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleMultiProductAdd();
                    }}
                    className="btn btn-dark  col-md-2 m-1"
                  >
                    Add Multi Product
                  </button>
                  <input
                    type="submit"
                    className="btn btn-dark col-4 col-md-2 m-1"
                    value="Add Product"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GroupAddModal
        onShow={groupShow}
        setOnShow={setGroupShow}
        handleClose={handleGroupClose}
      ></GroupAddModal>
      <GenericAddModal
        onShow={genericShow}
        setOnShow={setGenericShow}
        handleClose={handleGenericClose}
      ></GenericAddModal>
      <BrandAddModal
        onShow={brandShow}
        setOnShow={setBrandShow}
        handleClose={handleBrandClose}
      ></BrandAddModal>
    </div>
  );
};

export default AddProduct;
