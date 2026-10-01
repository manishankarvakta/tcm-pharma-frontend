import axios from "../../services/apiClient";
import * as Icons from "heroicons-react";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetDamage,
  selectNote,
  selectProducts,
  selectStatus,
  selectUser,
  selectWareHouse,
} from "../../features/damageSlice";
import {
  useAddDamageMutation,
  useDamageCountQuery,
} from "../../services/damageApi";
import { useWarehouseQuery } from "../../services/warehouseApi";
import DamageProductImpoter from "../Common/CsvImporter/DamageProductImporter";
import DamageNewProductSelect from "../Common/CustomSelect/DamageNewProductSelect";
import WareHouseDWPurchase from "../Common/CustomSelect/WareHouseDWPurchase";
import Header from "../Common/Header/Header";
import LoadingModal from "../Common/Modal/LoadingModal";
import SideBar from "../Common/SideBar/SideBar";
import useDamage from "../Hooks/useDamage";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { apiUniqueErrHandle } from "../Utility/Utility";
import "./Damage.css";
import DamageProducts from "./DamageProducts";
import AlertService from "../Utility/AlertService";
import PackageModal from "../Common/Modal/PackageModal";
// import updateInventoryOutOnDamageIn from "../Hooks/useInventory";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const DamageCreate = () => {
  let i = 1;
  const dispatch = useDispatch();
  const [wh, setWh] = useState("");
  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);
  const { register, handleSubmit, isSubmitSuccessful, reset } = useForm();
  const damageNewProductsRef = useRef(null);
  const damageData = useSelector((state) => state.damageReducer);
  const [csvData, setCsvData] = useState([]);
  const [damageProducts, setDamageProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const navigate = useNavigate();
  const lang = useSelector((state) => state.languageReducer);

  console.log("damageData", damageData);
  const [addDamage] = useAddDamageMutation();

  const { totalItems } = useDamage();
  const { total_item, total, productList } = totalItems(damageData?.products || []);
  const [whName, setWhName] = useState("TCM");
  const user = signInUser();
  const { aamarId } = user;
  const { data: countData } = useDamageCountQuery({ aamarId });
  console.log(countData);
  const { data: warehouseData, refetch: whRefetch } = useWarehouseQuery(
    user?.warehouse
  );
  useEffect(() => {
    dispatch(selectWareHouse(user?.warehouse));
    dispatch(selectUser(user?.id));
  }, []);

  useEffect(() => {
    if (warehouseData) {
      setWhName(warehouseData?.name);
      whRefetch();
    }
  }, [warehouseData, whRefetch]);
  // console.log("warehouse", warehouseData);
  useEffect(() => {
    if (user?.warehouse) {
      whRefetch();
    }
  }, [user?.warehouse, whRefetch]);
  useEffect(() => {
    dispatch(selectWareHouse(user?.warehouse));
    dispatch(selectUser(user?.id));
  }, []);

  const handleImportButton = () => {
    let importProducts = [];
    let i = 1;
    console.log(csvData);
    setOnShow(true);
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
                tp: data?.tp > 0 ? data?.tp : 0,
                mrp: data?.mrp > 0 ? data?.mrp : 0,
                name: data?.name,
                qty: pro.qty,
                aamarId: aamarId,
                warehouse: user?.warehouse,
                tax: 0,
                discount: 0,
                order: i++,
              },
            ];
            setDamageProducts(importProducts);
          }
        } catch (err) {
          notify(err, "error");
        } finally {
          console.log(importProducts);
          dispatch(selectProducts(importProducts));
          if (importProducts?.length === csvData?.length) {
            setOnShow(false);
          }
        }
      });
    } else {
      setOnShow(false);
      notify("There is no products to import", "error");
    }
  };

  const handleDamageSubmit = async () => {
    const targetWarehouse = wh || damageData?.warehouse || user?.warehouse;
    if (!targetWarehouse || targetWarehouse === "allWh" || targetWarehouse === "0") {
      notify("Please select a warehouse", "error");
      return;
    }

    const currentProducts = damageData?.products || [];
    if (currentProducts.length === 0) {
      notify("There must be products for Damage", "error");
      return;
    }

    const invalidQty = currentProducts.some(
      (p) => isNaN(parseFloat(p.qty)) || parseFloat(p.qty) <= 0
    );
    if (invalidQty) {
      notify("All product damage quantities must be greater than 0", "error");
      return;
    }

    const formattedProducts = currentProducts.map((p, idx) => ({
      ...p,
      warehouse: p.warehouse || targetWarehouse,
      qty: parseFloat(p.qty) || 0,
      order: p.order || idx + 1,
    }));

    const newDamage = {
      ...damageData,
      total: total,
      totalItem: total_item,
      aamarId,
      warehouse: targetWarehouse,
      userId: damageData?.userId || user?.id || user?._id,
      products: formattedProducts,
    };
    console.log("Submitting damage:", newDamage);

    const confirmed = await AlertService.confirm("Are you sure?", "Wanna create Damage?");
    if (confirmed) {
      try {
        const response = await addDamage(newDamage);
        console.log(response);
        if (response?.data?.message) {
          notify("Damage Creation update successful!", "success");
          dispatch(resetDamage());
          setDamageProducts([]);
          navigate("/damage");
        } else if (response?.error) {
          notify(
            response?.error?.data?.error ||
            response?.error?.data?.message ||
            "Damage Creation failed!",
            "error"
          );
        } else {
          apiUniqueErrHandle(response?.data);
        }
      } catch (err) {
        console.log(err);
        notify("Damage Creation failed!", "error");
      }
    }
  };

  const handleOnchangeWareHouse = async (e) => {
    const selectedWh = e.option;
    setWh(selectedWh);
    dispatch(selectWareHouse(selectedWh));
    dispatch(selectUser(user?.id));

    const currentProducts = damageData?.products || [];
    if (currentProducts.length > 0 && selectedWh && selectedWh !== "allWh") {
      const updatedProducts = await Promise.all(
        currentProducts.map(async (p) => {
          let currentStock = p.stock || 0;
          try {
            const invRes = await axios.get(
              `${BASE_URL}/inventory/article_code/${p.article_code}/${aamarId}/${selectedWh}`
            );
            if (invRes?.data && invRes.data.currentQty !== undefined) {
              currentStock = Number(invRes.data.currentQty) || 0;
            }
          } catch (err) {
            console.error(err);
          }
          return {
            ...p,
            warehouse: selectedWh,
            stock: currentStock,
          };
        })
      );
      setDamageProducts(updatedProducts);
      dispatch(selectProducts(updatedProducts));
    }
  };

  const emptyDamage = async () => {
    const confirmed = await AlertService.confirm("Refresh Cart?", "Start New Damage?");
    if (confirmed) {
      dispatch(selectProducts([]));
      setDamageProducts([]);
      localStorage.removeItem("damage_cart");
    } else {
      console.log("Refresh Operation Cancelled by User");
    }
  };

  const addQuantities = () => { };

  const handleCustomQty = (qty, id) => {
    const currentProducts = damageData?.products || [];
    const newProducts = currentProducts.map((p) => {
      if (p.article_code === id) {
        return {
          ...p,
          qty: qty,
        };
      }
      return p;
    });
    setDamageProducts(newProducts);
    dispatch(selectProducts(newProducts));
  };

  const handleCustomReason = (reason, id) => {
    const currentProducts = damageData?.products || [];
    const newProducts = currentProducts.map((p) => {
      if (p?.article_code === id) {
        return {
          ...p,
          reason: reason,
        };
      }
      return p;
    });
    setDamageProducts(newProducts);
    dispatch(selectProducts(newProducts));
  };

  const removeQuantities = () => { };

  const addToList = async (data) => {
    console.log("data", data);
    if (data) {
      let listData = damageData?.products || [];

      const singleData = Array.isArray(data) && data.length > 0 ? data[0] : data;
      const targetId = singleData?._id;

      // unique check
      const idExist = listData.find((pro) => pro?.id === targetId || pro?.article_code === singleData?.article_code);
      if (idExist) {
        notify("Product Already in List", "error");
        return;
      }

      const currentWh = wh || user?.warehouse;
      let currentStock = singleData?.stock ? singleData?.stock : 0;
      if (currentWh && currentWh !== "allWh") {
        try {
          const invRes = await axios.get(
            `${BASE_URL}/inventory/article_code/${singleData?.article_code}/${aamarId}/${currentWh}`
          );
          if (invRes?.data && invRes.data.currentQty !== undefined) {
            currentStock = Number(invRes.data.currentQty) || 0;
          }
        } catch (err) {
          console.error(err);
        }
      }

      notify("Product is Added", "success");
      const groupName = Array.isArray(singleData?.group)
        ? singleData?.group[0]?.name
        : singleData?.group?.name || singleData?.group || "";

      const newProduct = {
        id: singleData?._id,
        name: singleData?.name,
        article_code: singleData?.article_code,
        qty: 1,
        order: listData?.length + 1,
        tp: singleData?.tp,
        aamarId: aamarId,
        warehouse: currentWh,
        mrp: singleData?.mrp,
        stock: currentStock,
        group: groupName,
        reason: "",
      };

      const updatedList = [...listData, newProduct];
      setDamageProducts(updatedList);
      dispatch(selectProducts(updatedList));
    } else {
      return false;
    }
  };

  const removeFromCart = (id) => {
    const currentProducts = damageData?.products || [];
    const rest = currentProducts.filter((p) => p?.id !== id && p?._id !== id);
    setDamageProducts(rest);
    dispatch(selectProducts(rest));
  };

  const handleOnChangePrice = async (tp, id) => {
    const currentProducts = damageData?.products || [];
    const newProducts = currentProducts.map((p) => {
      if (p?.article_code === id) {
        return {
          ...p,
          tp: tp,
        };
      }
      return p;
    });
    setDamageProducts(newProducts);
    dispatch(selectProducts(newProducts));
  };
  // console.log("damage create page");
  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mt-2">
            <Header title={lang?.createDamage}></Header>
            <Form className="pt-3">
              <div className="row">
                <div className="col-8">
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    {user?.type !== "admin" ? (
                      <p>{whName}</p>
                    ) : (
                      <WareHouseDWPurchase
                        // {...setValue("warehouse", `${wh}`)}
                        id="warehouse"
                        name="warehouse"
                        handleOnChange={handleOnchangeWareHouse}
                        wh={wh !== "" ? wh : 0}
                      // {...register("warehouse")}
                      />
                    )}
                  </Form.Group>
                </div>
                <div className="col-4">
                  <Form.Group className="">
                    <Form.Label>Damage Status</Form.Label>
                    <Form.Select
                      onChange={(e) => dispatch(selectStatus(e.target.value))}
                      disabled
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6 my-md-3">
                  <Form.Label>Damage Products</Form.Label>
                  <DamageNewProductSelect
                    className="searchProduct"
                    // getValue={getValue}
                    addToList={addToList}
                    damageNewProductsRef={damageNewProductsRef}
                    aamarId={aamarId}
                  ></DamageNewProductSelect>
                </div>
                <div className="col-md-6 my-md-3 ">
                  <DamageProductImpoter
                    setCsvData={setCsvData}
                    handleImportButton={handleImportButton}
                    title=""
                  />
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">Damaged Products List</div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <Table className="  mt-3">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Group</th>
                              <th>Stock</th>
                              <th>Quantity</th>
                              <th className="sm-wider">TP</th>
                              {/* <th>Tax</th> */}
                              <th>Total</th>
                              <th>Reason</th>
                            </tr>
                          </thead>

                          <tbody>
                            <DamageProducts
                              damageProducts={damageData?.products}
                              i={i}
                              // removeQuantities={removeQuantities}
                              // addQuantities={addQuantities}
                              handleOnChangePrice={handleOnChangePrice}
                              handleCustomReason={handleCustomReason}
                              handleCustomQty={handleCustomQty}
                              removeFromCart={removeFromCart}
                            ></DamageProducts>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 my-2">
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
                    <th>Total Items:{total_item?.toFixed(2)}</th>
                    <th>Total Cost: {total?.toFixed(2)}</th>
                  </tr>
                </thead>
              </Table>
              <Button
                variant="dark"
                onClick={handleDamageSubmit}
                className="float-end my-2"
                type="button"
              >
                <Icons.SaveOutline size={20} /> Submit
              </Button>
              <Button
                variant="dark"
                className="float-end my-2 mx-2"
                type="button"
                onClick={emptyDamage}
              >
                Reset Cart
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <LoadingModal
        onShow={onShow}
        title="Please Wait.."
        handleClose={handleClose}
      />

      <Toaster position="bottom-right" />
    </div>
  );
};

export default DamageCreate;
