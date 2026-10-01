/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "../../services/apiClient";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { BsCheckSquare, BsPlusCircle, BsSquare } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  alertQtyInput,
  discountInput,
  inputAll,
  inputName,
  inputProductCode,
  inputProductDetails,
  inputShippingMethod,
  maxQtyInput,
  minQtyInput,
  mrpInput,
  pcsBoxInput,
  resetProductAdd,
  selectBrand,
  selectBrandName,
  selectCategory,
  selectDiscountType,
  selectGeneric,
  selectGroup,
  selectStatus,
  selectType,
  selectUnit,
  selectVatMethod,
  sizeInput,
  tpInput,
  vatInput,
} from "../../features/productAddSlice";
import { selectUpdateProduct } from "../../features/productPriceSlice";
import productPhoto from "../../product.jpg";
import {
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../services/productApi";
import SelectBrand from "../Common/CustomSelect/selectBrand";
import SelectGeneric from "../Common/CustomSelect/selectGeneric";
import SelectGroup from "../Common/CustomSelect/selectGroup";
import SelectUnit from "../Common/CustomSelect/selectUnit";
import Header from "../Common/Header/Header";
import BrandAddModal from "../Common/Modal/BrandAddModal";
import GenericAddModal from "../Common/Modal/GenericAddModal";
import GroupAddModal from "../Common/Modal/GroupAddModal";
import SideBar from "../Common/SideBar/SideBar";
import { notify } from "../Utility/Notify";

const UpdateProducts = () => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001/api";

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [pp, setPP] = useState("");
  const [profit, setProfit] = useState(0);

  const [fileName, setFileName] = useState("Upload Category Photo");
  const [file, setFile] = useState({});
  const [uploadFile, setUploadedFile] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [message, setMessage] = useState("");
  const [spp, setSpp] = useState({});
  // const [promoPriceID, setPromoPriceID] = useState("")

  const productData = useSelector((state) => state.productAddReducer);

  const [preLoadValue, setPreLoadValue] = useState({});
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductDetailsQuery(`${id}`);
  console.log("data", data); //currentQty
  const [priceModal, setPriceModal] = useState(false);

  console.log("Product Data", productData);

  const [gp, setGp] = useState("");
  const [gn, setGn] = useState("");
  const [bn, setBn] = useState("");
  const [cat, setCat] = useState("");
  const [sCat, setSCat] = useState("");
  const [sc, setSc] = useState("");
  const [unit, setUnit] = useState("");

  // console.log(data?.promo_type)
  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  const [groupShow, setGroupShow] = useState(false);
  const handleGroupClose = () => setGroupShow(false);

  const [genericShow, setGenericShow] = useState(false);
  const handleGenericClose = () => setGenericShow(false);

  const [brandShow, setBrandShow] = useState(false);
  const handleBrandClose = () => setBrandShow(false);
  // console.log(data);
  // console.log("pp", pp);
  // console.log(data?.promo_price?.mrp);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (data) {
      const sanitizedName = data?.name ? data.name.replace(/\s+/g, " ") : "";
      dispatch(inputAll({ ...data, name: sanitizedName }));
      setUploadedFile({
        fileName: sanitizedName,
        filePath: data?.photo ? data?.photo : productPhoto,
      });
    }
  }, [data, dispatch]);
  // console.log(uploadFile);
  useEffect(() => {
    setGp(productData?.group?._id);
    setGn(productData?.generic);
    setBn(productData?.brand);
    setCat(productData?.category);
    setSCat(productData?.subCategory);
    setUnit(productData?.unit);
  }, [productData]);

  const [updateProduct] = useUpdateProductMutation();

  const handelUpdateProduct = async (data) => {
    console.log("data form", data);

    const response = await updateProduct(productData);

    if (response) {
      // console.log(response);
      notify("Product Update Successful!");
      navigate("/product");
    }
  };

  const handleProductPhoto = async (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const handleProductPhotoUpload = async (e) => {
    e.preventDefault();
    console.log(e);
    const formData = new FormData();
    formData?.append("file", file);
    console.log(file);
    try {
      const res = await axios.post(
        `${BASE_URL}/product/upload/${id}`,
        formData,
        {
          "Content-type": "multipart/form-data",
        }
      );

      const { fileName, filePath } = res.data;
      dispatch(selectUpdateProduct(filePath));
    } catch (err) {
      if (err.response.status === 500) {
        console.log(
          "There was an problem with the server",
          err.response.data?.message
        );
      } else {
        console.log(err.response.data?.message);
      }
    }
  };

  const handleOnchangeGroup = (e) => {
    console.log("e", e);
    if (e !== null) {
      dispatch(selectGroup(e.value));
    } else {
      dispatch(selectGroup(null));
    }
  };
  const handleOnchangeGeneric = (e) => {
    console.log("e", e);
    if (e !== null) {
      dispatch(selectGeneric(e.value));
    } else {
      dispatch(selectGeneric(null));
    }
  };
  const handleOnchangeBrand = (e) => {
    console.log("e", e);
    if (e !== null) {
      dispatch(selectBrand(e.value));
      dispatch(selectBrandName(e.label));
    } else {
      dispatch(selectBrand(null));
      dispatch(selectBrandName(""));
    }
  };
  const handleOnchangeCategory = (e) => {
    console.log("e", e);
    if (e !== null) {
      dispatch(selectCategory(e.option));
      setSc(e.code);
    } else {
      dispatch(selectCategory(null));
      setSc(null);
    }
  };
  const handleOnchangeSubCategory = (e) => {
    console.log("e", e);
    if (e !== null) {
      dispatch(selectCategory(e.option));
    } else {
      dispatch(selectCategory(null));
    }
  };
  const handleOnchangeUnit = (e) => {
    console.log("e", e);
    if (e !== null) {
      dispatch(selectUnit(e.option));
    } else {
      dispatch(selectUnit(null));
    }
  };

  useEffect(() => {
    if (productData?.mrp > 0 && productData?.tp > 0) {
      const profitAmount = productData?.mrp - productData?.tp; // Difference between MRP and TP
      const profitMargin = (profitAmount / productData?.tp) * 100; // Calculate profit percentage
      setProfit(profitMargin?.toFixed(2)); // Set the profit rounded to two decimal places
    } else {
      setProfit(0); // Set to 0 if MRP or TP is invalid
    }
  }, [productData?.mrp, productData?.tp]);
  return (
    <div>
      <div className="container-fluid mb-5">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Update Product"></Header>
            <div className="row  mt-3">
              <div className="col-md-9">
                <form
                  onSubmit={handleSubmit(handelUpdateProduct)}
                  className="mt-4"
                >
                  {/* 1st row */}
                  <div className="row">
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="group" className="form-label">
                          Group
                        </label>
                        <SelectGroup
                          gp={gp}
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
                          Generic Name
                        </label>
                        <SelectGeneric
                          gn={gn}
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
                          Brand
                        </label>
                        <SelectBrand
                          bn={bn}
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
                        <label htmlFor="brand" className="form-label">
                          Size
                        </label>
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              placeholder="Size"
                              className="form-control"
                              id="p_name"
                              aria-describedby="nameHelp"
                              defaultValue={productData?.size}
                              value={productData?.size}
                              onChange={(e) => {
                                dispatch(sizeInput(e.target.value));
                              }}
                            />
                          </div>
                          {/* <div className="col-md-6">
                            <select
                              className="form-select"
                              id="product_type"
                              placeholder="product_type"
                              defaultValue={productData?.product_type}
                              value={productData?.product_type}
                              onChange={(e) => {
                                dispatch(productTypeInput(e.target.value));
                              }}
                            >
                              <option value="mg">mg</option>
                              <option value="ml">ml</option>
                            </select>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 2nd row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_name">
                          Name
                        </label>
                        <input
                          placeholder="Product name"
                          className="form-control"
                          id="p_name"
                          aria-describedby="nameHelp"
                          defaultValue={productData?.name}
                          value={productData?.name}
                          onChange={(e) => dispatch(inputName(e.target.value))}
                        />
                        <div id="nameHelp" className="form-text">
                          Product Name with pack size
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="p_article_code">
                          Article Code
                        </label>

                        <input
                          placeholder="Article Code"
                          className="form-control"
                          id="p_article_code"
                          aria-describedby="article_codeHelp"
                          defaultValue={productData?.article_code}
                          value={productData?.article_code}
                          onChange={(e) =>
                            dispatch(inputProductCode(e.target.value))
                          }
                          disabled={
                            productData?.closingStock > 0 ? "disabled" : ""
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3rd row */}
                  <div className="row">
                    {/* <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="masterCategory" className="form-label">
                          Category
                        </label>

                        <SelectCategory
                          cat={cat}
                          handleOnchange={(e) => {
                            handleOnchangeCategory(e);
                          }}
                        ></SelectCategory>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="subCategory" className="form-label">
                          Sub Category
                        </label>

                        <CategorySelectByMC
                          sc={sc}
                          scValue={sCat}
                          handleOnchange={(e) => {
                            handleOnchangeSubCategory(e);
                          }}
                        ></CategorySelectByMC>
                      </div>
                    </div> */}
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="masterCategory" className="form-label">
                          Unit
                        </label>

                        <SelectUnit
                          ut={unit} // Pass the initial unit ID
                          handleOnchange={(selectedUnitId) => {
                            // console.log("Selected Unit ID:", selectedUnitId); // Log or handle the selected unit ID
                            setUnit(selectedUnitId); // Update parent state if needed
                          }}
                        />
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
                          defaultValue={productData?.pcsBox}
                          value={productData?.pcsBox}
                          onChange={(e) => {
                            dispatch(pcsBoxInput(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_article_code">
                          Type
                        </label>
                        <select
                          // {...register("type")}
                          className="form-select"
                          id="type"
                          placeholder="type"
                          defaultValue={productData?.type}
                          value={productData?.type}
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
                          defaultValue={productData?.tp}
                          value={productData?.tp}
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
                          defaultValue={productData?.mrp}
                          value={productData?.mrp}
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
                        <div class="input-group mb-3">
                          <input
                            placeholder="Profit"
                            className="form-control"
                            id="p_name"
                            aria-describedby="nameHelp"
                            value={profit}
                            disabled
                          />
                          <span class="input-group-text p-1" id="basic-addon2">
                            %
                          </span>
                        </div>
                        {/* <div className="row">
                          <div className="col-md-8">
                            <input
                              placeholder="Profit"
                              className="form-control"
                              id="p_name"
                              aria-describedby="nameHelp"
                              value={productData?.tp > 0 ? parseInt(((parseInt(productData?.mrp > 0 ? productData?.mrp : 0) - parseInt(productData?.tp > 0 ? productData?.tp : 0)) / parseInt(productData?.tp)) * 100) : 0}
                              disabled
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              placeholder="Profit"
                              className="form-control"
                              id="p_name"
                              aria-describedby="nameHelp"
                              value={"%"}
                              disabled
                            />
                          </div>
                        </div> */}
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
                          defaultValue={productData?.maxQty}
                          value={productData?.maxQty}
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
                          defaultValue={productData?.minQty}
                          value={productData?.minQty}
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
                          defaultValue={productData?.alert_qty}
                          value={productData?.alert_qty}
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
                          defaultValue={productData?.vat}
                          value={productData?.vat}
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
                        {/* <input placeholder='Vat Method' className="form-control" id="p_vat_method" aria-describedby="vat_methodHelp" {...register("vat_method", { required: true, maxLength: 20 })} /> */}
                        <select
                          className="form-select"
                          defaultValue={productData?.vat_method}
                          value={productData?.vat_method}
                          onChange={(e) => {
                            dispatch(selectVatMethod(e.target.value));
                          }}
                        >
                          <option value="true">Include</option>
                          <option value="false">Exclude</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-3 ">
                        <label className="form-label" htmlFor="p_shipping">
                          Shipping Method
                        </label>
                        {/* <input placeholder='shipping' className="form-control" id="p_shipping" aria-describedby="shippingHelp" {...register("shipping", { required: true, maxLength: 20 })} /> */}
                        <select
                          className="form-select"
                          defaultValue={productData?.shipping_method}
                          value={productData?.shipping_method}
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
                    <div className="col-md-3">
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
                              defaultValue={productData?.discount}
                              value={productData?.discount}
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
                          defaultValue={productData?.status}
                          value={productData?.status}
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
                          defaultValue={productData?.details}
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
                    }}
                    className="btn btn-dark col-4 col-md-2 m-1"
                  >
                    Reset
                  </button>
                  <input
                    type="submit"
                    className="btn btn-dark col-4 col-md-2"
                    value="Update Product"
                  />
                </form>
              </div>
              <div className="col-md-3">
                <Form onSubmit={(e) => handleProductPhotoUpload(e)}>
                  <div className="card">
                    <img
                      className="card-img-top"
                      // {data?.photo !== null ?}
                      src={
                        data?.photo
                          ? `${PHOTO_BASE_URL}${uploadFile.filePath}`
                          : productPhoto
                      }
                      alt="Card image cap"
                    />
                    <div className="card-body">
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="text-wrap w-100">
                          {data?.name}
                        </Form.Label>
                        <Form.Control
                          name="c_photo"
                          type="file"
                          onChange={(e) => handleProductPhoto(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="card-footer">
                      <div className="d-grid gap-2">
                        <Button type="submit" variant="dark" size="lg">
                          <Icons.UploadOutline size={20}></Icons.UploadOutline>{" "}
                          Save Photo{" "}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ProductPriceModal
        show={priceModal}
        handleClose={handlePriceModalClose}
        productId={data?._id}
      ></ProductPriceModal> */}
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

export default UpdateProducts;
