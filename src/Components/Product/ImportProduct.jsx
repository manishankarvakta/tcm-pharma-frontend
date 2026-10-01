import React, { useEffect, useState } from "react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { notify } from "../Utility/Notify";
import { v4 as uuidv4 } from "uuid";
import { Toaster } from "react-hot-toast";
import CsvDataImporter from "../Common/CsvImporter/CsvDataImporter";
import {
  useAddImportProductMutation,
  useAddProductMutation,
} from "../../services/productApi";
import { CSVLink } from "react-csv"; // CSV export
import SelectGroupImport from "../Common/CustomSelect/selectGroupImport";
import SelectUnitImport from "../Common/CustomSelect/selectUnitImport";
import SelectGenericImport from "../Common/CustomSelect/selectGenericImport";
import SelectBrandImport from "../Common/CustomSelect/selectBrandImport";
import { useDispatch, useSelector } from "react-redux";
import {
  resetImport,
  selectfaildData,
  selectprocessedData,
} from "../../features/importSlice";
import * as Icons from "heroicons-react";
import { ProgressBar } from "react-bootstrap";
import { signInUser } from "../Utility/Auth";
import { useGroupListQuery } from "../../services/groupApi";
import { useGenericListQuery } from "../../services/genericApi";
import { useBrandListQuery } from "../../services/brandApi";
import { useUnitListQuery } from "../../services/unitApi";
import axios from "../../services/apiClient";
import { redirect, useNavigate } from "react-router-dom";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ImportProduct = () => {
  const navigate = useNavigate();
  const user = signInUser();
  const { aamarId } = user;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.importReducer);
  const csvData = data?.csvData;
  const processedData = data?.processedData;
  const faildData = data?.faildData;

  console.log(faildData);
  console.log("ProcessedData", processedData);
  // const [failedData, setFailedData] = useState([]); // Failed Data

  const [isProcess, setIsProcess] = useState(false); // Success Data
  const [pp, setPp] = useState(0); // Process Percent
  const [isImporting, setIsImporting] = useState(false); // Tracking actual import phase
  const [importProgressCount, setImportProgressCount] = useState(0);
  const [importStartTime, setImportStartTime] = useState(null);
  const [importDuration, setImportDuration] = useState(0);

  const [isImportedDone, setIsImportedDone] = useState(false);

  const [createProduct] = useAddProductMutation();

  // const { groupName } = useGroupNameQuery(aamarId);
  const { data: groups } = useGroupListQuery(aamarId);
  const { data: generics } = useGenericListQuery(aamarId);
  const { data: brands } = useBrandListQuery(aamarId);
  const { data: units } = useUnitListQuery();

  const handleImport = async () => {
    // console.log("Import", processedData.length, "Products");
    setIsImportedDone(true);
    setIsImporting(true);
    setPp(0);
    setImportProgressCount(0);
    const startTime = Date.now();
    setImportStartTime(startTime);

    let newProcessData = [...processedData];
    let newFailedData = [];
    let completedCount = 0;

    // Concurrency limit helper to process in batches
    const batchSize = 10;
    const totalItems = processedData.length;

    for (let i = 0; i < totalItems; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (product) => {
        try {
          if (
            product?.group !== null &&
            product?.generic !== null &&
            product?.brand !== null &&
            product?.unit !== null
          ) {
            // Perform the import
            const result = await createProduct(product);
            
            if (result?.data?.status === "success" || result?.status === 200 || result?.status !== 500) {
              const matchedIdx = newProcessData.findIndex(
                (p) => p.article_code === product.article_code
              );
              if (matchedIdx !== -1) {
                newProcessData[matchedIdx] = { ...newProcessData[matchedIdx], isImport: true };
                notify(`Product Import ${product?.brand} ${product?.size}`, "success");
              }
            } else {
              newFailedData.push({ ...product, remarks: "Server-side error" });
              notify(`Product Import ${product?.brand} ${product?.size} - Error`, "error");
            }
          } else {
            newFailedData.push({ ...product, remarks: "Missing required fields (Group/Brand/Generic/Unit)" });
            notify(`Product Import ${product?.brand} ${product?.size} - Invalid`, "error");
          }
        } catch (error) {
          newFailedData.push({ ...product, remarks: error.message || "Import failed" });
          notify(`Product Import ${product?.brand} ${product?.size} - Failed`, "error");
        } finally {
          completedCount++;
          setImportProgressCount(completedCount);
          // Update progress percentage in real-time
          setPp(Math.round((completedCount / totalItems) * 100));
        }
      }));
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    setImportDuration(duration);

    dispatch(selectfaildData(newFailedData));
    dispatch(selectprocessedData(newProcessData));
    setIsImporting(false);
    setIsProcess(true);
  };

  const checkArticleCodeExists = async (articleCode) => {
    try {
      const response = await fetch(
        ` ${BASE_URL}/product/checkAC/${aamarId}/${articleCode}`
      );
      const data = await response.json();
      return data.exists; // Assuming API returns { exists: true } or { exists: false }
    } catch (error) {
      console.error("Error checking Article Code:", error);
      return true; // Assume it exists if API fails, to prevent duplicates
    }
  };

  //TODO:: Generate Article_code
  const generateArticleCode = async () => {
    try {
      let articleCode;
      let isUnique = false;

      while (!isUnique) {
        articleCode = uuidv4().replace(/\D/g, "").slice(0, 13);

        // Ensure the first digit is not 0
        if (articleCode.startsWith("0")) {
          continue; // Skip and generate a new one
        }

        isUnique = !(await checkArticleCodeExists(articleCode));
      }

      return articleCode;
    } catch (error) {
      console.error("Error generating Article Code:", error);
      return null;
    }
  };

  const processCsvData = async (csvData) => {
    dispatch(selectprocessedData([]));
    dispatch(selectfaildData([]));
    let oldData = [];

    // console.log("CSV", csvData);
    let i = 1;
    for (const product of csvData) {
      // console.log(
      //   "OLD DATA",
      //   product?.brand,
      //   (await generateArticleCode()) || null
      // );
      // console.log("CSV Each", product);
      // const groupId = await getGroupIdbyName(product?.group);
      // const genericId = await getGenericIdbyName(product?.generic);
      // const brandId = await getBrandIdbyName(product?.brand);

      const newProduct = {
        name: `${product?.brand}  ${product?.size}`,
        article_code: product?.article_code || (await generateArticleCode()) || null,
        aamarId: aamarId,
        group: getGroupIdbyName(product?.group) || null,
        groupName: product?.group,
        generic: getGenericIdbyName(product?.generic) || null,
        genericName: product?.generic,
        brand: getBrandIdbyName(product?.brand) || null,
        brandName: product?.brand,
        tp: product?.tp,
        mrp: product?.mrp,
        profit: product?.profit,
        details: product?.details,
        unit: getUnitIdbyName(product?.unit) || null,
        alert_qty: product?.alert_qty,
        pcsBox: product?.pcsBox,
        size: product?.size,
        product_type: product?.product_type || "standerd",
        minQty: product?.minQty || 0,
        maxQty: product?.maxQty || 1000,
        vat: product?.vat || 0,
        vat_method: product?.vat_method || false,
        discount: product?.discount || 0,
        discount_type: product?.discount_type || false,
        hide_website: false,
        photo: "",
        type: product?.type || "LOCAL",
        shipping_method: product?.shipping_method || "cod",
        status: product?.status || "active",
        order: i++,
        readyToIport: true,
        isImport: false,
      };
      console.log("PRODUCT", newProduct?.article_code);

      oldData = [...oldData, newProduct];

      pp >= 0 && setIsProcess(false);

      pp === 100 && setIsProcess(false);
      // await createProduct(newProduct).unwrap();
    }

    dispatch(selectprocessedData(oldData));

    // notify("Product Imported Successfully", "success");
  };

  useEffect(() => {
    console.log("CSV", csvData);
    // console.log("csvData Changes");
    if (csvData?.length > 0) {
      if (csvData?.length !== processedData?.length) {
        csvData?.length > 0 && processCsvData(csvData);
      }
    }
  }, [csvData]);

  useEffect(() => {
    // console.log("CSV", csvData);
    // console.log("csvData Changes");
    if (csvData?.length > 0) {
      if (csvData?.length !== processedData?.length) {
        csvData?.length > 0 && processCsvData(csvData);
      }
    }
  }, []);

  useEffect(() => {
    setIsProcess(true);
    setPp(0);
    // let progress = 0;
    const processPercent = (100 / csvData?.length) * processedData?.length;

    // console.log("Process Percent");
    setPp(processPercent || 0);
    // setIsProcess(true);
    // csvData.length > 0 && processCsvData(csvData);
  }, [processedData]);

  //group id find
  const getGenericIdbyName = (name) => {
    if (generics) {
      const result = generics?.find(
        (gen) => gen?.name?.toLowerCase() === name?.toLowerCase()
      );
      // console.log(result);
      return result?._id;
    } else {
      return null;
    }
  };

  const getGroupIdbyName = (name) => {
    if (groups) {
      const result = groups?.find(
        (grp) => grp?.name?.toLowerCase() === name?.toLowerCase()
      );
      // console.log(result);
      return result?._id;
    } else {
      return null;
    }
  };
  const getBrandIdbyName = (name) => {
    if (brands) {
      const result = brands?.find(
        (brand) => brand?.name?.toLowerCase() === name?.toLowerCase()
      );
      // console.log(result);
      return result?._id;
    } else {
      return null;
    }
  };
  const getUnitIdbyName = (name) => {
    if (units) {
      const result = units?.find(
        (unit) => unit?.name?.toLowerCase() === name?.toLowerCase()
      );
      // console.log(result);
      return result?.name;
    } else {
      return null;
    }
  };

  // Call function on component mount
  // useEffect(() => {
  //   generateArticleCode();
  // }, [processedData]);

  // console.log("article code generate", articlecodegenerate);

  console.log("PP", pp);
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10">
            <Header title="Import Product" />
            <div className="row">
              <div className="col-md-12 table-responsive">
                {csvData?.length <= 0 ? (
                  <div
                    className="d-flex justify-content-center align-items-center vh-100 "
                    style={{ marginTop: "-80px" }}
                  >
                    <div className="col-6">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="p-0 m-0 fw-bold">Import Products</p>
                          <p className="p-0 m-0">
                            <small>
                              Please check the format before uploading
                              <a
                                href="/import/productimport.csv"
                                download="productImportSample.csv"
                                className="text-primary text-opacity-75 text-decoration-none d-inline-flex align-items-center gap-1"
                                style={{ transition: "color 0.3s ease-in-out" }}
                              >
                                <Icons.Download size="15" />
                                Download
                              </a>{" "}
                              the sample file
                              {/* File to check the format before uploading. */}
                            </small>
                          </p>
                        </div>
                      </div>
                      <div>
                        <CsvDataImporter />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-12">
                      <p className="d-flex justify-content-between p-2">
                        Total Product: {csvData?.length}{" "}
                        <span className="input-group-text">
                        {importDuration > 0 && (
                            <span className="me-3 text-secondary">
                              <Icons.Clock size="16" className="me-1" />
                              Took: {importDuration}s
                            </span>
                          )}
                          <span
                            className="input-group-text gap-2"
                            id="basic-addon1"
                          >
                            {isImportedDone && faildData?.length > 0 && (
                              // TODO:: MAKE THIS BUTTON EXPOrt FAILD

                              <CSVLink
                                data={faildData}
                                filename="failed_products.csv"
                                className="btn btn-dark"
                              >
                                <Icons.Download size="18" /> Export Failed Data
                              </CSVLink>
                            )}
                            {!isImportedDone && (
                              <button
                                onClick={() => handleImport()}
                                className="btn btn-dark btn-block"
                                style={{ zIndex: 0 }}
                              >
                                <Icons.Upload size="18" /> Import Products
                              </button>
                            )}
                            {!isImportedDone && (
                              <button
                                onClick={() => {
                                  processCsvData(csvData);
                                  setIsImportedDone(false);
                                }}
                                className="btn btn-outline-dark btn-block"
                                style={{ zIndex: 0 }}
                              >
                                <Icons.Refresh size="18" /> Reload
                              </button>
                            )}

                            <button
                              onClick={() => {
                                dispatch(resetImport());
                                setIsImportedDone(false);
                              }}
                              className="btn btn-outline-dark btn-block"
                              style={{ zIndex: 0 }}
                            >
                              {!isImportedDone ? "Cancle" : "Import Again"}{" "}
                              <Icons.X size="18" />
                            </button>
                            {isImportedDone && (
                              <button
                                onClick={() => {
                                  dispatch(resetImport());
                                  setIsImportedDone(false);
                                  navigate("/product");
                                }}
                                className="btn btn-outline-success btn-block"
                                style={{ zIndex: 0 }}
                              >
                                <Icons.CheckCircle size="18" /> Done
                              </button>
                            )}
                          </span>
                        </span>
                      </p>
                    </div>
                    {!isProcess || isImporting ? (
                      <div className="col-md-6 offset-md-3 col-12 ">
                        <div
                          className="d-flex justify-content-center align-items-left flex-column w-100"
                          style={{ height: "60vh" }}
                        >
                          <h3 className="mb-1">{isImporting ? "Importing Data" : "Processing CSV Data"} {pp}%</h3>
                          {isImporting && (
                            <p className="p-0 m-0 mb-3 text-secondary d-flex align-items-center gap-2">
                              <span><Icons.ClipboardCheck size="18" /> {importProgressCount} of {processedData.length} Completed</span>
                            </p>
                          )}
                          <div className="w-100">
                            <ProgressBar
                              animated
                              striped
                              variant={isImporting ? "primary" : "success"}
                              now={pp}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="col-12">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Article Code</th>
                              <th>Group</th>
                              <th>Generic</th>
                              <th>Brand</th>
                              <th className="text-center">Size</th>
                              <th>Pcs/Box</th>
                              <th className="text-center">TP</th>
                              <th>MRP</th>
                              <th>Profit</th>
                              {/* <th>VAT</th> */}
                              <th className="text-center">Unit</th>
                              {/* <th>Type</th> */}
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedData.length > 0 ? (
                              processedData
                                ?.slice()
                                ?.sort((a, b) => a.order - b.order)
                                ?.map((item, index) => (
                                  <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{item?.name}</td>
                                    <td>{item?.article_code}</td>
                                    <td>
                                      {groups?.length > 0 ? (
                                        <SelectGroupImport
                                          processedData={processedData}
                                          groups={groups}
                                          article_code={item?.article_code}
                                          group={item?.groupName}
                                        />
                                      ) : (
                                        item?.groupName
                                      )}
                                    </td>
                                    <td>
                                      {generics?.length > 0 ? (
                                        <SelectGenericImport
                                          processedData={processedData}
                                          generics={generics}
                                          article_code={item?.article_code}
                                          gene={item?.genericName}
                                        />
                                      ) : (
                                        item?.genericName
                                      )}
                                    </td>
                                    <td>
                                      {brands?.length > 0 ? (
                                        <SelectBrandImport
                                          processedData={processedData}
                                          brands={brands}
                                          article_code={item?.article_code}
                                          bn={item?.brandName}
                                        />
                                      ) : (
                                        item?.brandName
                                      )}
                                    </td>
                                    <td className="text-center">
                                      {item?.size}
                                    </td>
                                    <td>{item?.pcsBox}</td>
                                    <td>{item?.tp}</td>
                                    <td>{item?.mrp}</td>
                                    <td className="text-center">
                                      {item?.profit}
                                    </td>
                                    {/* <td className="text-center">{item?.vat}</td> */}
                                    <td>
                                      {units?.length > 0 ? (
                                        <SelectUnitImport
                                          processedData={processedData}
                                          units={units}
                                          article_code={item?.article_code}
                                          ut={item?.unit}
                                        />
                                      ) : (
                                        item?.unit
                                      )}
                                    </td>
                                    {/* <td>{item.type}</td> */}
                                    <td
                                      className={
                                        !isImportedDone
                                          ? "text-success"
                                          : item?.isImport
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {!isImportedDone
                                        ? "Ready"
                                        : item?.isImport
                                        ? "Done"
                                        : "Faild"}
                                      {/* {item.readyToIport ? "Ready" : "Error"} */}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="15" className="text-center">
                                  No Data Available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Toaster position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default ImportProduct;
