import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  profitInput,
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
} from "../../../features/productAddSlice";
import {
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../services/productApi";
import { notify } from "../../Utility/Notify";
import CategorySelectByMC from "../CustomSelect/categorySelectByMC";
import SelectBrand from "../CustomSelect/selectBrand";
import SelectCategory from "../CustomSelect/selectCategory";
import SelectGeneric from "../CustomSelect/selectGeneric";
import SelectGroup from "../CustomSelect/selectGroup";
import SelectUnit from "../CustomSelect/selectUnit";

const ProductDetailsUpdateModal = ({
  onShow,
  setOnShow,
  product,
  handleClose,
}) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateProduct] = useUpdateProductMutation();
  const productData = useSelector((state) => state.productAddReducer);

  // console.log(product)
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductDetailsQuery(`${product?.id}`);

  const { register, handleSubmit, reset } = useForm({});

  const [gp, setGp] = useState("");
  const [gn, setGn] = useState("");
  const [bn, setBn] = useState("");
  const [cat, setCat] = useState("");
  const [sCat, setSCat] = useState("");
  const [sc, setSc] = useState("");
  const [unit, setUnit] = useState("");
  const [groupShow, setGroupShow] = useState(false);
  const handleGroupClose = () => setGroupShow(false);

  const [genericShow, setGenericShow] = useState(false);
  const handleGenericClose = () => setGenericShow(false);

  const [brandShow, setBrandShow] = useState(false);
  const handleBrandClose = () => setBrandShow(false);
  useEffect(() => {
    if (data) {
      dispatch(inputAll(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    setGp(productData?.group);
    setGn(productData?.generic);
    setBn(productData?.brand);
    setCat(productData?.category);
    setSCat(productData?.subCategory);
    setUnit(productData?.unit);
  }, [productData]);

  const handelUpdateProduct = async (data) => {
    // console.log("data", productData)
    // console.log(data);
    const response = await updateProduct(productData);

    if (response?.data) {
      // console.log(response);
      notify("Product Update Successful!", "success");
      refetch();
      setOnShow(false);

      //   navigate("/product");
    }
    // try {
    //     const response = await addGeneric(data);
    //     if (response) {
    //         console.log(response);
    //         if (response?.error) {
    //             apiUniqueErrHandle(response);
    //         } else {
    //             reset({
    //                 name: "",
    //                 details: "",
    //                 status: "active",
    //             });
    //             console.log(response?.data?.message);
    //             notify("Generic added", "success")
    //             setOnShow(false)
    //         }
    //     }
    // } catch (err) {
    //     console.log(err)
    // } finally {

    // }
  };
  const handleReset = () => {
    reset({
      name: "",
      details: "",
      status: "active",
    });
  };
  const handleOnchangeGroup = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectGroup(e.value));
    } else {
      dispatch(selectGroup(null));
    }
  };
  const handleOnchangeGeneric = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectGeneric(e.value));
    } else {
      dispatch(selectGeneric(null));
    }
  };
  const handleOnchangeBrand = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectBrand(e.value));
      dispatch(selectBrandName(e.label));
    } else {
      dispatch(selectBrand(null));
      dispatch(selectBrandName(""));
    }
  };
  const handleOnchangeCategory = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectCategory(e.value));
      setSc(e.code);
    } else {
      dispatch(selectCategory(null));
      setSc(null);
    }
  };
  const handleOnchangeSubCategory = (e) => {
    // console.log("e", e);
    if (e !== null) {
      dispatch(selectCategory(e.value));
    } else {
      dispatch(selectCategory(null));
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
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      centered={true}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Product Details </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card-body">
          <form onSubmit={handleSubmit(handelUpdateProduct)} className="mt-4">
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
                                                    dispatch(productTypeInput(e.target.value))
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
              <div className="col-md-3">
                <div className="mb-3 ">
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
                    onChange={(e) => dispatch(inputProductCode(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-3">
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

            {/* 3rd row */}
            <div className="row">
              <div className="col-md-3">
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

                  <div
                    style={{
                      width:
                        window.innerWidth >= 1024
                          ? 200
                          : window.innerWidth >= 768
                          ? 200
                          : "100%", // Adjust width based on screen size
                    }}
                  >
                    <CategorySelectByMC
                      sc={sc}
                      scValue={sCat}
                      handleOnchange={(e) => {
                        handleOnchangeSubCategory(e);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label htmlFor="masterCategory" className="form-label">
                    Unit
                  </label>

                  <SelectUnit
                    ut={unit}
                    handleOnchange={(e) => {
                      handleOnchangeUnit(e);
                    }}
                  ></SelectUnit>
                </div>
              </div>

              <div className="col-md-3">
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
                    disabled
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
                      value={
                        productData?.tp > 0
                          ? parseInt(
                              ((parseInt(
                                productData?.mrp > 0 ? productData?.mrp : 0
                              ) -
                                parseInt(
                                  productData?.tp > 0 ? productData?.tp : 0
                                )) /
                                parseInt(productData?.tp)) *
                                100
                            )
                          : 0
                      }
                      onChange={(e) => {
                        dispatch(profitInput(e.target.value));
                      }}
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
                          onClick={() => dispatch(selectDiscountType(true))}
                        />
                      ) : (
                        <BsCheckSquare
                          onClick={() => dispatch(selectDiscountType(false))}
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
                  <label className="form-label" htmlFor="p_product_details">
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
              className="btn btn-dark col-4 col-md-3"
              value="Update Product"
            />
          </form>
        </div>
        {/* <PO ref={componentRef} purchase={purchaseView.data} /> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailsUpdateModal;
