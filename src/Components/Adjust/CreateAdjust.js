import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import LoadingModal from "../Common/Modal/LoadingModal";
import { Toaster } from "react-hot-toast";
import { Button, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import Header from "../Common/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import WareHouseDWPurchase from "../Common/CustomSelect/WareHouseDWPurchase";
import useAdjust from "../Hooks/useAdjust";
import {
  resetAdjust,
  selectNote,
  selectProducts,
  selectStatus,
  selectWareHouse
} from "../../features/adjustSlice";
import * as Icons from "heroicons-react";
import DamageNewProductSelect from "../Common/CustomSelect/DamageNewProductSelect";
import AdjustProductImporter from "../Common/CsvImporter/AdjustProductImporter";
import { notify } from "../Utility/Notify";
import axios from "../../services/apiClient";
import AdjustProducts from "./AdjustProducts";
import { apiUniqueErrHandle } from "../Utility/Utility";
import { useAddAdjustMutation } from "../../services/adjustApi";
import { signInUser } from "../Utility/Auth";

const BASE_URL =
  (process.env.REACT_APP_API_URL || "http://localhost:5006/api").replace(
    /\/$/,
    ""
  ) + "/";

const CreateAdjust = () => {
  const user = signInUser();
  const { aamarId, warehouse: userWarehouse } = user;
  let i = 1;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adjustData = useSelector((state) => state.adjustReducer);
  const lang = useSelector((state) => state.languageReducer);

  const [wh, setWh] = useState(adjustData?.warehouse || userWarehouse || "");

  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);

  const adjustNewProductsRef = useRef(null);

  const [csvData, setCsvData] = useState([]);
  const [adjustProducts, setAdjustProducts] = useState(adjustData?.products || []);

  const { totalItems } = useAdjust();
  const { total_item, total } = totalItems(adjustProducts);

  const [addAdjust] = useAddAdjustMutation();

  // Keep adjustProducts and Redux adjustData.products in sync
  useEffect(() => {
    if (adjustData?.products) {
      setAdjustProducts(adjustData.products);
    }
  }, [adjustData?.products]);

  // Keep wh and Redux adjustData.warehouse in sync
  useEffect(() => {
    if (adjustData?.warehouse && adjustData.warehouse !== wh) {
      setWh(adjustData.warehouse);
    } else if (!adjustData?.warehouse && userWarehouse) {
      setWh(userWarehouse);
      dispatch(selectWareHouse(userWarehouse));
    }
  }, [adjustData?.warehouse, userWarehouse]);

  // Ensure currentStock is loaded for all products in list
  useEffect(() => {
    const currentWh = wh || adjustData?.warehouse || userWarehouse;
    if (currentWh && adjustProducts?.length > 0) {
      const needsStock = adjustProducts.some((p) => p.currentStock === undefined);
      if (needsStock) {
        Promise.all(
          adjustProducts.map(async (p) => {
            if (p.currentStock !== undefined) return p;
            try {
              const res = await axios.get(
                `${BASE_URL}inventory/article_code/${p.article_code}/${aamarId}/${currentWh}`
              );
              const currentStock =
                res?.data?.currentQty !== undefined
                  ? Number(res.data.currentQty) || 0
                  : 0;
              return {
                ...p,
                currentStock,
              };
            } catch (e) {
              return { ...p, currentStock: 0 };
            }
          })
        ).then((updated) => {
          dispatch(selectProducts(updated));
        });
      }
    }
  }, [wh, userWarehouse, aamarId]);

  const handleOnchangeWareHouse = async (e) => {
    const selectedWh = e.option;
    setWh(selectedWh);
    dispatch(selectWareHouse(selectedWh));

    const currentProducts = adjustData?.products || [];
    const updatedProducts = await Promise.all(
      currentProducts.map(async (p) => {
        let currentStock = 0;
        try {
          const invRes = await axios.get(
            `${BASE_URL}inventory/article_code/${p.article_code}/${aamarId}/${selectedWh}`
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
          currentStock,
        };
      })
    );
    dispatch(selectProducts(updatedProducts));
  };

  const handleAdjustSubmit = async () => {
    const currentWarehouse = wh || adjustData?.warehouse || userWarehouse;

    if (!currentWarehouse) {
      notify("Please select a warehouse", "error");
      return;
    }

    const currentProducts = adjustData?.products || [];

    if (currentProducts.length === 0) {
      notify("There must be products for Adjustment", "error");
      return;
    }

    // Validate quantities (must be greater than 0)
    const invalidQty = currentProducts.some(
      (p) => isNaN(parseFloat(p.qty)) || parseFloat(p.qty) <= 0
    );
    if (invalidQty) {
      notify("All product adjustment quantities must be greater than 0", "error");
      return;
    }

    const formattedProducts = currentProducts.map((p, idx) => {
      const currentStock = Number(p.currentStock) || 0;
      const adjustQty = parseFloat(p.qty) || 0;
      const isTypeIn = p.type !== false;
      const finalStock = isTypeIn
        ? currentStock + adjustQty
        : currentStock - adjustQty;

      return {
        ...p,
        warehouse: p.warehouse || currentWarehouse,
        currentStock: currentStock,
        actualQty: finalStock,
        qty: adjustQty,
        order: p.order || idx + 1,
        type: isTypeIn,
      };
    });

    const newAdjust = {
      ...adjustData,
      warehouse: currentWarehouse,
      products: formattedProducts,
      total: total,
      totalItem: total_item,
      aamarId,
      userId: user?.id || user?._id,
    };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Wanna create Adjust?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await addAdjust(newAdjust);
        if (response?.error?.status === 500) {
          apiUniqueErrHandle(response?.error?.data);
        } else {
          dispatch(resetAdjust());
          setAdjustProducts([]);
          notify(`${lang?.adjust || "Adjust"} Creation update successful!`, "success");
          navigate("/adjust");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const emptyAdjust = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Refresh Cart! Start New Adjustment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    });

    if (result.isConfirmed) {
      dispatch(selectProducts([]));
      setAdjustProducts([]);
    } else {
      console.log("Refresh Operation Cancelled by User");
    }
  };

  const addToList = async (data) => {
    if (data) {
      await adjustNewProductsRef.current.blur();
      const currentWh = wh || adjustData?.warehouse || userWarehouse;
      const currentProducts = adjustData?.products || [];
      const realProductId =
        data?.productDetails?.[0]?._id ||
        data?.product?._id ||
        data?.product ||
        data?._id;

      const idExist = currentProducts.find(
        (pro) =>
          pro.article_code === data.article_code ||
          (realProductId && pro.id === realProductId) ||
          (data._id && pro.id === data._id)
      );
      if (idExist) {
        notify("Product Already in List", "error");
        return;
      }

      let currentStock = 0;
      try {
        const invRes = await axios.get(
          `${BASE_URL}inventory/article_code/${data.article_code}/${aamarId}/${currentWh}`
        );
        if (invRes?.data && invRes.data.currentQty !== undefined) {
          currentStock = Number(invRes.data.currentQty) || 0;
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }

      notify("Product is Added", "success");
      const newProd = {
        id: realProductId,
        name: data?.name,
        article_code: data?.article_code,
        currentStock: currentStock,
        qty: 1,
        order: currentProducts.length + 1,
        priceId: data?.priceList?.[0]?._id || null,
        tp: data?.priceList?.[0]?.tp || data?.tp || 0,
        aamarId: aamarId,
        warehouse: currentWh,
        reason: "",
        type: true,
      };
      const newList = [...currentProducts, newProd];
      dispatch(selectProducts(newList));
    } else {
      return false;
    }
  };

  const handleImportButton = async () => {
    console.log("handleImportButton called, csvData:", csvData);
    if (csvData?.length > 0) {
      setOnShow(true);
      const currentWh = wh || adjustData?.warehouse || userWarehouse;
      try {
        const importPromises = csvData.map(async (pro, index) => {
          console.log(`Processing row ${index}:`, pro);
          if (!pro.article_code) return null;
          try {
            const details = await axios(
              `${BASE_URL}product/pro-details/${pro.article_code}`
            );
            console.log(`Details for ${pro.article_code}:`, details.data);
            if (details.status === 200) {
              const data = details.data;
              let currentStock = 0;
              try {
                const invRes = await axios.get(
                  `${BASE_URL}inventory/article_code/${data.article_code}/${aamarId}/${currentWh}`
                );
                if (invRes?.data && invRes.data.currentQty !== undefined) {
                  currentStock = Number(invRes.data.currentQty) || 0;
                }
              } catch (e) {
                console.error(e);
              }

              const isTypeIn =
                typeof pro.type === "string"
                  ? pro.type.toLowerCase().trim() !== "out"
                  : pro.type !== false;
              const adjustQty = parseFloat(pro.qty) || 0;
              const finalStock = isTypeIn
                ? currentStock + adjustQty
                : currentStock - adjustQty;

              return {
                id: data?._id,
                article_code: data?.article_code,
                priceId: data?.priceList?.[0]?._id || null,
                tp: data?.priceList?.[0]?.tp || data?.tp || 0,
                name: data?.name,
                currentStock: currentStock,
                qty: adjustQty,
                type: isTypeIn,
                actualQty: finalStock,
                reason: pro.reason || "",
                aamarId: aamarId,
                warehouse: currentWh,
                order: index + 1,
              };
            }
          } catch (err) {
            console.log(err);
            return null;
          }
          return null;
        });

        const results = await Promise.all(importPromises);
        const validProducts = results.filter((p) => p !== null);

        if (validProducts.length > 0) {
          dispatch(selectProducts(validProducts));
          notify(
            `${validProducts.length} products imported successfully`,
            "success"
          );
        } else {
          notify("No valid products found for import", "error");
        }
      } catch (err) {
        console.log(err);
        notify("Import failed", "error");
      } finally {
        setOnShow(false);
      }
    } else {
      notify("There is no products to import", "error");
    }
  };

  const handleOnChangePrice = async (id, e) => {
    try {
      let price = await axios.get(`${BASE_URL}price/${e.option}`);
      if (price.data) {
        const newProducts = (adjustData?.products || []).map((item) =>
          item.id === id
            ? {
                ...item,
                tp: price.data?.tp,
                priceId: price.data?._id,
              }
            : item
        );
        dispatch(selectProducts(newProducts));
      }
    } catch (err) {
      notify(err, "error");
    }
  };

  const handleCustomQty = (qty, id) => {
    const newProducts = (adjustData?.products || []).map((p) => {
      if (p.article_code === id) {
        return {
          ...p,
          qty: qty,
        };
      }
      return p;
    });
    dispatch(selectProducts(newProducts));
  };

  const handleCustomReason = (reason, id) => {
    const newProducts = (adjustData?.products || []).map((p) =>
      p.article_code === id ? { ...p, reason: reason } : p
    );
    dispatch(selectProducts(newProducts));
  };

  const removeFromCart = (id) => {
    const rest = (adjustData?.products || []).filter((p) => p.id !== id);
    dispatch(selectProducts(rest));
  };

  const handleDeSelectIsType = (id) => {
    const newProducts = (adjustData?.products || []).map((p) =>
      p.article_code === id ? { ...p, type: false } : p
    );
    dispatch(selectProducts(newProducts));
  };

  const handleIsType = (id) => {
    const newProducts = (adjustData?.products || []).map((p) =>
      p.article_code === id ? { ...p, type: true } : p
    );
    dispatch(selectProducts(newProducts));
  };

  // console.log("Adjust", total, total_item);

  // useEffect(() => {
  //   totalItems(adjustProducts);
  // }, [adjustProducts]);

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10 mt-2">
            <Header title={lang?.createAdjust}></Header>
            <Form className="pt-3" action="javascript:void(0)">
              <div className="row">
                <div className="col-8">
                  <Form.Group className="" controlId="warehouse">
                    <Form.Label>Warehouse</Form.Label>
                    <WareHouseDWPurchase
                      id="warehouse"
                      name="warehouse"
                      handleOnChange={handleOnchangeWareHouse}
                      wh={wh !== "" ? wh : 0}
                      // {...register("warehouse")}
                    />
                  </Form.Group>
                </div>
                <div className="col-4">
                  <Form.Group className="">
                    <Form.Label>Adjust Status</Form.Label>
                    <Form.Select
                      onChange={(e) => dispatch(selectStatus(e.target.value))}
                    >
                      <option value="active">Active</option>
                      <option disabled value="inactive">
                        Inactive
                      </option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-6 my-3">
                  <Form.Label>Adjust Products</Form.Label>
                  <DamageNewProductSelect
                    className="searchProduct"
                    // getValue={getValue}
                    addToList={addToList}
                    damageNewProductsRef={adjustNewProductsRef}
                    aamarId={aamarId}
                  ></DamageNewProductSelect>
                </div>
                <div className="col-6 my-3 ">
                  <AdjustProductImporter
                    setCsvData={setCsvData}
                    handleImportButton={handleImportButton}
                    title=""
                  />
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">Adjusted Products List</div>
                    <div className="card-body">
                      <Table hover bordered striped className="mt-3 ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Adjust Qty</th>
                            <th>Type</th>
                            <th>Final Stock</th>
                            <th>TP</th>
                            {/* <th>Tax</th> */}
                            <th>Total</th>
                            <th>Reason</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          <AdjustProducts
                            adjustProducts={adjustProducts}
                            i={i}
                            handleOnChangePrice={handleOnChangePrice}
                            handleCustomQty={handleCustomQty}
                            removeFromCart={removeFromCart}
                            handleCustomReason={handleCustomReason}
                            handleIsType={handleIsType}
                            handleDeSelectIsType={handleDeSelectIsType}
                          ></AdjustProducts>
                        </tbody>
                      </Table>
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
                    <th>Total Items:{total_item}</th>
                    <th>Adjust Value: {total?.toFixed(2)} TK</th>
                  </tr>
                </thead>
              </Table>
              <Button
                variant="dark"
                onClick={handleAdjustSubmit}
                className="float-end my-2"
                type="button"
              >
                <Icons.SaveOutline size={20} /> Submit
              </Button>
              <Button
                variant="dark"
                className="float-end my-2 mx-2"
                type="button"
                onClick={emptyAdjust}
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

export default CreateAdjust;
