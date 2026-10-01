import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import SupplierSelectByProduct from "../CustomSelect/SupplierSelectByProduct";
import WareHouseDW from "../CustomSelect/WareHouseDW";
import axios from "../../../services/apiClient";
import {
  useProductInfoQuery,
  useProductPriceQuery,
  useUpdateProductMutation,
  useUpdateProductPriceMutation,
} from "../../../services/productApi";
import {
  useAddPriceMutation,
  usePriceByProductQuery,
  useUpdatePriceMutation,
  useDeletePriceMutation,
  usePriceByProductSwitchQuery,
  useAddPriceMultiMutation,
  useUpdateEditPriceMutation,
  useAddNewPriceMutation
} from "../../../services/priceApi";
import * as Icons from "heroicons-react";
import { notify } from "../../Utility/Notify";
import LoadingModal from "./LoadingModal";
import { useDispatch, useSelector } from "react-redux";
// import { selectIsUpdate, selectPriceId } from "../../../features/priceUpdateSlice";

const ProductPriceModal = ({ show, handleClose, productId }) => {


  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // const priceInfo = usePriceByProductQuery(productId);
  const priceInfo = usePriceByProductSwitchQuery(productId);
  const productInfo = useProductInfoQuery(productId);
  const ProductPriceList = useProductPriceQuery(productId);
  const priceInfoAll = usePriceByProductSwitchQuery(productId);

  const [updateProduct] = useUpdateProductMutation();
  const [updateMultiPrice] = useAddPriceMultiMutation();
  const dispatch = useDispatch();

  console.log("product ID:", productId);
  console.log("price info:", priceInfo);
  console.log("product data:", productInfo);
  console.log("product data list:", ProductPriceList);
  console.log("product data list:", priceInfoAll);

  const [priceList, setPriceList] = useState([]);
  const [priceListLoop, setPriceListLoop] = useState([]);

  console.log("priceList", priceList)
  // console.log("priceListLoop", priceListLoop)

  const [addPrice] = useAddPriceMutation();
  const [addNewPriceTable] = useAddNewPriceMutation();
  const [updatePrice] = useUpdatePriceMutation();
  const [updateProductPrice] = useUpdateProductPriceMutation();
  const [updateEditPrice] = useUpdateEditPriceMutation();
  const [deletePrice] = useDeletePriceMutation();

  const [tempTp, setTempTp] = useState([]);
  const [tempMrp, setTempMrp] = useState([]);
  const [tempWh, setTempWh] = useState([]);
  const [tempSupp, setTempSupp] = useState([]);

  const [loader, setLoader] = useState(false)
  const handleLoaderClose = () => setLoader(false);

  const priceUpdate = useSelector((state) => state.priceUpdateReducer);

  useEffect(() => {
    priceInfo.refetch()
  }, [show])

  useEffect(() => {
    let loadedPriceTable = [];
    if (priceInfo.isSuccess) {
      loadedPriceTable = [...priceInfo.data];
      console.log("loadedPriceTable", loadedPriceTable)
      if (priceUpdate?.isUpdate === "true") {
        const updatingPrice = loadedPriceTable.filter((p) => p._id !== priceUpdate?.id);
        console.log("updatingPrice", updatingPrice)
      }
      setPriceList(loadedPriceTable);
    } else {
      setPriceList(loadedPriceTable);
    }
  }, [priceInfo.data, show, priceUpdate]);

  // console.log(priceList);

  useEffect(() => {
    if (priceList?.length > 0) {
      console.log("afterEffect", priceList);
      let newCart = priceList?.sort((a, b) => a.order - b.order);
      console.log(newCart);
      setPriceListLoop(newCart);

      let cartTempMrp = [];
      let cartTempTp = [];
      let cartTempSupp = [];
      let cartTempWh = [];

      priceList?.map((item) => {
        cartTempMrp = [...cartTempMrp, { id: item.order, mrp: item.mrp }];
        cartTempTp = [...cartTempTp, { id: item.order, tp: item.tp }];
        cartTempWh = [
          ...cartTempWh,
          { id: item.order, warehouse: item.warehouse },
        ];
        cartTempSupp = [
          ...cartTempSupp,
          { id: item.order, supplier: item.supplier },
        ];
      });

      setTempMrp(cartTempMrp);
      setTempWh(cartTempWh);
      setTempSupp(cartTempSupp);
      setTempTp(cartTempTp);
    } else {
      // setPriceListLoop([]);
    }
  }, [priceList, show]);

  const handleCustomTp = (e, id) => {
    // console.log("e", e)
    // console.log("item", item)

    const tp = e.target.value !== "" ? e.target.value : 0;
    let restItem = priceList.filter((item) => item.order !== id);
    const item = priceList.find((item) => item.order === id);

    const newPrice = [
      ...restItem,
      {
        ...item,
        tp: tp,
      },
    ];
    setPriceList(newPrice);
  };

  const handleCustomMrp = (e, id) => {
    const mrp = e.target.value !== "" ? e.target.value : 0;
    let restItem = priceList.filter((item) => item.order !== id);
    const item = priceList.find((item) => item.order === id);

    const newPrice = [
      ...restItem,
      {
        ...item,
        mrp: mrp,
      },
    ];
    setPriceList(newPrice);
  };

  let i = 1;
  const handleAddPrice = (productId) => {
    console.log("priceList", priceList)
    const newPriceList = [...priceList]
    console.log(newPriceList)
    const newLastPrice = newPriceList.pop()
    console.log(newPriceList)

    const newPrice = {
      warehouse: "",
      article_code: productId,
      supplier: "",
      tp: 0,
      mrp: 0,
      order: Number(newLastPrice?.order > 0 ? newLastPrice?.order : 0) + 1,
      status: "active"
    };
    const updateList = [...priceList, newPrice];
    setPriceList(updateList);
  };

  console.log("price List: ", priceList);
  // console.log("price Loop: ", priceListLoop);

  const removeItem = async (item) => {
    let newList = [];
    if (item?._id) {
      newList = priceList.filter((p) => p._id !== item?._id);
      let newP = []
      newList.map(p => {
        newP = [...newP, p._id]
      })
      const pp = { _id: productId, newP }
      await updateProductPrice(pp)
        .then(res => {
          console.log("product priceList updated")
        })
      await deletePrice(item?._id)
      // .finally(delToProduct(item?._id));
    } else {
      newList = priceList.filter((p) => p.order !== item?.order);
    }
    console.log(item);
    setPriceList(newList);
  };

  const handleVendorChange = (order, value) => {
    const selected = priceList.find((o) => o.order === order);
    let rest = priceList.filter((o) => o.order !== order);
    const newPrice = [
      ...rest,
      {
        ...selected,
        supplier: value.option,
      },
    ];
    setPriceList(newPrice);
  };

  const handleWhChange = (value, order) => {
    const selected = priceList.find((o) => o.order === order.name);
    let rest = priceList.filter((o) => o.order !== order.name);
    const newPrice = [
      ...rest,
      {
        ...selected,
        warehouse: value.option,
      },
    ];
    setPriceList(newPrice);
    console.log("value", value);
    console.log("order", order);
  };

  // ADD PRICE LIST TO PRODUCT
  const addToProduct = async (priceData) => {
    const createdId = priceData;
    // const createdMessage = priceData.message;

    // get product price list
    let oldPrice = ProductPriceList.data.priceList;

    // compare and update the price
    if (oldPrice === null) {
      const newPrice = [createdId];
      const updatePrice = { _id: productId, priceList: newPrice };
      // update product price
      const response = await updateProduct(updatePrice);
      console.log(updatePrice);
      console.log(newPrice);
      if (response) {
        console.log(response);
        notify("Price Created Successful!", "success");
      }
    } else {
      let rest = oldPrice.filter((price) => price !== createdId);
      const newPrice = [...rest, createdId];
      const updatePrice = { _id: productId, priceList: newPrice };
      // update product price
      console.log(updatePrice);
      console.log(newPrice);
      const response = await updateProduct(updatePrice);
      if (response) {
        console.log(response);
        // notify(createdMessage, "success")
        notify("Price Update Successful!", "success");
      }
    }
    // show notification
  };

  // DELETE PRICE FROM PRODUCT

  const delToProduct = async (priceId) => {
    const createdId = priceId;
    // const createdMessage = priceData.message;

    // get product price list
    let oldPrice = ProductPriceList.data.priceList;
    let rest = oldPrice.filter((price) => price !== createdId);
    const updatePrice = { _id: productId, priceList: rest };
    const response = await updateProduct(updatePrice);
    if (response) {
      console.log(response);
      // notify(createdMessage, "success")
      notify("Price Update Successful!", "success");
    }
  };

  const onUpdatePrice = async () => {
    handleClose();
    // setLoader(true)
    // await updateMultiPrice(priceList)
    //   .then(res => {
    //     console.log("res", res)
    //     if (res?.data?.status === "success") {
    //       handleClose();
    //       notify("Price Update Successfully", "success")
    //       setLoader(false)
    //     }
    //   })



    // priceList.map(async (item) => {
    //   // CHECK IF PRICE TABLE EXIST
    //   console.log("Item", item);
    //   if (item?._id) {
    //     // UPDATE OR ADD TO THE LIST
    //     updatePrice(item);
    //     await addToProduct(item._id);
    //     console.log("update:", updatePrice);
    //   } else {
    //     // SAVE DATA TO PRICE TABLE
    //     // let priceId;
    //     // GET PRICE TABLE ID const createId =
    //     await addPrice(item)
    //       .then((res) => res.data)
    //       .then((data) => addToProduct(data.id));
    //     console.log("update:", updatePrice);
    //   }
    //   // CLOSE MODAL
    //   handleClose();
    // });
  };
  const handlePriceStatus = async (item) => {
    setLoader(true)
    console.log(item)
    const rest = priceListLoop.filter(price => price._id !== item._id) //filter
    let newItem = {};
    if (item.status === "active") {
      newItem = { ...item, status: "inactive" }
    } else {
      newItem = { ...item, status: "active" }
    }
    console.log("rest", rest)
    console.log("newItem", newItem)
    const newPriceList = [...rest, newItem]
    console.log("newPriceList", newPriceList)

    await axios.put(`${BASE_URL}/price/${item?._id}`, newItem)
      .then(res => {
        console.log("res", res)
        if (res.status === 200) {
          // console.log("its happening")
          // setPriceListLoop([])
          // setPriceListLoop(newPriceList)
          priceInfo.refetch()
          setLoader(false)
        }
      })
      .catch(err => console.log(err))
  }
  const editNewPrice = async (price) => {
    // dispatch(selectPriceId(price._id))
    // dispatch(selectIsUpdate(true))
    console.log(price)
    console.log(priceList)
    const updatedPrice = priceList.filter(pro => pro._id == price._id)
    console.log(updatedPrice)
    const upPrice = { _id: updatedPrice[0]._id, priceList: updatedPrice[0] };
    await updateEditPrice(upPrice)
      .then(res => {
        console.log(res)
        // dispatch(selectPriceId(""))
        // dispatch(selectIsUpdate(false))
        notify("Price Update SuccessFully", "success")

      })
      .catch(err => {
        console.log(err)
        notify("Server Side Problem", "error")
      })

    // console.log("hi", response)


  }
  const addNewPrice = async (item) => {
    console.log(item)

    const updatedPrice = priceList.filter(pro => pro._id === item._id)
    console.log(updatedPrice)
    await addNewPriceTable(updatedPrice[0])
      .then(async res => {
        console.log("res", res)
        console.log(priceList)
        let prices = []
        priceList.map(p => {
          if (p?._id) {
            prices = [...prices, p._id]
          }
        })
        console.log("prices", prices)
        if (res?.error?.status == 500) {
          notify("Give Supplier And warehouse", "error")
        } else {
          console.log("res", res)
          notify("Price is created Successfully", "success")
          const newP = [...prices, res?.data?.id]
          console.log("newP", newP)
          const pp = { _id: productId, newP }
          await updateProductPrice(pp)
            .then(res => {
              notify("Product updated Successfully", "success")
              console.log("product priceList updated")
            })

        }
      })
    // .catch(err => {
    //   console.log(err)
    //   notify("Server Side error", "error")
    // })
  }
  return (
    <>
      <LoadingModal
        title={"Please Wait"}
        onShow={loader}
        handleClose={handleLoaderClose}
      ></LoadingModal>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        keyboard={false}
        className=""
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Price Table</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          <div className="mx-auto">
            {/* <Card className="text-center"> */}
            <div className="">
              <p className="">
                <b>Product Name: </b>
                {productInfo?.data && productInfo?.data?.name}
              </p>
              <div className="d-flex justify-content-between">
                <span>
                  <b>EAN:</b> {productInfo?.data && productInfo?.data?.ean}
                </span>
                <span>
                  <b>Category:</b>{" "}
                  {productInfo?.data && productInfo?.data?.category?.name}
                </span>
                <span>
                  <b>MC:</b>{" "}
                  {productInfo?.data && productInfo?.data?.master_category?.name}
                </span>
                <span>
                  <b>Code:</b>{" "}
                  {productInfo?.data && productInfo?.data?.article_code}
                </span>
              </div>
              <hr />
              <Table>
                <thead className="container">
                  <tr className="row m-0">
                    <th className="col-md-1 text-center">#</th>
                    <th className="col-md-3">Vendor</th>
                    <th className="col-md-3">WH</th>
                    <th className="col-md-2">TP</th>
                    <th className="col-md-2">MRP</th>
                    <th className="col-md-1 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="container">
                  {priceListLoop
                    // .slice().sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <tr className="row m-0" key={item.order}>
                        <th className="col-md-1 text-center">{i++}</th>
                        <td className="col-md-3">
                          <SupplierSelectByProduct
                            article_code={
                              productInfo?.data && productInfo?.data?.article_code
                            }
                            handleOnChange={handleVendorChange}
                            className={item.order}
                            name={item.order}
                            value={
                              tempSupp[index]?.supplier
                                ? tempSupp[index]?.supplier
                                : item?.supplier
                            }
                          ></SupplierSelectByProduct>
                        </td>
                        <td className="col-md-2">
                          <WareHouseDW
                            handleOnChange={handleWhChange}
                            name={item.order}
                            warehouse={
                              tempWh[index]?.warehouse
                                ? tempWh[index]?.warehouse
                                : item?.warehouse
                            }
                          />
                        </td>
                        <td className="col-md-2">
                          <input
                            className="form-control"
                            onChange={(e) => handleCustomTp(e, item.order)}
                            value={
                              tempTp[index]?.tp
                                ? tempTp[index]?.tp
                                : parseFloat(item?.tp)
                            }
                            defaultValue={item?.tp}
                            type="text"
                          />
                        </td>
                        <td className="col-md-2">
                          <input
                            className="form-control"
                            onChange={(e) => handleCustomMrp(e, item.order)}
                            value={
                              tempMrp[index]?.mrp
                                ? tempMrp[index]?.mrp
                                : parseFloat(item?.mrp)
                            }
                            defaultValue={item?.mrp}
                            type="text"
                          />
                        </td>
                        <td className="col-md-2 text-center">
                          <div className="d-flex justify-content-center align-items-center">
                            <Form.Check
                              type="switch"
                              checked={item?.status === "active" ? "checked" : ""}
                              // id="custom-switch"
                              onChange={() => handlePriceStatus(item)}
                              label=""
                            />

                            {
                              item?._id ? <Icons.PencilAltOutline
                                className="icon-trash"
                                // disabled
                                onClick={() => editNewPrice(item)}

                              >
                              </Icons.PencilAltOutline> : <Icons.PlusCircleOutline
                                className="icon-trash"
                                // disabled
                                onClick={() => addNewPrice(item)}
                              >
                              </Icons.PlusCircleOutline>
                            }
                            <Icons.TrashOutline
                              className="icon-trash"
                            // disabled
                            // onClick={() => removeItem(item)}
                            >
                            </Icons.TrashOutline>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* <td>BDT</td> */}
                </tbody>
              </Table>
              <button
                className="btn btn-outline-dark float-end"
                onClick={() => handleAddPrice(productId)}
              >
                + New Price
              </button>
            </div>
            {/* </Card> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onUpdatePrice} variant="dark">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductPriceModal;