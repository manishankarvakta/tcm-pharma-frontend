import * as Icons from "heroicons-react";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Purchase.css";
// import useCarts from "../Hooks/useCarts";
import axios from "../../services/apiClient";
import { format } from "date-fns";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import usePurchase from "../Hooks/usePurchase";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import useInventory from "../Hooks/useInventory";
import AlertService from "../Utility/AlertService";

import { AiOutlineClose } from "react-icons/ai";
import { BsArchive, BsCheckSquare, BsSquare } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useKeypress from "react-use-keypress";
import {
  resetGrn,
  selectCalculation,
  selectDiscount,
  selectDiscountTotal,
  selectNote,
  selectPoNo,
  selectProducts,
  selectShipping,
  selectStatus,
  selectSupplier,
  selectTPNNo,
  selectUser,
  selectWareHouse,
  selectAamarId,
} from "../../features/grnSlice";
import { useAddGrnMutation, useGrnCountQuery } from "../../services/grnApi";
import { useAddPriceMutation } from "../../services/priceApi";
import {
  useAddPurchaseMutation,
  useUpdatePurchaseStatusMutation,
} from "../../services/purchasApi";
import SelectPurchase from "../Common/CustomSelect/SelectPurchase";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import SelectTPN from "../Common/CustomSelect/SelectTPN";
import LoadingModal from "../Common/Modal/LoadingModal";
import { apiUniqueErrHandle } from "../Utility/Utility";
import PackageModal from "../Common/Modal/PackageModal";
// import PosCart from "../Pages/POS/Parts/PosCart";
// import useProducts from "../Hooks/useProducts";

const GRNCreate = () => {
  let i = 1;
  let j = 1;
  let navigate = useNavigate();
  const user = signInUser();
  const { aamarId } = user;

  const [isVatCheck, setIsVatCheck] = useState(false);
  const [vatPercent, setVatPercent] = useState(0);

  const [poNo, setPoNo] = useState("");
  const [grnNote, setGrnNote] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [isPO, setIsPO] = useState(false);
  const [isTPN, setIsTPN] = useState(false);
  const [isNoPo, setIsNoPo] = useState(true);
  const [onShow, setOnShow] = useState(false);
  const [newPrice, setNewPrice] = useState(false);
  const [grnProducts, setGrnProducts] = useState([]);
  const [cal, setCal] = useState([]);
  const statusRef = useRef();

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });
  const [poList, setPoList] = useState([]);
  const [updatePrice, setUpdatePrice] = useState(false);
  const {
    grnTotalItems,
    updatePurchaseStatus,
    totalItems,
    purchase,
    setPurchase,
  } = usePurchase();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const dispatch = useDispatch();
  const grnData = useSelector((state) => state.grnReducer);
  const handleClose = () => setOnShow(false);

  console.log("grnData", grnData);

  // RTK API CALL
  const [addGrn] = useAddGrnMutation();
  const [updatePurchase] = useUpdatePurchaseStatusMutation();
  const [addPrice] = useAddPriceMutation();
  const [purchaseProduct, setPurchaseProduct] = useState([]);
  const [supplierProduct, setSupplierProduct] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successGrnCode, setSuccessGrnCode] = useState("");

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessGrnCode("");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showSuccessModal) {
        handleCloseSuccessModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuccessModal]);

  useEffect(() => {
    if (!grnData?.warehouse && user?.warehouse) {
      dispatch(selectWareHouse(user.warehouse));
    }
    if (!grnData?.aamarId && (aamarId || user?.aamarId)) {
      dispatch(selectAamarId(aamarId || user?.aamarId));
    }
  }, [user?.warehouse, user?.aamarId, aamarId, grnData?.warehouse, grnData?.aamarId, dispatch]);

  const { data: countData } = useGrnCountQuery({ aamarId });

  const { updateInventoryIn } =
    useInventory();
  const { total_item, total, tax, discount, productList } = totalItems(
    purchaseProduct?.products
  );
  const [addPurchase] = useAddPurchaseMutation();
  const {
    grntotal_item,
    grntotal,
    grntax,
    grndiscount,
    grnproductList,
    groundTotal,
  } = grnTotalItems(grnData.products);
  // const [grn, setGrn] = useState({});
  // console.log(grnData.shipping_cost);
  // console.log(grntotal_item, grntotal, grntax);

  const [filteredProduct, setFilteredProduct] = useState(supplierProduct);
  const supplierSearchRef = useRef(null);
  const firstProductRef = useRef(null);
  const tableRef = useRef(null);

  // console.log("supplier", supplierProduct);

  useKeypress("F1", (e) => {
    e.preventDefault();
    supplierSearchRef.current.value = "";
    supplierSearchRef.current.focus();
  });

  useEffect(() => {
    setFilteredProduct(supplierProduct);
  }, [supplierProduct]);

  useEffect(() => {
    if (isFull) {
      dispatch(selectStatus("Complete"));
    } else {
      dispatch(selectStatus("Partial"));
    }
  }, [isFull]);

  useEffect(() => {
    const newP = grnData?.ptoducts?.find((pro) => pro.newPrice === true);
    // console.log(grnData?.products);
    if (newP) {
      setNewPrice(true);
    } else {
      setNewPrice(false);
    }
  }, [grnData?.ptoducts]);

  // console.log(newPrice);

  useEffect(() => {
    grnData?.ptoducts?.length > 0 && setGrnProducts(grnData.products);
    dispatch(
      selectCalculation({
        totalItem: grntotal_item,
        total: grntotal,
        tax: grntax,
        groundTotal: groundTotal,
      })
    );
  }, [grntotal, grnData.products]);

  // console.log('grnData', grnData);

  // useEffect(() => {
  //   grnData?.ptoducts?.length > 0 && setGrnProducts(grnData.products);
  //   dispatch(
  //     selectCalculation({
  //       totalItem: grntotal_item,
  //       total: grntotal,
  //       tax: grntax,
  //       groundTotal: groundTotal,
  //     })
  //   );
  // }, []);

  // console.log(grnData);

  const handleSupplierSelectItem = async (item) => {
    // console.log(item.id);

    let newList = [];
    const result = await axios.get(`${BASE_URL}/product/${item.id}`);
    // console.log("result", result);
    if (grnData.products.length > 0) {
      const exist = grnData?.products.find((p) => p.id === item.id);
      const rest = grnData?.products.filter((p) => p.id !== item.id);
      if (exist) {
        newList = [...grnData.products];
        dispatch(selectProducts(newList));
        notify("Products Already Selected", "error");
      } else {
        notify("Product is added", "success");

        newList = [
          ...rest,
          {
            id: item?.id,
            article_code: item?.article_code,
            aamarId: aamarId,
            warehouse: user?.warehouse,
            // priceId: item?.priceId?._id,
            tp: item?.tp ? item?.tp : 0,
            mrp: item?.mrp ? item?.mrp : 0,
            newPrice: false,
            name: item.name,
            group: item.group,
            // mrp: result?.data?.mrp ? result?.data?.mrp : 0,
            tax: item.tax,
            qty: item.qty,

            // unit: item.unit,
            discount: 0,
            order: grnData.products.length + 1,
          },
        ];
      }

      // console.log(grnData.products, purchaseProduct.products);
      dispatch(selectProducts(newList));
      setIsFull(false);
    } else {
      newList = [
        {
          id: item?.id,
          article_code: item?.article_code,
          // // priceId: item?.priceId?._id,
          tp: item?.tp ? item?.tp : 0,
          newPrice: false,
          name: item?.name,
          group: item.group,
          aamarId: aamarId,
          warehouse: user?.warehouse,
          mrp: item?.mrp ? item?.mrp : 0,
          // mrp: result?.data?.mrp ? result?.data?.mrp : 0,
          tax: item?.tax,
          qty: item?.qty,
          // unit: item?.unit,
          discount: 0,
          order: grnData?.products?.length + 1,
        },
      ];
      dispatch(selectProducts(newList));
    }
  };
  const handleSelectItem = async (id) => {
    // console.log(id);

    let newList = [];
    if (purchaseProduct?.products?.length > 0) {
      const selected = purchaseProduct?.products.find((p) => p.id === id);
      const result = await axios.get(`${BASE_URL}/product/${selected?.id}`);
      // console.log("result", result);
      if (grnData.products.length > 0) {
        const exist = grnData?.products.find((p) => p.id === id);
        const rest = grnData?.products.filter((p) => p.id !== id);
        if (exist) {
          newList = [...grnData.products];
          dispatch(selectProducts(newList));
          notify("Products Already Selected", "error");
        } else {
          notify("Product is added", "success");

          newList = [
            ...rest,
            {
              id: selected?.id,
              article_code: selected?.article_code,
              // priceId: selected?.priceId?._id,
              tp: selected?.tp ? selected?.tp : 0,
              // mrp: selected?.mrp ? selected?.mrp : 0,
              newPrice: false,
              name: selected.name,
              aamarId: aamarId,
              warehouse: user?.warehouse,
              group: selected.group,
              mrp: result?.data?.mrp ? result?.data?.mrp : 0,
              tax: selected.tax,
              qty: selected.qty,
              unit: selected.unit,
              discount: 0,
              order: grnData.products.length + 1,
            },
          ];
        }

        // console.log(grnData.products, purchaseProduct.products);
        dispatch(selectProducts(newList));
        setIsFull(false);
      } else {
        newList = [
          {
            id: selected?.id,
            article_code: selected?.article_code,
            // // priceId: selected?.priceId?._id,
            tp: selected?.tp ? selected?.tp : 0,
            newPrice: false,
            name: selected?.name,
            group: selected.group,
            aamarId: aamarId,
            warehouse: user?.warehouse,
            // mrp: selected?.mrp ? selected?.mrp : 0,
            mrp: result?.data?.mrp ? result?.data?.mrp : 0,
            tax: selected?.tax,
            qty: selected?.qty,
            unit: selected?.unit,
            discount: 0,
            order: grnData?.products?.length + 1,
          },
        ];
        dispatch(selectProducts(newList));
      }
    }
  };

  // HANDLE CUSTOM QTY
  const handleCustomQty = (e, items) => {
    const customQty = e.target.value !== "" ? e.target.value : 0;
    if (purchaseProduct?.products?.length > 0) {
      const seleted = purchaseProduct.products.find((p) => p.id === items.id);
      const item = grnData.products.find((p) => p.id === items.id);
      const remain = grnData.products.filter((p) => p.id !== items.id);
      // console.log(e.target.value, seleted.qty);
      if (item) {
        // let restItem = cartItems.filter((item) => item.article_code !== id);
        const newGrn = [
          ...remain,
          {
            ...item,
            qty: customQty,
          },
        ];
        dispatch(selectProducts(newGrn));
        setIsFull(false);

        // if (customQty >= 0) {
        //   if (seleted.qty >= customQty) {
        //     const newGrn = [
        //       ...remain,
        //       {
        //         ...item,
        //         qty: customQty,
        //       },
        //     ];
        //     dispatch(selectProducts(newGrn));
        //     setIsFull(false);
        //   }
        // }
      }
    }
    if (supplierProduct.length > 0) {
      const item = grnData.products.find((p) => p.id === items.id);
      const remain = grnData.products.filter((p) => p.id !== items.id);
      // console.log(e.target.value, seleted.qty);
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
          setIsFull(false);
        }
      }
    }
  };
  // HANDLE CUSTOM TP
  const handleCustomTp = (e, items) => {
    const customTp = e.target.value !== "" ? e.target.value : 0;

    const item = grnData.products.find((p) => p.id === items.id);
    const remain = grnData.products.filter((p) => p.id !== items.id);
    if (item) {
      if (customTp >= 0) {
        const newGrn = [
          ...remain,
          {
            ...item,
            tp: customTp,
          },
        ];
        dispatch(selectProducts(newGrn));
        setIsFull(false);
      }
    }
  };

  // HANDLE CUSTOM MRP
  const handleCustomMrp = (e, id) => {
    const customMrp = e.target.value !== "" ? e.target.value : 0;

    const item = grnData.products.find((p) => p.id === id);
    const remain = grnData.products.filter((p) => p.id !== id);

    if (item) {
      if (customMrp >= 0) {
        const newGrn = [
          ...remain,
          {
            ...item,
            mrp: customMrp,
          },
        ];
        dispatch(selectProducts(newGrn));
        setIsFull(false);
      }
    }
  };

  const removeFromGrn = (id) => {
    const remain = grnData.products.filter((p) => p.id !== id);
    dispatch(selectProducts(remain));
    setIsFull(false);
  };
  const removeAllFromGrn = () => {
    dispatch(selectProducts([]));
    setIsFull(false);
  };

  const handleSelectAllProducts = (products) => {
    notify("All products added", "success");
    // console.log("select all");
    // console.log("select all", products);
    let seletedProducts = [];
    let i = 1;
    if (products?.length > 0) {
      products.map(async (pro) => {
        // const result = await axios.get(`${BASE_URL}/product/${pro?.id}`);
        // console.log("result", result)
        seletedProducts = [
          ...seletedProducts,
          {
            id: pro.id,
            article_code: pro?.article_code,
            tp: pro?.tp,
            name: pro?.name,
            aamarId: aamarId,
            warehouse: user?.warehouse,
            // mrp: result?.data?.mrp ? result?.data?.mrp : 0,
            mrp: pro?.mrp ? pro?.mrp : 0,
            tax: pro?.tax,
            qty: pro?.qty,
            unit: pro?.unit,
            discount: 0,
            order: pro.order,
          },
        ];
        // if (result.data) {
        //   seletedProducts = [
        //     ...seletedProducts,
        //     {
        //       id: pro.id,
        //       article_code: pro?.article_code,
        //       tp: pro?.tp,
        //       name: pro?.name,
        //       mrp: result?.data?.mrp ? result?.data?.mrp : 0,
        //       // mrp: pro?.mrp,
        //       tax: pro?.tax,
        //       qty: pro?.qty,
        //       unit: pro?.unit,
        //       discount: 0,
        //       order: pro.order,
        //     },
        //   ];
        // }
        // await axios.get(`${BASE_URL}/product/${pro?.id}`)
        //   .then(result => {
        //     console.log(result)
        //     seletedProducts = [
        //       ...seletedProducts,
        //       {
        //         id: pro.id,
        //         article_code: pro?.article_code,
        //         tp: pro?.tp,
        //         name: pro?.name,
        //         mrp: result?.data?.mrp ? result?.data?.mrp : 0,
        //         // mrp: pro?.mrp,
        //         tax: pro?.tax,
        //         qty: pro?.qty,
        //         unit: pro?.unit,
        //         discount: 0,
        //         order: pro.order,
        //       },
        //     ];
        //     console.log("seletedProducts", selectProducts);
        //     console.log("pro", pro);
        //   })
        //   .catch(err => console.log(err))
        // console.log("seletedProducts", selectProducts);
      });
      // console.log("seletedProducts", selectProducts);
      dispatch(selectProducts([]));
      dispatch(selectProducts(seletedProducts));
      setIsFull(true);
    }
  };
  const handleDeselectAllProducts = () => {
    notify("All products removed", "error");
    dispatch(selectProducts([]));
    setIsFull(false);
  };

  // CREATE GRN
  const handleGrnSubmit = async () => {
    // console.log(grnData);
    let newIn = [];
    if (grnData?.poNo !== null) {
      // console.log(poNo);
      // console.log(statusRef.current.value);
      const statusP = statusRef?.current?.value;
      const sp = { poNo: poNo, status: statusP };
      if (statusP === "Received") {
        dispatch(selectStatus("Complete"));
      }
      // console.log(grnData);

      if (grnData?.products.length > 0) {
        const confirmed = await AlertService.confirm("Are you sure?", "Wanna create GRN?");
        if (confirmed) {
          if (grnData.poNo === "") {
            notify("Please Select PO ", "error");
          } else {
            try {
              setLoader(true);
              const response = await addGrn({
                ...grnData,
                aamarId: aamarId || user?.aamarId,
                warehouse: grnData?.warehouse || user?.warehouse,
                userId: grnData?.userId || user?.id || user?._id,
              });
              // console.log(response);
              if (response?.data?.status === "success" || response?.data?.data) {
                await updatePurchase(sp);
                dispatch(resetGrn());
                setPoNo("");
                const code =
                  response?.data?.data?.grnNo ||
                  response?.data?.grnNo ||
                  "";
                setSuccessGrnCode(code);
                setShowSuccessModal(true);
                notify(`GRN Creation successful!`, "success");
              } else {
                apiUniqueErrHandle(response?.data);
              }
            } catch (err) {
              console.log(err);
            } finally {
              setPurchaseProduct([]);
              setLoader(false);
            }
          }
        }
      } else {
        notify("There must be products for GRN", "error");
      }
    }

    if (grnData.poNo === null) {
      const poData = {
        aamarId: aamarId,
        poNo: "",
        supplier: grnData.supplier ? grnData.supplier : "",
        warehouse: user?.warehouse,
        products: grnData.products ? grnData.products : [],
        type: "",
        note: "",
        doc: "",
        totalItem: grnData.totalItem ? grnData.totalItem : 0,
        total: grnData.total ? grnData.total : 0,
        discount: 0,
        tax: 0,
        shipping_cost: grnData.shipping_cost ? grnData.shipping_cost : 0,
        userId: grnData.userId ? grnData.userId : 0,
        status: "Received",
      };
      // console.log(poData);
      setLoader(true);
      try {
        const confirmed = await AlertService.confirm("Are you Sure?", "Create this GRN?");
        if (confirmed) {
          await addPurchase(poData)
            .then(async (res) => {
              // console.log(res);

              const newGrn = {
                ...grnData,
                aamarId: aamarId || user?.aamarId,
                warehouse: grnData?.warehouse || user?.warehouse,
                userId: grnData?.userId || user?.id || user?._id,
                poNo: res?.data?.purchase?._id,
                poId: res?.data?.purchase?.poNo,
                status: "Complete",
              };
              // console.log(grnData);
              // console.log(newGrn);
              // console.log(grnData);
              await addGrn(newGrn)
                .then(async (resGrn) => {
                  if (resGrn?.data?.status === "success" || resGrn?.data?.data) {
                    dispatch(resetGrn());
                    setPoNo("");
                    const code =
                      resGrn?.data?.data?.grnNo ||
                      resGrn?.data?.grnNo ||
                      "";
                    setSuccessGrnCode(code);
                    setShowSuccessModal(true);
                    notify("GRN Creation update successful!", "success");
                  } else {
                    apiUniqueErrHandle(resGrn?.data);
                  }
                });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          notify("Can not create purchase", "error");
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setPurchaseProduct([]);
        setLoader(false);
      }
    }
  };

  // refetch supplier product
  const refetchSupplierProduct = async () => {
    if (!grnData?.supplier) {
      notify("Please select a supplier first", "error");
      return;
    }
    try {
      setLoader(true);
      if (grnData?.supplier === "cash" || grnData?.supplier === "Mr. Cash") {
        const response = await axios.get(
          `${BASE_URL}/product/productlist/${aamarId}`
        );
        let supplierProducts = [];
        if (response.data?.products?.length > 0) {
          supplierProducts = response.data.products.map((product, index) => ({
            id: product._id,
            article_code: product.article_code,
            tp: product.tp ? product.tp : 0,
            mrp: product.mrp ? product.mrp : 0,
            name: product.name,
            aamarId: aamarId,
            warehouse: grnData?.warehouse || user?.warehouse,
            group: product.group?.name ? product.group?.name : "",
            stock: 0,
            tax: 0,
            qty: 0,
            discount: 0,
            order: index + 1,
          }));
        }
        setSupplierProduct(supplierProducts);
        setFilteredProduct(supplierProducts);
        if (supplierSearchRef?.current) {
          supplierSearchRef.current.value = "";
        }
        notify("Supplier products reloaded successfully!", "success");
        return;
      }

      const supplierP = await axios.get(
        `${BASE_URL}/supplier/details/${aamarId}/${grnData.supplier}${
          grnData?.warehouse || user?.warehouse
            ? `?warehouse=${grnData?.warehouse || user?.warehouse}`
            : ""
        }`
      );

      let supplierProducts = [];
      if (supplierP.data?.productDetails?.length > 0) {
        supplierProducts = supplierP.data.productDetails.map((product, index) => ({
          id: product.id,
          article_code: product.article_code,
          tp: product.tp ? product.tp : 0,
          mrp: product.mrp ? product.mrp : 0,
          aamarId: aamarId,
          warehouse: grnData?.warehouse || user?.warehouse,
          name: product.name,
          group: product.group,
          stock: product.stock,
          tax: 0,
          qty: 0,
          discount: 0,
          order: index + 1,
        }));
      }
      setSupplierProduct(supplierProducts);
      setFilteredProduct(supplierProducts);
      if (supplierSearchRef?.current) {
        supplierSearchRef.current.value = "";
      }
      notify("Supplier products reloaded successfully!", "success");
    } catch (err) {
      console.error("Error reloading supplier products:", err);
      notify("Failed to reload supplier products", "error");
    } finally {
      setLoader(false);
    }
  };

  const handleSupplierChange = async (e) => {
    dispatch(resetGrn());
    setPurchaseProduct([]);
    // console.log(e);

    let supplierProducts = [];
    const isCashSupplier =
      e.label === "Mr. Cash" || e.label === "Mr.Cash" || e.label === "Cash";

    if (isCashSupplier) {
      try {
        const response = await axios.get(
          `${BASE_URL}/product/productlist/${aamarId}`
        );
        if (response.data?.products?.length > 0) {
          supplierProducts = response.data.products.map((product, index) => ({
            id: product._id,
            article_code: product.article_code,
            tp: product.tp ? product.tp : 0,
            mrp: product.mrp ? product.mrp : 0,
            name: product.name,
            aamarId: aamarId,
            warehouse: user?.warehouse,
            group: product.group?.name ? product.group?.name : "",
            stock: 0,
            tax: 0,
            qty: 0,
            discount: 0,
            order: index + 1,
          }));
        }
      } catch (err) {
        console.error("Error fetching all products for Cash supplier:", err);
      }
    } else {
      try {
        const supplierP = await axios.get(
          `${BASE_URL}/supplier/details/${aamarId}/${e.option}`
        );

        if (supplierP.data?.productDetails?.length > 0) {
          supplierProducts = supplierP.data.productDetails.map(
            (product, index) => ({
              id: product.id,
              article_code: product.article_code,
              tp: product.tp ? product.tp : 0,
              mrp: product.mrp ? product.mrp : 0,
              name: product.name,
              aamarId: aamarId,
              warehouse: user?.warehouse,
              group: product.group,
              stock: product.stock,
              tax: 0,
              qty: 0,
              discount: 0,
              order: index + 1,
            })
          );
        }
      } catch (err) {
        console.error("Error fetching supplier products:", err);
      }
    }

    // console.log(supplierProducts);
    setSupplierProduct(supplierProducts);
    dispatch(selectSupplier(e.option));
    dispatch(selectUser(user.id));
  };
  // const handleSupplierChange = async (e) => {
  //   dispatch(resetGrn())
  //   setPurchaseProduct([])
  //   console.log(e)
  //   const supplierP = await axios.get(`${BASE_URL}/supplier/grn/${e.option}`);

  //   console.log(supplierP.data)
  //   let supplierProducts = []
  //   if (supplierP.data?.products?.length > 0) {
  //     supplierP.data?.products?.map((product, index) => {
  //       supplierProducts = [...supplierProducts,
  //       {
  //         id: product.id._id,
  //         article_code: product.id.article_code,
  //         tp: product.id.tp,
  //         mrp: product.id.mrp,
  //         name: product.id.name,
  //         group: product.id.group.name,
  //         tax: 0,
  //         qty: 0,
  //         discount: 0,
  //         order: index + 1,

  //       }]
  //     })

  //   }
  //   console.log(supplierProducts)
  //   setSupplierProduct(supplierProducts)
  //   dispatch(selectSupplier(e.option));
  //   dispatch(selectUser(user.id));

  // }

  const handleVendorChange = async (value) => {
    try {
      // Set the PO number first
      setPoNo(value?.option);

      // Fetch the purchase data
      const response = await axios.get(
        `${BASE_URL}/purchase/grn/${aamarId}/${value?.option}`
      );

      if (response?.data) {
        const purchaseData = response.data;

        // Dispatch the fetched data to the store
        dispatch(selectShipping(purchaseData.shipping_cost));
        setPurchaseProduct(purchaseData);
        dispatch(selectSupplier(purchaseData?.supplier?._id));
        dispatch(selectWareHouse(purchaseData?.warehouse));
        dispatch(selectPoNo({ id: purchaseData?._id, no: purchaseData?.poNo }));
        dispatch(selectUser(user?.id));
        dispatch(selectDiscount(purchaseData?.discount || 0));

        // Reset products and supplier products
        dispatch(selectProducts([]));
        setSupplierProduct([]);
        setNewPrice(false);
      } else {
        console.error("No purchase data found");
      }
    } catch (error) {
      console.error("Error fetching purchase order:", error);
    }
  };

  const handleTPNChange = async (e) => {
    // console.log(e);
    await axios
      .get(`${BASE_URL}/tpn/grn/${aamarId}/${e?.option}`)
      .then((response) => {
        // console.log(response);
        dispatch(selectShipping(response?.data?.shipping_cost));
        setPurchaseProduct(response.data);
        // dispatch(selectSupplier(response.data.supplier._id));
        dispatch(selectWareHouse(response.data.warehouseTo?._id));
        dispatch(selectTPNNo({ id: response.data._id }));
        dispatch(selectUser(user.id));
        // console.log(response.data);
        dispatch(selectProducts([]));
        setNewPrice(false);
        setSupplierProduct([]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNewPrice = (id) => {
    let pro = grnData.products;
    const select = pro.find((p) => p.id === id);
    const rest = pro.filter((p) => p.id !== id);
    // console.log(pro, state);
    let newProduct = [...rest, { ...select, newPrice: !select.newPrice }];
    // console.log(rest, select, id);
    dispatch(selectProducts(newProduct));

    // return { ...state, products:  };
  };

  // selected PO
  // console.log(purchaseProduct);

  // console.log(purchaseProduct.products);
  const handleIsPO = () => {
    setIsPO(true);
    setIsTPN(false);
    setIsNoPo(false);
    dispatch(resetGrn());
    setSupplierProduct([]);
  };
  const handleDeSelectIsPO = () => {
    setIsPO(false);
    setIsTPN(true);
    setIsNoPo(false);
    dispatch(resetGrn());
  };
  const handleIsTPN = () => {
    setIsPO(false);
    setIsTPN(true);
    setIsNoPo(false);
    dispatch(resetGrn());
    setSupplierProduct([]);
  };
  const handleDeselectIsTPN = () => {
    setIsPO(true);
    setIsTPN(false);
    setIsNoPo(false);
    dispatch(resetGrn());
  };
  const handleDeselectIsNoPo = () => {
    setIsPO(true);
    setIsTPN(false);
    setIsNoPo(false);
    setPurchaseProduct([]);
  };
  const handleIsNoPO = () => {
    setIsPO(false);
    setIsTPN(false);
    setIsNoPo(true);
  };
  // const handleTPNChange = (e) => {
  //   console.log(e)
  // }

  const handleSearch = (q) => {
    // console.log(q);
    // console.log(supplierProduct);
    setSelectedIndex(0);
    if (q.length > 0) {
      const re = new RegExp(q, "i");
      const filtered = supplierProduct.filter((entry) =>
        Object.values(entry).some(
          (val) => typeof val === "string" && val.match(re)
        )
      );

      if (filtered.length > 0) {
        setFilteredProduct(filtered);
      } else {
        setFilteredProduct([]);
      }
      // console.log("Original:", supplierProduct);
      // console.log("filter:", filtered);
    } else {
      setFilteredProduct(supplierProduct);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < filteredProduct.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
  };
  const handleOnEnter = (event) => {
    // console.log("event", event);
    if (event.keyCode === 40) {
      tableRef.current.focus(); // Check if the ref and focus() method are correct
    }
  };
  const handleAddKeyPress = (e, item) => {
    // console.log(e)
    // console.log(item)
    // const newIndex = selectedIndex + 1; // Calculate the index of the newly selected row
    // setSelectedIndex(newIndex); // Update the selected index state

    // Access the corresponding item from the filteredProduct array
    const selectedRowItem = filteredProduct[selectedIndex];

    // console.log("Selected item:", selectedRowItem);
    handleSupplierSelectItem(selectedRowItem);
    // if (e.keyCode === 13) {
    // }
  };

  const handleVatCheck = () => {
    setIsVatCheck(!isVatCheck);
  };

  return (
    <div>
      <div className="container-fluid ">
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
            <Header title="Goods Receive Note"></Header>
            <div className="row">
              <div className="row gap-1">
                <div className="col-auto">
                  <Link
                    to="/grn"
                    className="btn btn-dark btn-md w-100 d-flex align-items-center justify-content-center gap-2 m-2"
                  >
                    <Icons.ClipboardCheckOutline size={18} />
                    <span>GRN</span>
                  </Link>
                </div>
              </div>

              {/* PURCHASE PRODUCT */}
              <div className="col-md-5">
                <div className="row">
                  <div className="col-12">
                    <Form.Label className="mt-3 w-full">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <b>Purchase Order No </b>
                          {isPO ? (
                            <BsCheckSquare
                              onClick={() => handleDeSelectIsPO()}
                            />
                          ) : (
                            <BsSquare onClick={() => handleIsPO()} />
                          )}
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-3">
                          <b>TPN No </b>
                          {isTPN ? (
                            <BsCheckSquare
                              onClick={() => handleDeselectIsTPN()}
                            />
                          ) : (
                            <BsSquare onClick={() => handleIsTPN()} />
                          )}
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-3">
                          <b> Without Po </b>
                          {isNoPo ? (
                            <BsCheckSquare
                              onClick={() => handleDeselectIsNoPo()}
                            />
                          ) : (
                            <BsSquare onClick={() => handleIsNoPO()} />
                          )}
                        </div>
                      </div>
                    </Form.Label>
                    {isPO ? (
                      <SelectPurchase
                        handleVendorChange={handleVendorChange}
                      ></SelectPurchase>
                    ) : (
                      <></>
                    )}
                    {isTPN ? (
                      <SelectTPN
                        handleVendorChange={handleTPNChange}
                      ></SelectTPN>
                    ) : (
                      <></>
                    )}
                    {isNoPo ? (
                      <SelectSupplier
                        handleOnchange={handleSupplierChange}
                      ></SelectSupplier>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* <div className="col-12">
                    <Form.Group className="mb-3" controlId="formBasicName">
                      <Form.Label> PO Status</Form.Label>

                      <select
                        ref={statusRef}
                        className="form-select"
                        id="status"
                      >
                        <option selected value="Partial">
                          Partial
                        </option>
                        <option value="Received">Received</option>
                        <option value="Ordered">Ordered</option>
                      </select>
                    </Form.Group>
                  </div> */}
                  <div className="col-12 py-2">
                    {purchaseProduct?.supplier?._id ? (
                      <div className="row">
                        <div className="col-6">
                          <p>
                            {/* {console.log(purchaseProduct?.supplier)} */}
                            <b>Vendor:</b> {purchaseProduct?.supplier?.company}
                            <br />
                            <b>Phone:</b> {purchaseProduct?.supplier?.phone}
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <b>PO:</b> {purchaseProduct?.poNo} <br />
                            <b>Date:</b>{" "}
                            {format(
                              new Date(purchaseProduct?.createdAt),
                              "MM/dd/yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {isNoPo === false ? (
                    <div
                      className="col-12 px-2"
                      style={{
                        overflowY: "scroll",
                        display: "block",
                        maxHeight: "220px",
                      }}
                    >
                      <Table className="mt-3 table-responsive-sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            {/* <th>Code</th> */}
                            <th>Name</th>
                            <th>Qty</th>
                            <th>TP</th>
                            {/* <th>Tax</th> */}
                            <th>Total</th>
                            <td>
                              {isFull ? (
                                <BsCheckSquare
                                  onClick={() =>
                                    handleDeselectAllProducts(
                                      purchaseProduct.products
                                    )
                                  }
                                />
                              ) : (
                                <BsSquare
                                  onClick={() =>
                                    handleSelectAllProducts(
                                      purchaseProduct.products
                                    )
                                  }
                                />
                              )}
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {console.log(purchaseProduct?.products)} */}
                          {purchaseProduct?.products?.length > 0 ? (
                            purchaseProduct?.products
                              ?.slice()
                              .sort((a, b) => a.order - b.order)
                              .map((item) => (
                                <tr key={item.article_code}>
                                  <th>{i++}</th>
                                  {/* <td>{item.article_code}</td> */}
                                  <td title={item.article_code}>{item.name}</td>
                                  <td>{item.qty > 0 ? item.qty : 0}</td>
                                  <td>
                                    {parseFloat(
                                      item?.tp ? item?.tp : 0
                                    )?.toFixed(2)}
                                  </td>
                                  {/* <td>
                                {(
                                  parseFloat(item.qty) *
                                  (parseFloat(item.tp) *
                                    (parseFloat(item.tax) / 100))
                                ).toFixed(2)}
                              </td> */}
                                  <td>
                                    {item?.tp
                                      ? (
                                        parseFloat(item.qty) *
                                        (parseFloat(item.tp) +
                                          item.tp *
                                          (parseFloat(item.tax) / 100))
                                      )?.toFixed(2)
                                      : parseFloat(0)?.toFixed(2)}
                                    {/* {((parseFloat(item.tp) * (parseFloat(item.tax)) / 100)).toFixed(2)} */}
                                  </td>
                                  <td>
                                    {/* <BsSquareHalf className="me-2" /> */}
                                    <BsArchive
                                      onClick={() => handleSelectItem(item.id)}
                                    />
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <th colSpan={8} className="text-center">
                                {" "}
                                Please Select a GRN Order
                              </th>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <div className="d-flex justify-content-between ">
                            <p>Supplier Products List</p>
                            <p
                              className="btn "
                              onClick={() => refetchSupplierProduct()}
                              style={{ cursor: "pointer" }}
                              title="Reload Products"
                            >
                              {" "}
                              <IoReload />{" "}
                            </p>
                          </div>
                          <div className="">
                            <input
                              ref={supplierSearchRef}
                              className="form-control form-control-sm"
                              type="text"
                              placeholder="Search Product"
                              onChange={(e) => handleSearch(e.target.value)}
                              onKeyDown={(e) => {
                                handleOnEnter(e);
                              }}
                            />
                          </div>
                        </div>
                        <Table
                          ref={tableRef}
                          onKeyDown={(e) => {
                            handleKeyPress(e);
                          }}
                          onKeyPress={(e) => handleAddKeyPress(e)}
                          tabIndex="0"
                          className="mt-3 table-responsive "
                        // style={{
                        //   width: "100%",
                        //   overflowY: "scroll",
                        //   display: "block",
                        //   height: "350px",
                        // }}
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              {/* <th>Code</th> */}
                              <th>Name</th>
                              <th>Stock</th>
                              <th>TP</th>
                              {/* <th>Qty</th> */}
                              {/* <th>Tax</th> */}
                              {/* <th>Total</th> */}
                              <th>Add</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProduct?.length > 0 ? (
                              filteredProduct
                                ?.slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                  <tr
                                    key={item.article_code}
                                    // style={
                                    //   index == selectedIndex
                                    //     ? { backgroundColor: "yellow" }
                                    //     : null
                                    // }
                                    ref={index === 0 ? firstProductRef : null}
                                  >
                                    {/* {console.log(index, selectedIndex)} */}
                                    <th
                                      style={
                                        index == selectedIndex
                                          ? { backgroundColor: "yellow" }
                                          : null
                                      }
                                    >
                                      {i++}
                                    </th>
                                    {/* <td>{item.article_code}</td> */}
                                    <td
                                      title={item.article_code}
                                      style={
                                        index == selectedIndex
                                          ? { backgroundColor: "yellow" }
                                          : null
                                      }
                                    >
                                      {item.name} -{item.group}
                                    </td>
                                    <td
                                      style={
                                        index == selectedIndex
                                          ? { backgroundColor: "yellow" }
                                          : null
                                      }
                                    >
                                      {item.stock}
                                    </td>
                                    {/* <td>{item?.group ? item?.group : "No group"}</td> */}
                                    <td
                                      style={
                                        index == selectedIndex
                                          ? { backgroundColor: "yellow" }
                                          : null
                                      }
                                    >
                                      {parseFloat(
                                        item?.tp ? item?.tp : 0
                                      )?.toFixed(2)}
                                    </td>

                                    {/* <td>
                                      {item?.tp ? (
                                        parseFloat(item.qty) *
                                        (parseFloat(item.tp) +
                                          item.tp * (parseFloat(item.tax) / 100))
                                      ).toFixed(2) : parseFloat(0).toFixed(2)} */}
                                    {/* {((parseFloat(item.tp) * (parseFloat(item.tax)) / 100)).toFixed(2)} */}
                                    {/* </td> */}
                                    <td
                                      style={
                                        index == selectedIndex
                                          ? { backgroundColor: "yellow" }
                                          : null
                                      }
                                    // onKeyDown={handleKeyDownToSearch}
                                    // ref={index === 0 ? firstProductRef : null}
                                    >
                                      {/* <BsSquareHalf className="me-2" /> */}
                                      <BsArchive
                                        onClick={() =>
                                          handleSupplierSelectItem(item)
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <></>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <Table className="bordered striped ">
                      <thead>
                        <tr>
                          <th>Items: {total_item}</th>
                          <th>
                            Tax: {parseFloat(tax > 0 ? tax : 0)?.toFixed(2)}
                          </th>
                          <th>Total: {total?.toFixed(2)}</th>
                          {/* <th>Order Discount: {purchase.discount}</th> */}
                          {/* <th>Shipping Cost: {purchase.shipping}</th> */}
                          <th>
                            Grand Total:{" "}
                            {(
                              parseFloat(total > 0 ? total : 0) +
                              parseFloat(tax > 0 ? tax : 0)
                            )?.toFixed(2)}
                          </th>
                        </tr>
                      </thead>
                    </Table>
                  </div>
                </div>

                {/* <Button
                  variant="dark"
                  className="float-end my-2"
                  type="submit"
                >
                  Submit
                </Button> */}
              </div>
              {/* GRN PRODUCT */}
              <div className="col-md-7 mb-3">
                <div className="row">
                  <div className="col-6">
                    <h5 className="pt-2">Receivable Products List</h5>
                  </div>
                  <div className="col-6">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center",
                      }}
                    >
                      <b>Vat Check </b>
                      {isVatCheck ? (
                        <>
                          <BsCheckSquare onClick={() => handleVatCheck()} />
                          <input
                            type="text"
                            className="form-control"
                            style={{ width: "100px", margin: "0 5px" }}
                            value={vatPercent}
                            onChange={(e) => setVatPercent(e.target.value)}
                          />
                        </>
                      ) : (
                        <BsSquare onClick={() => handleVatCheck()} />
                      )}{" "}
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th className="sm-wider">Qty</th>
                        <th className="sm-wider">TP</th>
                        <th className="sm-wider">MRP</th>
                        <th>CP</th>
                        {isVatCheck && <th>WO VAT</th>}
                        <th>Total</th>
                        <th>
                          <AiOutlineClose onClick={removeAllFromGrn} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {grnData?.products?.length > 0 ? (
                        grnData?.products
                          ?.slice()
                          ?.sort((a, b) => a.order - b.order)
                          ?.map((item, index) => (
                            <tr key={item?.id}>
                              <th>{index + 1}</th>
                              <td>{item?.article_code}</td>
                              <td>
                                {item.name} - {item.group}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control sm-input"
                                  id={item?.id}
                                  onChange={(e) => handleCustomQty(e, item)}
                                  value={item?.qty}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control sm-input"
                                  disabled={!item?.newPrice}
                                  id={item?.id}
                                  onChange={(e) => handleCustomTp(e, item)}
                                  value={item?.tp || 0}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control sm-input"
                                  disabled={!item?.newPrice}
                                  id={item?.id}
                                  onChange={(e) => handleCustomMrp(e, item?.id)}
                                  value={item?.mrp || 0}
                                />
                              </td>
                              <td>
                                <Form.Check
                                  type="switch"
                                  checked={!!item?.newPrice}
                                  id="custom-switch"
                                  onChange={() => handleNewPrice(item?.id)}
                                  label=""
                                />
                              </td>
                              {isVatCheck && (
                                <td>
                                  {vatPercent !== 0 && item?.qty !== 0
                                    ? (
                                      parseFloat(item?.qty) *
                                      parseFloat(item?.tp) *
                                      (parseFloat(vatPercent) / 100)
                                    ).toFixed(2)
                                    : "0.00"}
                                </td>
                              )}
                              <td>
                                {(
                                  parseFloat(item?.qty) *
                                  (parseFloat(item?.tp) +
                                    parseFloat(item?.tp) *
                                    (vatPercent
                                      ? parseFloat(item?.tax) / 100
                                      : 0))
                                )?.toFixed(2)}
                              </td>
                              <td>
                                <AiOutlineClose
                                  onClick={() => removeFromGrn(item.id)}
                                />
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <th colSpan={10} className="text-center">
                            Please Select a GRN Order
                          </th>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Shipping Cost</Form.Label>
                  <Form.Control
                    as="input"
                    type="number"
                    rows={3}
                    placeholder="0"
                    onChange={(e) => dispatch(selectShipping(e.target.value))}
                    value={grnData.shipping_cost}
                  // onChange={(e) => handleShippingData(e.target.value)}
                  // onChange={handleShippingData}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    as="input"
                    type="number"
                    placeholder="0"
                    rows={3}
                    onChange={(e) =>
                      dispatch(selectDiscountTotal(e.target.value))
                    }
                    value={grnData.discount}
                  // onChange={(e) => handleShippingData(e.target.value)}
                  // onChange={handleShippingData}
                  />
                </Form.Group>
                <Table className="bordered striped ">
                  <thead>
                    <tr>
                      <th>Items: {grntotal_item}</th>
                      <th>
                        Tax: {parseFloat(grntax > 0 ? grntax : 0)?.toFixed(2)}
                      </th>
                      <th>Total: {grntotal?.toFixed(2)}</th>
                      {/* {console.log(purchaseProduct)} */}
                      {/* <th>Order Discount: {purchase.discount}</th> */}
                      {/* <th>Shipping Cost: {purchase.shipping}</th> */}
                      <th>Shipping Cost: {grnData?.shipping_cost || "0.00"}</th>
                      {/* {console.log(typeof grnData?.shipping_cost)} */}
                      {/* {console.log(grntotal + grntax + grnData?.shipping_cost)} */}
                      <th>
                        Grand Total:{" "}
                        {parseFloat(
                          parseFloat(grntotal > 0 ? grntotal : 0) +
                          parseFloat(grntax > 0 ? grntax : 0) +
                          parseFloat(grnData?.shipping_cost || 0) -
                          parseFloat(
                            grnData.discount > 0 ? grnData.discount : 0
                          )
                        )?.toFixed(2)}
                      </th>
                    </tr>
                  </thead>
                </Table>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>GRN Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    onChange={(e) => dispatch(selectNote(e.target.value))}
                    value={grnData.note}
                  />
                </Form.Group>
                {/* <button
                  // disabled={newPrice === true && "disabled"}
                  className="btn btn-dark me-3"
                // onClick={() => {
                 addNewPrice();
                // }}
                >
                  <Icons.CurrencyBangladeshiOutline size={20} /> Create New
                  Price
                </button> */}
                <button
                  // disabled={newPrice === false && "disabled"}
                  className="btn btn-dark"
                  onClick={() => {
                    handleGrnSubmit();
                  }}
                >
                  <Icons.SaveOutline size={20} /> Create GRN
                </button>
              </div>
            </div>
            <LoadingModal
              title="Please Wait..."
              onShow={onShow}
              handleClose={handleClose}
            />

            {/* GRN Success Modal */}
            <Modal
              show={showSuccessModal}
              onHide={handleCloseSuccessModal}
              centered
              backdrop="static"
              keyboard={true}
            >
              <Modal.Header closeButton>
                <Modal.Title className="h5 fw-bold text-success d-flex align-items-center gap-2">
                  <BsCheckSquare size={20} className="text-success" />
                  GRN Created Successfully
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center py-4">
                <p className="text-muted mb-2 fs-6">GRN Code</p>
                <div
                  className="p-3 mb-3 bg-light rounded border border-2 border-primary d-inline-block"
                  style={{ minWidth: "260px" }}
                >
                  <span className="fs-3 fw-bold text-primary font-monospace">
                    {successGrnCode || "N/A"}
                  </span>
                </div>
                <div className="text-muted small">
                  Press <kbd>ESC</kbd> or click the button below to skip / close
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center border-0 pt-0 pb-3">
                <Button
                  variant="dark"
                  className="px-4 py-2 fw-semibold"
                  onClick={handleCloseSuccessModal}
                  autoFocus
                >
                  Skip (ESC)
                </Button>
              </Modal.Footer>
            </Modal>
            <Toaster position="bottom-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GRNCreate;
