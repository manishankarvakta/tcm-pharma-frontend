import axios from "../../services/apiClient";
import * as Icons from "heroicons-react";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetTpn,
  selectNote,
  selectShipping,
  selectUser,
  tpnProductsAdd,
  tpnWarehouseForm,
  tpnWarehouseTo,
} from "../../features/tpnSlice";
import { useAddTpnMutation, useTpnCountQuery } from "../../services/tpnApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import TpnProductImporter from "../Common/CsvImporter/TpnProductImporter";
import TpnProductSearch from "../Common/CustomSelect/TpnProductSearch";
import "./Tpn.css";
import AlertService from "../Utility/AlertService";
// import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import WareHouseDWPurchase from "../Common/CustomSelect/WareHouseDWPurchase";
import Header from "../Common/Header/Header";
import LoadingModal from "../Common/Modal/LoadingModal";
import PackageModal from "../Common/Modal/PackageModal";
import SideBar from "../Common/SideBar/SideBar";
import useTpn from "../Hooks/useTpn";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import TpnProducts from "./TpnProducts";

const CreateTpn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.languageReducer);

  let i = 1;
  const user = signInUser();
  const { aamarId } = user;
  const tpnData = useSelector((state) => state.tpnReducer);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);
  const [csvData, setCsvData] = useState([]);
  const [tpnProducts, setTpnProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  // const { data: wh, refetch } = useWarehouseQuery(user?.warehouse);
  //   const [whName, setWhName] = useState(" ");
  //   useEffect(() => {
  //     if (wh) {
  //       setWhName(wh?.name);
  //       refetch();
  //     }
  //   }, [wh, refetch]);
  const [whName, setWhName] = useState("TCM");

  const { data: warehouseData, refetch: whRefetch } = useWarehouseQuery(
    user?.warehouse
  );
  const { data: countData } = useTpnCountQuery({ aamarId });
  useEffect(() => {
    if (user?.warehouse) {
      whRefetch();
    }
  }, [user?.warehouse, whRefetch]);
  useEffect(() => {
    dispatch(tpnWarehouseForm(user?.warehouse));
    dispatch(selectUser(user?.id));
  }, []);

  useEffect(() => {
    if (warehouseData) {
      setWhName(warehouseData?.name);
      whRefetch();
    }
  }, [warehouseData, whRefetch]);
  console.log("warehouse", warehouseData);

  const [addNewTpn] = useAddTpnMutation();

  const tpnProductsRef = useRef(null);
  //   console.log(user);
  // console.log(tpnData)
  // useEffect(() => {
  //     if (user) {
  //         dispatch(selectUser(user?.id));
  //     }
  // }, [user])

  const { totalItems } = useTpn();
  const { total_item, total, productList, total_shipping } = totalItems(
    tpnData?.products,
    tpnData?.shipping_cost
  );

  const handleOnchangeWareHouseTo = (e) => {
    console.log(e);
    dispatch(tpnWarehouseTo(e.option));
  };

  const handleOnchangeWareHouseFrom = (e) => {
    console.log(e);
    dispatch(tpnWarehouseForm(e.option));
    dispatch(selectUser(user?.id));
  };

  const addToList = async (data) => {
    console.log(data);
    if (data) {
      console.log("add to list:", data);
      // await tpnProductsRef.current.blur();
      let listData = tpnData.products;

      let newProduct = {};
      // unique check
      const idExist = listData.find((pro) => pro.id === data[0]._id);
      if (idExist) {
        notify("Product Already in List", "error");
        // console.log()
      } else {
        notify("Product is Added", "success");

        if (data?.length > 0) {
          newProduct = {
            id: data[0]?._id,
            name: data[0]?.name,
            article_code: data[0]?.article_code,
            qty: 1,
            order: listData?.length + 1,
            aamarId: aamarId,
            warehouse: user?.warehouse,
            // priceId: data[0]._id,
            group: data[0]?.group[0]?.name,
            tp: data[0].tp,
            mrp: data[0].mrp,
            tax: 0,
            discount: 0,
          };
          listData = [...listData, newProduct];
        } else {
          newProduct = {
            id: data?._id,
            name: data?.name,
            article_code: data?.article_code,
            aamarId: aamarId,
            warehouse: user?.warehouse,
            qty: 1,
            order: listData?.length + 1,
            // priceId: data._id,
            group: data?.group[0]?.name,
            tp: data.tp,
            mrp: data.mrp,
            tax: 0,
            discount: 0,
          };
          listData = [...listData, newProduct];
        }
      }

      // console.log("upcoming damage:", newProduct);
      // console.log("Updated damage:", listData);
      setTpnProducts(listData);
      dispatch(tpnProductsAdd(listData));
    } else {
      return false;
    }
  };

  const handleImportButton = () => {
    let importProducts = [];
    let i = 1;
    console.log(csvData);
    // setOnShow(true);
    if (csvData?.length > 0) {
      csvData.map(async (pro) => {
        // console.log(pro);
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
                id: data?._id,
                article_code: data?.article_code,
                aamarId: aamarId,
                warehouse: user?.warehouse,
                // priceId: data?._id,
                tp: data?.tp > 0 ? data?.tp : 0,
                mrp: data?.mrp > 0 ? data?.mrp : 0,
                name: data?.name,
                qty: pro.qty,
                tax: 0,
                discount: 0,
                order: i++,
              },
            ];
            setTpnProducts(importProducts);
          }
        } catch (err) {
          notify(err, "error");
        } finally {
          console.log(importProducts);
          dispatch(tpnProductsAdd([...importProducts, ...tpnData.products]));
          if (importProducts?.length === csvData?.length) {
            // setOnShow(false);
          }
        }
      });
    } else {
      //   setOnShow(false);
      notify("There is no products to import", "error");
    }
  };
  const handleOnChangePrice = async (tp, id) => {
    const selected = tpnData?.products?.find((p) => p.article_code === id);
    const rest = tpnData?.products?.filter((p) => p.article_code !== id);
    console.log("selected", selected);
    console.log("rest", rest);
    console.log("id", id);
    let newProducts = [
      ...rest,
      {
        ...selected,
        tp: tp,
      },
    ];
    setTpnProducts(newProducts);
    dispatch(tpnProductsAdd(newProducts));
    // updateCart();
  };
  const handleCustomQty = (qty, id) => {
    // const qty = e.target.value();
    const selected = tpnData?.products?.find((p) => p.article_code === id);
    const rest = tpnData?.products?.filter((p) => p.article_code !== id);
    console.log("selected", selected);
    console.log("rest", rest);
    console.log("id", id);
    let newProducts = [
      ...rest,
      {
        ...selected,
        qty: qty,
      },
    ];
    setTpnProducts(newProducts);
    dispatch(tpnProductsAdd(newProducts));
  };
  const removeFromCart = (id) => {
    const selected = tpnData?.products?.find((p) => p.id === id);
    const rest = tpnData?.products?.filter((p) => p.id !== id);
    // dispatch(setTpnProducts(rest));
    dispatch(tpnProductsAdd(rest));
  };
  // console.log(user?.package?.tpnLimited);
  const handleTpnSubmit = async () => {
    // dispatch(selectTotalItem(total_item))
    // dispatch(selectTotal(total))
    const newTpn = { ...tpnData, total: total, totalItem: total_item };
    if (tpnData?.warehouseFrom === "") {
      notify("Please Select a warehouse From", "error");
    } else {
      if (tpnData?.warehouseTo === "") {
        notify("Please Select a warehouse To", "error");
      } else {
        if (tpnData?.products?.length > 0) {
          setLoader(true);
          console.log("tpnData", newTpn);
          await addNewTpn({
            ...newTpn,
            aamarId,
            warehouse: tpnData?.warehouseFrom,
          })
            .then((res) => {
              console.log(res);
              if (res?.data) {
                notify("Transport Order Created Successfully", "success");
                dispatch(resetTpn());
                setLoader(false);
                navigate("/tpn");
              }
            })
            .catch((err) => {
              console.log(err);
              notify("Server Side Error", "error");
            });
        } else {
          notify("Please Select a Product", "error");
        }
      }
    }
    // console.log("tpnData", newTpn)
  };
  const emptyTpn = async () => {
    const confirmed = await AlertService.confirm("Refresh Cart?", "Start New TPN?");
    if (confirmed) {
      dispatch(tpnProductsAdd([]));
    } else {
      console.log("Refresh Operation Cancelled by User");
    }
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
          <div className="col-md-10">
            <Header title={lang?.productOutViaTPN}></Header>
            <Form className="pt-3">
              <div className="row">
                <div className="col-6">
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse From</Form.Label>
                    {user?.type !== "admin" ? (
                      <p>{whName}</p>
                    ) : (
                      <WareHouseDWPurchase
                        //   {...setValue("warehouse", `${wh}`)}
                        id="warehouse"
                        name="warehouse"
                        handleOnChange={handleOnchangeWareHouseFrom}
                        defaultValue={whName}

                      //   wh={wh !== "" ? wh : 0}
                      // {...register("warehouse")}
                      />
                    )}
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group className="">
                    <Form.Label>Warehouse To</Form.Label>
                    <WareHouseDWPurchase
                      //   {...setValue("warehouse", `${wh}`)}
                      id="warehouse"
                      name="warehouse"
                      handleOnChange={handleOnchangeWareHouseTo}

                    //   wh={wh !== "" ? wh : 0}
                    // {...register("warehouse")}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6 my-md-3">
                  <Form.Label>Products</Form.Label>
                  <TpnProductSearch
                    className="searchProduct"
                    // getValue={getValue}
                    addToList={addToList}
                    tpnProductsRef={tpnProductsRef}
                  ></TpnProductSearch>
                </div>
                <div className="col-md-6 my-3 ">
                  <TpnProductImporter
                    setCsvData={setCsvData}
                    handleImportButton={handleImportButton}
                    title=""
                  />
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">Transported Products List</div>
                    <div className="table-responsive">
                      <Table className="mt-3 ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Group</th>
                            <th>Quantity</th>
                            <th className="sm-wider">TP</th>
                            {/* <th>Tax</th> */}
                            <th>Total</th>
                            {/* <th>Reason</th> */}
                          </tr>
                        </thead>

                        <tbody>
                          <TpnProducts
                            tpnProducts={tpnData?.products}
                            i={i}
                            // removeQuantities={removeQuantities}
                            // addQuantities={addQuantities}
                            handleOnChangePrice={handleOnChangePrice}
                            handleCustomQty={handleCustomQty}
                            removeFromCart={removeFromCart}
                          ></TpnProducts>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 my-2">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Shipping Cost</Form.Label>
                    <Form.Control
                      onChange={(e) => dispatch(selectShipping(e.target.value))}
                      type="number"
                      className="shipping"
                      placeholder="Shipping Cost"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6 my-2">
                  <Form.Group className="" controlId="formBasicEmail">
                    <Form.Label>Note</Form.Label>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Note"
                      onChange={(e) => dispatch(selectNote(e.target.value))}
                    />
                  </Form.Group>
                </div>
              </div>
              <Table className="bordered striped ">
                <thead>
                  <tr>
                    <th>Total Items: {total_item.toFixed(2)}</th>
                    <th>Product Cost:{total.toFixed(2)} </th>
                    <th>Shipping Cost:{tpnData?.shipping_cost} </th>
                    <th>Total Cost:{total_shipping.toFixed(2)} </th>
                  </tr>
                </thead>
              </Table>
              <Button
                variant="dark"
                onClick={handleTpnSubmit}
                className="float-end my-2"
                type="button"
              >
                <Icons.SaveOutline size={20} /> Submit
              </Button>
              <Button
                variant="dark"
                className="float-end my-2 mx-2"
                type="button"
                onClick={emptyTpn}
              >
                Reset Cart
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default CreateTpn;
