import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import * as Icons from "heroicons-react";
import { useForm } from "react-hook-form";
import { apiUniqueErrHandle } from "../../Utility/Utility";
import { useNavigate } from "react-router-dom";
import { notify } from "../../Utility/Notify";
import { useDispatch, useSelector } from "react-redux";
import {
//   alertQtyInput,
//   discountInput,
  inputAll,
//   inputName,
//   inputProductCode,
//   inputProductDetails,
//   inputShippingMethod,
//   maxQtyInput,
//   minQtyInput,
//   mrpInput,
//   pcsBoxInput,
//   productTypeInput,
//   profitInput,
//   resetProductAdd,
//   selectBrand,
//   selectBrandName,
//   selectCategory,
//   selectDiscountType,
//   selectGeneric,
//   selectGroup,
//   selectStatus,
//   selectType,
//   selectUnit,
//   selectVatMethod,
//   sizeInput,
//   tpInput,
//   vatInput,
} from "../../../features/productAddSlice";
import {
  useProductAllDetailsQuery,
  // useProductDetailsQuery,
  useUpdateProductMrpMutation,
  useUpdateProductMutation,
} from "../../../services/productApi";

const ProductDetailsUpdateModal = ({
  onShow,
  setOnShow,
  product,
  handleClose,
  mrpEdit,
  setMrpEdit,
  newProfit,
  setNewProfit,
}) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const mrpRef = useRef(null);

  const [updateProduct] = useUpdateProductMutation();
  const productData = useSelector((state) => state.productAddReducer);

  // console.log(product)
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductAllDetailsQuery(`${product?.id}`);
  const [updateMrp] = useUpdateProductMrpMutation();


  // const [newProfit, setNewProfit] = useState(0)
  // const [mrpEdit, setMrpEdit] = useState(false)
  // const handleMrpEditClose = () => setMrpEdit(false);

  useEffect(() => {
    if (data) {
      dispatch(inputAll(data));
    }
  }, [data, dispatch]);

  // useEffect(() => {
  //     setGp(productData?.group)
  //     setGn(productData?.generic)
  //     setBn(productData?.brand)
  //     setCat(productData?.category)
  //     setSCat(productData?.subCategory)
  //     setUnit(productData?.unit)
  // }, [productData])

  // const handelUpdateProduct = async (data) => {
  //   // console.log("data", productData)
  //   // console.log(data);
  //   const response = await updateProduct(productData);

  //   if (response?.data) {
  //     // console.log(response);
  //     notify("Product Update Successful!", "success");
  //     refetch();
  //     setOnShow(false);

  //     //   navigate("/product");
  //   }
  //   // try {
  //   //     const response = await addGeneric(data);
  //   //     if (response) {
  //   //         console.log(response);
  //   //         if (response?.error) {
  //   //             apiUniqueErrHandle(response);
  //   //         } else {
  //   //             reset({
  //   //                 name: "",
  //   //                 details: "",
  //   //                 status: "active",
  //   //             });
  //   //             console.log(response?.data?.message);
  //   //             notify("Generic added", "success")
  //   //             setOnShow(false)
  //   //         }
  //   //     }
  //   // } catch (err) {
  //   //     console.log(err)
  //   // } finally {

  //   // }
  // };
  const handleMrpEdit = () => {
    setMrpEdit(!mrpEdit);
  };
  const handleNewProfit = (e) => {
    // console.log(e.target.value);
    // console.log(mrpRef.current.value);
    if (e.target.value > 0) {
      const profit =
        ((parseFloat(e.target.value) - parseFloat(data.tp)) * 100) /
        parseFloat(data?.tp);
      const profit1 =
        ((parseFloat(20) - parseFloat(10)) * 100) / parseFloat(10);
      //   console.log(profit1);
      setNewProfit(profit);
    } else {
      setNewProfit(0);
    }
  };
  const handleSubmitNewMRP = async () => {
    let profit = 0;
    if (mrpRef.current.value > 0) {
      profit =
        ((parseFloat(mrpRef.current.value) - parseFloat(data.tp)) * 100) /
        parseFloat(data?.tp);
    }
    // console.log(mrpRef.current.value);
    // console.log(profit);
    const editedMrp = {
      mrp: mrpRef.current.value,
      profit: profit,
    };
    if (profit > 0) {
      await updateMrp({ _id: product?.id, editedMrp })
        .then((res) => {
          //   console.log(res);
          setMrpEdit(false);
          refetch();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      notify("Please Check Mrp", "error");
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
        <Container>
          <Row>
            <Col xs={6} md={6}>
              <p>
                {" "}
                <b>Name:</b> {data?.name}{" "}
              </p>
              <p>
                {" "}
                <b>Company:</b> {data?.supplierCompany}{" "}
              </p>
              <p>
                {" "}
                <b>Article Code:</b> {data?.article_code}{" "}
              </p>
              <p>
                {" "}
                <b>Group:</b> {data?.group?.name}{" "}
              </p>
              <p>
                {" "}
                <b>Generic:</b> {data?.generic?.name}{" "}
              </p>
              <p>
                {" "}
                <b>Brand:</b> {data?.brand?.name}{" "}
              </p>
              <p>
                {" "}
                <b>Size:</b> {data?.size}{" "}
              </p>
              <p>
                {" "}
                <b>PCS in Box:</b> {data?.pcsBox}{" "}
              </p>

              <p>
                {" "}
                <b>Details:</b> {data?.details}{" "}
              </p>
              <p>
                {" "}
                <b>Type:</b> {data?.type}{" "}
              </p>
              <p>
                {" "}
                <b>Status:</b>
                {data?.status}{" "}
              </p>
            </Col>
            <Col xs={6} md={6}>
              <p>
                {" "}
                <b>TP:</b> {data?.tp}{" "}
              </p>
              <p>
                {" "}
                <b>MRP:</b> {data?.mrp}{" "}
                <Icons.PencilAltOutline
                  className="icon-edit"
                  onClick={() => {
                    handleMrpEdit();
                  }}
                  size={20}
                ></Icons.PencilAltOutline>
              </p>
              {mrpEdit === true ? (
                <p>
                  {" "}
                  <b>New MRP:</b>
                  <div className="col-md-6">
                    <input
                      placeholder="New MRP"
                      className="form-control"
                      id="p_name"
                      aria-describedby="nameHelp"
                      onChange={(e) => handleNewProfit(e)}
                      defaultValue={0}
                      ref={mrpRef}
                    />
                  </div>
                </p>
              ) : (
                <></>
              )}
              {mrpEdit === true ? (
                <p>
                  {" "}
                  <b>New Profit:</b> {newProfit.toFixed(2)}{" "}
                </p>
              ) : (
                <></>
              )}
              {mrpEdit === true ? (
                <p>
                  {" "}
                  <button
                    type="button"
                    className="btn btn-dark col-6 col-md-6 m-1"
                    onClick={() => {
                      handleSubmitNewMRP();
                    }}
                  >
                    Edit MRP
                  </button>
                </p>
              ) : (
                <></>
              )}

              <p>
                {" "}
                <b>Previous Profit:</b> {data?.profit}{" "}
              </p>
            </Col>
          </Row>
        </Container>
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
