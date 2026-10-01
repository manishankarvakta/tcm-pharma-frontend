/* eslint-disable react-hooks/exhaustive-deps */
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import { useForm } from "react-hook-form";
import {
  resetImport,
  selectfaildData,
  selectprocessedData,
} from "../../features/importSlice";
import {
  useAddImportCustomerMutation,
  useCustomersImportQuery,
} from "../../services/customerApi";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import CsvImporterCustomer from "./CsvImporterCustomer";
import { notify } from "../Utility/Notify";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ImportCustomer = () => {
  const navigate = useNavigate();
  const user = signInUser();
  const { aamarId, warehouse } = user;

  const id = uuidv4();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.importReducer);
  const csvData = data?.csvData;
  const processedData = data?.processedData;
  const faildData = data?.faildData;
  const { register, getValues } = useForm();
  const [isProcess, setIsProcess] = useState(false); // Success Data
  const [pp, setPp] = useState(0); // Process Percent
  const [isImporting, setIsImporting] = useState(false); // Track actual import phase
  const [importProgressCount, setImportProgressCount] = useState(0);
  const [importStartTime, setImportStartTime] = useState(null);
  const [importDuration, setImportDuration] = useState(0);

  const [isImportedDone, setIsImportedDone] = useState(false);
  const [AddImportCustomer] = useAddImportCustomerMutation();

  const { data: customers } = useCustomersImportQuery();
  console.log("customers", customers);

  // Function to handle input change
  const handleChangeEmail = (e, email) => {
    const match = processedData.find((p) => p.email === email);
    const rest = processedData.filter((p) => p.email !== email);
    const updated = {
      ...match,
      email: e,
      isEmailUnique: checkCustomerEmail(e) || false,
    };
    dispatch(selectprocessedData([...rest, updated]));
  };
  const handleChangePhone = (e, phone) => {
    const match = processedData.find((p) => p.phone === phone);
    const rest = processedData.filter((p) => p.phone !== phone);
    const updated = {
      ...match,
      phone: e,
      isPhoneUnique: checkCustomerPhone(e) || false,
    };
    dispatch(selectprocessedData([...rest, updated]));
  };

  const handleImport = async () => {
    // console.log("Import", processedData.length, "Customers");
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
      
      await Promise.all(batch.map(async (customer) => {
        try {
          const isDuplicateEmail = await checkEmailExists(customer.email);
          const isDuplicatePhone = await checkPhoneExists(customer.phone);

          if (isDuplicateEmail || isDuplicatePhone) {
            newFailedData.push({ ...customer, remarks: "Duplicate Email or Phone" });
          } else {
            // Perform the actual import
            const result = await AddImportCustomer(customer);
            
            if (result?.data?.status === "success" || result?.status === 200 || result?.status !== 500) {
              const matchedIdx = newProcessData.findIndex(
                (p) => p.name === customer.name && p.phone === customer.phone
              );
              if (matchedIdx !== -1) {
                newProcessData[matchedIdx] = { ...newProcessData[matchedIdx], isImport: true };
                notify(`Customer Import ${customer?.name}`, "success");
              }
            } else {
              newFailedData.push({ ...customer, remarks: "Server-side error" });
              notify(`Customer Import ${customer?.name} - Error`, "error");
            }
          }
        } catch (error) {
          newFailedData.push({ ...customer, remarks: error.message || "Import failed" });
          notify(`Customer Import ${customer?.name} - Failed`, "error");
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

  // check Email
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(
        ` ${BASE_URL}/customer/checkEmail/${aamarId}/${email}`
      );
      const data = await response.json();
      return data.exists; // Assuming API returns { exists: true } or { exists: false }
    } catch (error) {
      console.error("Error checking Article name:", error);
      return true; // Assume it exists if API fails, to prevent duplicates
    }
  };
  // check phone
  const checkPhoneExists = async (phone) => {
    try {
      const response = await fetch(
        ` ${BASE_URL}/customer/checkPhone/${aamarId}/${phone}`
      );
      const data = await response.json();
      return data.exists; // Assuming API returns { exists: true } or { exists: false }
    } catch (error) {
      console.error("Error checking Article name:", error);
      return true; // Assume it exists if API fails, to prevent duplicates
    }
  };

  //TODO:: Generate Article_code
  // const generateCode = async () => {
  //   try {
  //     let code;
  //     let isUnique = false;

  //     while (!isUnique) {
  //       code = uuidv4().replace(/\D/g, "").slice(0, 6);

  //       // Ensure the first digit is not 0
  //       if (code.startsWith("0")) {
  //         continue; // Skip and generate a new one
  //       }

  //       isUnique = !(await checkCodeExists(code));
  //     }

  //     return code;
  //   } catch (error) {
  //     console.error("Error generating Article Code:", error);
  //     return null;
  //   }
  // };

  const processCsvData = async (csvData) => {
    dispatch(selectprocessedData([]));
    dispatch(selectfaildData([]));
    let oldData = [];

    // console.log("CSV", csvData);
    let i = 1;
    for (const customer of csvData) {
      // const newCustomer = {
      //   name: product?.name,
      //   aamarId: aamarId,
      //   // photo: "",
      //   company: product?.company,
      //   // code: (await generateCode()) || null,
      //   symbol: product?.symbol,
      //   status: product?.status || "active",
      //   order: i++,
      //   readyToIport: true,
      //   isImport: false,
      //   isEditable: checkcustomerName(product?.name) || false,
      //   isNameUnique: checkcustomerName(product?.name) || false,
      // };
      const newCustomer = {
        name: customer?.name,
        isEditableEmail: checkCustomerEmail(customer?.email) || false,
        isEditablePhone: checkCustomerPhone(customer?.phone) || false,
        isEmailUnique: checkCustomerEmail(customer?.email) || false,

        isPhoneUnique: checkCustomerPhone(customer?.phone) || false,
        email: customer?.email,
        phone: customer?.phone,

        membership: customer?.membership,
        point: customer?.point ? customer?.point : 0,
        type: customer?.type || "regular",
        group: customer?.group || null,
        warehouse: user?.warehouse,
        aamarId: user?.aamarId,
        status: customer?.status || "active",
        order: i++,
        readyToIport: true,
        isImport: false,
      };
      console.log("PRODUCT", newCustomer);

      oldData = [...oldData, newCustomer];

      pp >= 0 && setIsProcess(false);

      pp === 100 && setIsProcess(false);
      // await createProduct(newCustomer).unwrap();
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
    console.log("CSV", csvData);
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

  console.log("processedData", processedData);
  //   const getcustomerIdbyName = (name) => {
  //     if (customers) {
  //       const result = customers?.find(
  //         (grp) => grp?.name?.toLowerCase() === name?.toLowerCase()
  //       );
  //       // console.log(result);
  //       return result?._id;
  //     } else {
  //       return null;
  //     }
  //   };

  //   const checkcustomerName = (name) => {
  //     if (customers) {
  //       const result = customers?.find(
  //         (customer) => customer?.name?.toLowerCase() === name?.toLowerCase()
  //       );
  //       console.log("customer",customers, name, result);
  //       return result?.name;
  //     } else {
  //       return null;
  //     }
  //   };

  const checkCustomerEmail = (email) => {
    return (
      !customers?.some(
        (customer) => customer?.email?.toLowerCase() === email?.toLowerCase()
      ) || false
    );
  };
  const checkCustomerPhone = (phone) => {
    return !customers?.some((customer) => customer?.phone === phone) || false;
  };

  // // check code
  // const checkCodeExists = async (code) => {
  //   return (
  //     customers?.some(
  //       (customer) => customer?.code?.toLowerCase() === code?.toLowerCase()
  //     ) || false
  //   );
  // };

  //   console.log("PP", pp);
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10">
            <Header title="Import customer" />
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
                          <p className="p-0 m-0 fw-bold">Import customers</p>
                          <p className="p-0 m-0">
                            <small>
                              Please check the format before uploading
                              <a
                                href="/import/customerimport.csv"
                                download
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
                        <CsvImporterCustomer />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-12">
                      <p className="d-flex justify-content-between p-2">
                        Total Product: {csvData?.length}{" "}
                        <span className="input-customer-text">
                        {importDuration > 0 && (
                            <span className="me-3 text-secondary">
                              <Icons.Clock size="16" className="me-1" />
                              Took: {importDuration}s
                            </span>
                          )}
                          <span
                            className="input-customer-text gap-2"
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
                                <Icons.Upload size="18" /> Import customer
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
                                  navigate("/customer");
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
                              <th>Phone</th>
                              <th>Email</th>
                              <th>Membership</th>
                              <th>Point</th>
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
                                    <th>{item?.name}</th>

                                    <td>
                                      {item?.isEditablePhone ? (
                                        item?.phone
                                      ) : (
                                        <input
                                          className="form-control"
                                          value={item?.phone}
                                          onChange={(e) =>
                                            handleChangePhone(
                                              e.target.value,
                                              item?.phone
                                            )
                                          } // If needed for editing
                                          style={{
                                            border: `1px solid ${
                                              item?.isPhoneUnique
                                                ? ""
                                                : "tomato"
                                            }`,
                                            outline: "none",
                                            width: "200px", // Adjust the width as needed
                                            padding: "5px", // To ensure text fits comfortably
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td>
                                      {item?.isEditableEmail ? (
                                        item?.email
                                      ) : (
                                        <input
                                          className="form-control"
                                          value={item?.email}
                                          onChange={(e) =>
                                            handleChangeEmail(
                                              e.target.value,
                                              item?.email
                                            )
                                          } // If needed for editing
                                          style={{
                                            border: `1px solid ${
                                              item?.isEmailUnique
                                                ? ""
                                                : "tomato"
                                            }`,
                                            outline: "none",
                                            width: "200px", // Adjust the width as needed
                                            padding: "5px", // To ensure text fits comfortably
                                          }}
                                        />
                                      )}
                                    </td>

                                    <td>{item?.membership}</td>

                                    {/* <td className="">
                                      <select
                                        {...register("membership")}
                                        className="form-select"
                                        id="membership"
                                      >
                                        <option value="gold">Gold</option>
                                        <option value="diamond">Diamond</option>
                                        <option value="premium">Premium</option>
                                      </select>
                                    </td> */}

                                    <td>{item?.point}</td>
                                    {/* <td>{item?.status}</td> */}

                                    <td
                                      className={
                                        item?.isEditable
                                          ? item?.isEmailUnique &&
                                            item?.isPhoneUnique
                                            ? "text-success"
                                            : item?.isImport
                                            ? item?.isEmailUnique &&
                                              item?.isPhoneUnique
                                              ? "text-danger"
                                              : "text-success"
                                            : "text-success"
                                          : item?.isEmailUnique &&
                                            item?.isPhoneUnique
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {/* 
                                      {item?.isEditable
                                        ? item?.isNameUnique
                                          ? "Ready"
                                          : item?.isImport
                                          ? item?.isNameUnique
                                            ? "Failed"
                                            : "Ready"
                                          : "Ready"
                                        : "Failed"} */}

                                      {item?.isEditable
                                        ? item?.isEmailUnique &&
                                          item?.isPhoneUnique
                                          ? "Ready"
                                          : item?.isImport
                                          ? item?.isEmailUnique &&
                                            item?.isPhoneUnique
                                            ? "Failed"
                                            : "Ready"
                                          : "Ready"
                                        : item?.isEmailUnique &&
                                          item?.isPhoneUnique
                                        ? item?.isImport
                                          ? "Done"
                                          : "Ready"
                                        : "Failed"}
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

export default ImportCustomer;
