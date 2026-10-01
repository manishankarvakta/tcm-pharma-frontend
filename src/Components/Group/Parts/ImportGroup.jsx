import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster } from "react-hot-toast";
import CsvImporterGroup from "../../Common/CsvImporter/CsvImporterGroup";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import {
  resetImport,
  selectfaildData,
  selectprocessedData,
} from "../../../features/importSlice";
import {
  useAddImportGroupMutation,
  useGroupListQuery,
} from "../../../services/groupApi";
import * as Icons from "heroicons-react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Common/SideBar/SideBar";
import Header from "../../Common/Header/Header";
import { signInUser } from "../../Utility/Auth";
import { notify } from "../../Utility/Notify";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ImportGroup = () => {
  const navigate = useNavigate();
  const user = signInUser();
  const { aamarId } = user;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.importReducer);
  const csvData = data?.csvData;
  const processedData = data?.processedData;
  const faildData = data?.faildData;

  const [isProcess, setIsProcess] = useState(false); // Success Data
  const [pp, setPp] = useState(0); // Process Percent
  const [isImporting, setIsImporting] = useState(false); // New state to track actual import phase
  const [importProgressCount, setImportProgressCount] = useState(0);
  const [importStartTime, setImportStartTime] = useState(null);
  const [importDuration, setImportDuration] = useState(0);

  const [isImportedDone, setIsImportedDone] = useState(false);
  const [addImportGroup] = useAddImportGroupMutation();

  const { data: groups } = useGroupListQuery(aamarId);

  // Function to handle input change
  const handleChange = (e, code) => {
    const match = processedData.find((p) => p.code === code);
    const rest = processedData.filter((p) => p.code !== code);
    const updated = {
      ...match,
      name: e,
      isNameUnique: checkGroupName(e) || false,
    };
    dispatch(selectprocessedData([...rest, updated]));
  };

  const handleImport = async () => {
    // console.log("Import", processedData.length, "groups");
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
      
      await Promise.all(batch.map(async (group) => {
        try {
          // 1. Check if the name is already flagged as invalid in the frontend table
          if (!group.isNameUnique) {
            newFailedData.push({
              ...group,
              remarks: "Duplicate group name",
            });
            notify(`group Import ${group?.name} - Duplicate`, "error");
          } else {
            // 2. Perform the actual import
            const result = await addImportGroup(group);
            
            if (result?.data?.status === "success" || result?.status === 200) {
              const matchedIdx = newProcessData.findIndex((p) => p.name === group.name);
              if (matchedIdx !== -1) {
                newProcessData[matchedIdx] = { ...newProcessData[matchedIdx], isImport: true };
                notify(`group Import ${group?.name}`, "success");
              }
            } else {
              newFailedData.push({
                ...group,
                remarks: "Server-side error",
              });
              notify(`group Import ${group?.name} - Server Error`, "error");
            }
          }
        } catch (error) {
          newFailedData.push({
            ...group,
            remarks: error.message || "Import failed",
          });
          notify(`group Import ${group?.name} - Failed`, "error");
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

  // check Name
  const checkNameExists = async (name) => {
    try {
      const response = await fetch(
        ` ${BASE_URL}/group/checkName/${aamarId}/${name}`
      );
      const data = await response.json();
      return data.exists; // Assuming API returns { exists: true } or { exists: false }
    } catch (error) {
      console.error("Error checking Article name:", error);
      return true; // Assume it exists if API fails, to prevent duplicates
    }
  };

  //TODO:: Generate Article_code
  const generateCode = async () => {
    try {
      let code;
      let isUnique = false;

      while (!isUnique) {
        code = uuidv4().replace(/\D/g, "").slice(0, 6);

        // Ensure the first digit is not 0
        if (code.startsWith("0")) {
          continue; // Skip and generate a new one
        }

        isUnique = !(await checkCodeExists(code));
      }

      return code;
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
    for (const group of csvData) {
      const newGroup = {
        name: group?.name,
        aamarId: aamarId,
        photo: "",
        details: group?.details,
        code: (await generateCode()) || null,
        symbol: group?.symbol,
        status: group?.status || "active",
        order: i++,
        readyToIport: true,
        isImport: false,
        isEditable: checkGroupName(group?.name) || false,
        isNameUnique: checkGroupName(group?.name) || false,
      };
      //   console.log("group", newgroup?.code);

      oldData = [...oldData, newGroup];

      pp >= 0 && setIsProcess(false);

      pp === 100 && setIsProcess(false);
    }

    dispatch(selectprocessedData(oldData));

    // notify("group Imported Successfully", "success");
  };

  useEffect(() => {
    // console.log("CSV", csvData);
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

  // console.log("processedData", processedData);


  const checkGroupName = (name) => {
    return (
      !groups?.some(
        (group) => group?.name?.toLowerCase() === name?.toLowerCase()
      ) || false
    );
  };

  // check code
  const checkCodeExists = async (code) => {
    return (
      groups?.some(
        (group) => group?.code?.toLowerCase() === code?.toLowerCase()
      ) || false
    );
  };

  //   console.log("PP", pp);
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10">
            <Header title="Import Group" />
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
                          <p className="p-0 m-0 fw-bold">Import Groups</p>
                          <p className="p-0 m-0">
                            <small>
                              Please check the format before uploading
                              <a
                                href="/import/groupimport.csv"
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
                        <CsvImporterGroup />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-12">
                      <p className="d-flex justify-content-between p-2">
                        Total group: {csvData?.length}{" "}
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
                                filename="failed_groups.csv"
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
                                <Icons.Upload size="18" /> Import groups
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
                                  navigate("/group");
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
                              <th>Code</th>
                              <th>Symbol</th>
                              <th>Details</th>
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
                                    <td>
                                      {item?.isEditable ? (
                                        //     <input
                                        //     className="form-control"
                                        //     value={item?.name}
                                        //     onChange={(e) => handleChange(e.target.value,item?.code)} // If needed for editing
                                        //     style={{
                                        //     //   border: "1px solid",
                                        //       outline: "none",
                                        //       width: "200px", // Adjust the width as needed
                                        //       padding: "5px", // To ensure text fits comfortably
                                        //     }}
                                        //   />
                                        item?.name
                                      ) : (
                                        <input
                                          className="form-control"
                                          value={item?.name}
                                          onChange={(e) =>
                                            handleChange(
                                              e.target.value,
                                              item?.code
                                            )
                                          } // If needed for editing
                                          style={{
                                            border: `1px solid ${
                                              item?.isNameUnique ? "" : "tomato"
                                            }`,
                                            outline: "none",
                                            width: "200px", // Adjust the width as needed
                                            padding: "5px", // To ensure text fits comfortably
                                          }}
                                        />
                                      )}
                                    </td>

                                    <td>{item?.code}</td>
                                    <td>{item?.symbol}</td>
                                    <td>{item?.details}</td>
                                    <td
                                      className={
                                        item?.isEditable
                                          ? item?.isNameUnique
                                            ? "text-success"
                                            : item?.isImport
                                            ? item?.isNameUnique
                                              ? "text-danger"
                                              : "text-success"
                                            : "text-success"
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
                                        ? item?.isNameUnique
                                          ? "Ready"
                                          : item?.isImport
                                          ? item?.isNameUnique
                                            ? "Failed"
                                            : "Ready"
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

export default ImportGroup;
