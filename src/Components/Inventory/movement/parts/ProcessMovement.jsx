import axios from "../../../../services/apiClient";
import { XOutline } from "heroicons-react";
import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { BsPlayCircleFill } from "react-icons/bs";
import * as Icons from "heroicons-react";

import { FaPlay } from "react-icons/fa";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
// import { useWarehouseQuery } from "../../../../services/warehouseApi";
import CsvDownloader from "../../../Common/CsvDownloader/CsvDownloader";
import { signInUser } from "../../../Utility/Auth";
import PackageModal from "../../../Common/Modal/PackageModal";

//defining columns outside of the component is fine, is stable
const columns = [
  { accessorKey: "article_code", header: "Article Code", size: 120 },
  { accessorKey: "name", header: "Name", size: 120 },
  // { accessorKey: "unit", header: "Unit", size: 40 },
  { accessorKey: "group", header: "Group", size: 30 },
  { accessorKey: "generic", header: "Generic", size: 60 },
  { accessorKey: "openingStock", header: "openingStock" },
  { accessorKey: "grnQty", header: "Purchase Qty (grn)" },
  { accessorKey: "salesReturnQty", header: "salesReturnQty" },
  // { accessorKey: "adjustQty", header: "Recieve Adjustment" },
  { accessorKey: "availableStock", header: "Available Stock" },
  { accessorKey: "saleQty", header: "saleQty" },
  { accessorKey: "rtvQty", header: "rtvQty" },
  { accessorKey: "damageQty", header: "damageQty" },
  // { accessorKey: "otherAdjustQty", header: "Issue Adjustment" },
  { accessorKey: "closingStock", header: "closingStock" },
  { accessorKey: "avgTP", header: "TP" },
  { accessorKey: "stockValue", header: "Stock Value" },
];

// const csvOptions = {
//   fieldSeparator: ",",
//   quoteStrings: '"',
//   decimalSeparator: ".",
//   showLabels: true,
//   useBom: true,
//   useKeysAsHeaders: false,
//   headers: columns.map((c) => c.header),
// };

// const csvExporter = new ExportToCsv(csvOptions);
// const storeSettings = user?.storeSettings;
function ProcessMovement({ start, end, aamarId, warehouse, storeSettings }) {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const user = signInUser();

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  const [step, setStep] = useState("start");

  const [readyProcess, setReadyProcess] = useState(true);

  const [GrnProcess, setGrnProcess] = useState(0);
  const [RtvProcess, setRtvProcess] = useState(0);
  const [DamageProcess, setDamageProcess] = useState(0);
  const [SaleProcess, setSaleProcess] = useState(0);
  const [AdjustProcess, setAdjustProcess] = useState(0);
  const [ProductProcess, setProductProcess] = useState(0);
  const [OpeningStockProcess, setOpeningStockProcess] = useState(0);

  const [ProcessDataPer, setProcessDataPer] = useState(0);

  const [GrnData, setGrnData] = useState([]);
  const [RtvData, setRtvData] = useState([]);
  const [DamageData, setDamageData] = useState([]);
  const [SaleData, setSaleData] = useState([]);
  const [SaleReturnData, setSaleReturnData] = useState([]);
  const [AdjustData, setAdjustData] = useState([]);
  const [OpeningStockData, setOpeningStockData] = useState([]);
  const [ProductData, setProductData] = useState([]);

  const [ProductMovementData, setProductMovementData] = useState([]);
  const [noMovementData, setNoMovementData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);


  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const resetProcess = () => {
    setGrnProcess(0);
    setRtvProcess(0);
    setDamageProcess(0);
    setSaleProcess(0);
    setAdjustProcess(0);
    setProductProcess(0);
    setOpeningStockProcess(0);
    setProductMovementData([]);
  };

  useEffect(() => {
    setStep("start");

    resetProcess();
  }, [start, end]);

  const movement = async () => {
// INIT
setStep("init");
resetProcess();
await delay(1000);

// DATA FATCH
setStep("fatch");
//TODO:: FATCH OPERATION

// GRN
setGrnProcess(20);
const GrnProduct = await axios
  .get(
    `${BASE_URL}/product/grnProducts/${start}/${end}/${aamarId}/${warehouse}`
  )
  .then(function (response) {
    // Handle a successful response here
    setGrnProcess(80);
    setGrnData(response.data.grnProducts);
    console.log(response.data); // The response data
  })
  .catch(function (error) {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  })
  .finally(() => {
    setGrnProcess(100);
  });

// RTV
setRtvProcess(20);
const RtvProduct = await axios
  .get(
    `${BASE_URL}/product/rtvProducts/${start}/${end}/${aamarId}/${warehouse}`
  )
  .then(function (response) {
    // Handle a successful response here
    setRtvProcess(80);
    setRtvData(response.data.rtvProducts);
    console.log(response.data); // The response data
  })
  .catch(function (error) {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  })
  .finally(() => {
    setRtvProcess(100);
  });

// DAMAGE
setDamageProcess(20);
const DamageProduct = await axios
  .get(
    `${BASE_URL}/product/damageProducts/${start}/${end}/${aamarId}/${warehouse}`
  )
  .then(function (response) {
    // Handle a successful response here
    setDamageProcess(80);
    setDamageData(response.data.damageProducts);
    console.log(response.data); // The response data
  })
  .catch(function (error) {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  })
  .finally(() => {
    setDamageProcess(100);
  });

// SALE
setSaleProcess(20);
const SaleProduct = await axios
  .get(
    `${BASE_URL}/product/saleProducts/${start}/${end}/${aamarId}/${warehouse}`
  )
  .then(function (response) {
    // Handle a successful response here
    setSaleProcess(80);
    setSaleData(response.data.sale);
    setSaleReturnData(response.data.saleReturn);
    console.log(response.data); // The response data
  })
  .catch(function (error) {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  })
  .finally(() => {
    setSaleProcess(100);
  });

// ADJUST
// setAdjustProcess(20);
// const AdjustProduct = await axios
//   .get(`${BASE_URL}/product/adjustProducts/${start}/${end}`)
//   .then(function (response) {
//     // Handle a successful response here
//     setAdjustProcess(80);
//     setAdjustData(response.data.adjustProducts);
//     console.log("adjustment", response.data); // The response data
//   })
//   .catch(function (error) {
//     // Handle any errors that occurred during the request
//     console.error("Error:", error);
//   })
//   .finally(() => {
//     setAdjustProcess(100);
//   });

// Opening Stock
setOpeningStockProcess(20);
const OpeningStock = await axios
  .get(`${BASE_URL}/inventory/stockByDate/${start}/${aamarId}/${warehouse}`)
  .then(function (response) {
    // Handle a successful response here
    console.log("start", start);
    setOpeningStockProcess(50);
    setOpeningStockData(response.data.stockData);
    console.log("Stock:", response.data); // The response data
    setOpeningStockProcess(80);
  })
  .catch(function (error) {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  })
  .finally(() => {
    setOpeningStockProcess(100);
  });

// PRODUCT
setProductProcess(35);
const ProductProduct = await axios
  .get(`${BASE_URL}/product/productlist/${aamarId}`)
  .then(function (response) {
    // Handle a successful response here
    setProductProcess(50);
    setProductData(response.data.products);
    console.log(response.data); // The response data
    setProductProcess(80);
  })
  .catch(function (error) {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  })
  .finally(() => {
    setProductProcess(100);
    setReadyProcess(false);
  });
    

    //TODO:: ENABLE PROCESS BUTTON
  };

  const processData = async () => {
    setStep("process");
    await delay(1000);

    // INIT Product Movement
    let noMovement = [];
    let productsMovement = [];
    let i = 0;

    // Loop Products
    ProductData.forEach((product) => {
      i++;

      // console.log(typeof parseInt(ProductData.length));
      setProcessDataPer(
        parseFloat(parseInt(i) / parseInt(ProductData.length)) * 100
      );
      i++;
      const grnMatched = GrnData.find(
        (grn) => grn.article_code === product.article_code
      );
      const rtvMatched = RtvData.find(
        (rtv) => rtv.article_code === product.article_code
      );
      const saleMatched = SaleData.find(
        (sale) => sale.article_code === product.article_code
      );
      const salesReturnMatched = SaleReturnData.find(
        (salesReturn) => salesReturn.article_code === product.article_code
      );
      const damageMatched = DamageData.find(
        (damage) => damage.article_code === product.article_code
      );
      // const adjustMatched = AdjustData.find(
      //   (adjust) => adjust.article_code === product.article_code
      // );
      const OpeningStockMatched = OpeningStockData.find(
        (stock) => stock.article_code === product.article_code
      );

      // adjustMatched && console.log("Adjust Match", adjustMatched.type);

      const grnQty = grnMatched ? grnMatched?.totalQuantity : 0;
      const grnAvgTp = grnMatched ? grnMatched?.tp : 0;
      const grnAvgMrp = grnMatched ? grnMatched?.mrp : 0;
      const rtvQty = rtvMatched ? rtvMatched?.totalQuantity : 0;
      const rtvAvgTp = rtvMatched ? rtvMatched?.tp : 0;
      const rtvAvgMrp = rtvMatched ? rtvMatched?.mrp : 0;
      const saleQty = saleMatched ? saleMatched?.totalQuantity : 0;
      const saleAvgTp = saleMatched ? saleMatched?.tp : 0;
      const saleAvgMrp = saleMatched ? saleMatched?.mrp : 0;
      const salesReturnQty = salesReturnMatched
        ? salesReturnMatched?.totalQuantity
        : 0;
      const salesReturnAvgTp = salesReturnMatched ? salesReturnMatched?.tp : 0;
      const salesReturnAvgMrp = salesReturnMatched
        ? salesReturnMatched?.mrp
        : 0;
      const damageQty = damageMatched ? damageMatched?.totalQuantity : 0;
      const damageAvgTp = damageMatched ? damageMatched?.tp : 0;
      // const adjustQty =
      // adjustMatched?.type === true ? adjustMatched?.totalQuantity : 0;
      // const otherAdjustQty =
      // adjustMatched?.type === false ? adjustMatched?.totalQuantity : 0;
      // const adjustAvgTp = adjustMatched ? adjustMatched?.tp : 0;
      const openingStock = OpeningStockMatched
        ? parseFloat(OpeningStockMatched?.openingStock)
        : 0;
      let avgTP =
        grnAvgTp !== 0
          ? grnAvgTp
          : saleAvgTp !== 0
          ? saleAvgTp
          : salesReturnAvgTp !== 0
          ? salesReturnAvgTp
          : damageAvgTp !== 0
          ? damageAvgTp
          : rtvAvgTp !== 0
          ? rtvAvgTp
          : product?.tp;
      // : adjustAvgTp !== 0
      // ? adjustAvgTp

      let avgMrp =
        grnAvgMrp !== 0
          ? grnAvgMrp
          : saleAvgMrp !== 0
          ? saleAvgMrp
          : salesReturnAvgMrp !== 0
          ? salesReturnAvgMrp
          : rtvAvgMrp !== 0
          ? rtvAvgMrp
          : product?.mrp;

      let newProduct = {};

      if (
        grnQty === 0 &&
        rtvQty === 0 &&
        saleQty === 0 &&
        salesReturnQty === 0 &&
        damageQty === 0 &&
        // adjustQty === 0 &&
        openingStock === 0
      ) {
        noMovement = [...noMovement, product.article_code];
      } else {
        newProduct = {
          article_code: product.article_code,
          name: product.name,
          // unit: product?.unit?.name,
          generic: product?.generic?.name,
          group: product?.group?.name,
          avgTP: parseFloat(product?.tp)?.toFixed(2),
          avgMrp: parseFloat(product?.mrp)?.toFixed(2),
          openingStock: openingStock?.toFixed(2),
          grnQty: grnQty?.toFixed(2),
          // grnAvgTp: grnAvgTp?.toFixed(2),
          // grnAvgMrp: grnAvgMrp?.toFixed(2),
          salesReturnQty: salesReturnQty?.toFixed(2),
          // salesReturnAvgTp: salesReturnAvgTp?.toFixed(2),
          // salesReturnAvgMrp: salesReturnAvgMrp?.toFixed(2),
          // adjustQty: adjustQty?.toFixed(2),
          // adjustAvgTp: adjustAvgTp?.toFixed(2),
          availableStock: parseFloat(
            parseFloat(openingStock) +
              parseFloat(grnQty) +
              // parseFloat(adjustQty) +
              parseFloat(salesReturnQty)
          )?.toFixed(2),
          // otherAdjustQty: otherAdjustQty?.toFixed(2),
          damageQty: damageQty?.toFixed(2),
          // damageAvgTp: damageAvgTp?.toFixed(2),
          rtvQty: rtvQty?.toFixed(2),
          // rtvAvgTp: rtvAvgTp?.toFixed(2),
          // rtvAvgMrp: rtvAvgMrp?.toFixed(2),
          saleQty: saleQty?.toFixed(2),
          // saleAvgTp: saleAvgTp?.toFixed(2),
          // saleAvgMrp: saleAvgMrp?.toFixed(2),
          stockValue: parseFloat(
            (parseFloat(openingStock) +
              parseFloat(grnQty) +
              // parseFloat(adjustQty) +
              parseFloat(salesReturnQty) -
              (parseFloat(rtvQty) +
                parseFloat(saleQty) +
                parseFloat(damageQty))) *
              // parseFloat(otherAdjustQty)
              parseFloat(product.tp)
          ).toFixed(2),
          closingStock: (
            parseFloat(openingStock) +
            parseFloat(grnQty) +
            // parseFloat(adjustQty) +
            parseFloat(salesReturnQty) -
            (parseFloat(rtvQty) + parseFloat(saleQty) + parseFloat(damageQty))
          )
            // parseFloat(otherAdjustQty)
            .toFixed(2),
        };
        productsMovement = [...productsMovement, newProduct];
      }
    });
    console.log("Product:", i);
    console.log("Zero Movement:", noMovement.length);
    console.log("productsMovement", productsMovement);
    // console.log("zero", -0 - 0);
    setProductMovementData(productsMovement);
    setNoMovementData(noMovement);
    await delay(5000);

    //SHOW
    // setStep("show");
  };

  const cancleProcess = async () => {
    setStep("start");
    resetProcess();
  };

  const viewData = () => {
    setStep("show");
  };

  // const [exportHeader, setExportHeader] = useState([]);

  // useEffect(() => {
  //   const tableHeader =
  //     columns && columns.length > 0
  //       ? columns.map((column) => ({
  //           label: column.header,
  //           key: column.accessorKey,
  //           status: true,
  //         }))
  //       : [];
  //   setExportHeader(tableHeader);
  // }, [columns]);
  // const [whName, setWhName] = useState(" ");

  // const { data: wh, refetch } = useWarehouseQuery(warehouse);

  // useEffect(() => {
  //   if (wh) {
  //     setWhName(wh?.name);
  //     refetch();
  //   }
  // }, [wh, refetch]);

  const preHeader = [
    [`${storeSettings?.storeName || "No-Name"}`],
    [`${storeSettings?.address?.street || "No-Street"}`],
    [
      `${storeSettings?.address?.city || "No-City"}-${
        storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    // [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${aamarId || "No-Aamar Id"}`],
    [`Inventory Movement Report`],

    [], // Empty row for spacing
  ];
  return (
    <div style={{ minWidth: "800px" }}>
      <span
        className="position-absolute top-2 end-0"
        role="button"
        onClick={cancleProcess}
      >
        <XOutline className=" me-10" />
      </span>
      {/* Start */}
      {step === "start" && (
        <div className="align-items-center justify-content-center  h-75  d-flex">
          <div className="text-center">
            <h1>
              Start{" "}
              <span role="button" onClick={movement}>
                <BsPlayCircleFill color="tomato" />
              </span>
            </h1>
          </div>
        </div>
      )}
      {/* init */}
      {step === "init" && (
        <div className="align-items-center justify-content-center  h-75  d-flex">
          <div className="text-center">
            <h3>Initialization Operation</h3>
            <p>
              Data Fatching will start for <br />
              <b>{start} </b>
              to
              <b> {end} </b>
            </p>
          </div>
        </div>
      )}
      {/* fatch */}
      {step === "fatch" && (
        <div className="">
          <h1 className="text-left">Fatching Data</h1>
          <br />
          <div className="container">
            <div className="row">
              <div className="col-6 mb-3">
                <h4>GRN Products</h4>
                <ProgressBar
                  animated
                  striped
                  variant="success"
                  now={GrnProcess}
                />
              </div>
              <div className="col-6 mb-3">
                <h4>RTV Products</h4>
                <ProgressBar
                  animated
                  striped
                  variant="warning"
                  now={RtvProcess}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6 mb-3">
                <h4>Adjust Products</h4>
                <ProgressBar
                  animated
                  striped
                  variant="info"
                  now={AdjustProcess}
                />
              </div>
              <div className="col-6 mb-3">
                <h4>Damage Products</h4>
                <ProgressBar
                  animated
                  striped
                  variant="danger"
                  now={DamageProcess}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6 mb-3 text-left">
                <h4 className="text-left">Sale and Return Products</h4>
                <ProgressBar
                  animated
                  striped
                  variant="warning"
                  now={SaleProcess}
                />
              </div>
              <div className="col-6 mb-3 text-left">
                <h4 className="text-left">Opening Stock</h4>
                <ProgressBar
                  animated
                  striped
                  variant="warning"
                  now={OpeningStockProcess}
                />
              </div>
              <div className="col-12 mb-3 text-left">
                <h4 className="text-left">Products Info</h4>
                <ProgressBar
                  animated
                  striped
                  variant="success"
                  now={ProductProcess}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 mb-5 mt-5">
                <p className="text-center">
                  <button
                    className="btn btn-dark btn-lg"
                    disabled={readyProcess}
                    onClick={processData}
                  >
                    {readyProcess}
                    Process Data <FaPlay />
                  </button>
                </p>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* process */}
      {step === "process" && (
        <div className="container">
          <div className="row">
            <div className="col-12 mb-5 mt-5">
              <h1>Processing</h1>
              <ProgressBar
                animated
                striped
                variant="success"
                now={ProcessDataPer}
              />
              {ProductData.length ===
                ProductMovementData.length + noMovementData.length && (
                <p>
                  <button
                    className="btn btn-dark btn-block mt-3"
                    onClick={viewData}
                  >
                    View Product Movement
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* show */}
      {step === "show" && (
        <div className="text-center">
          <MaterialReactTable
            columns={columns}
            data={ProductMovementData}
            enableRowSelection
            positionToolbarAlertBanner="bottom"
            initialState={{ density: "compact" }}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  p: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <CsvDownloader
                  preheader={preHeader}
                  // headers={exportHeader}
                  buttonName={
                    <span>
                      <Icons.DownloadOutline
                        className="icon-trash text-warning"
                        size={22}
                      />{" "}
                      Download Movement Data
                    </span>
                  }
                  data={ProductMovementData}
                  fileName={`Export Inventory Movement Data - [${today.toDateString()}].csv`}
                />
              </Box>
            )}
          />
        </div>
      )}

    </div>
  );
}

export default ProcessMovement;
