import React from "react";
import { useCSVReader } from "react-papaparse";
import "./CsvImpoter.css";
import * as Icons from "heroicons-react";
import { Papa, usePapaParse } from "react-papaparse";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    // width: '20%',
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    // width: '80%',
  },
  remove: {
    borderRadius: 0,
    // padding: '0 20px',
  },
  progressBarBackgroundColor: {
    backgroundColor: "black",
  },
};

const DamageProductImpoter = ({ setCsvData, handleImportButton, title }) => {
  // const { readString } = usePapaParse();
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        console.log("---------------------------");
        // let processData = [];
        let importData = results.data;
        importData.pop();
        setCsvData(importData);
        // console.log(importData);
        console.log("---------------------------");
      }}
      config={{ header: true }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div className="row">
            <div className="col-8">
              <label className="mb-2">Import Product</label>
              <br />
              <div class="input-group mb-3">
                <span class="input-group-text">
                  <button
                    type="button"
                    {...getRootProps()}
                    className=" btn btn-dark btn-block"
                    style={{ zIndex: 0 }}
                  >
                    Browse Csv
                  </button>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={acceptedFile ? acceptedFile.name : "No File Selected"}
                  aria-describedby="basic-addon1"
                  id=""
                />
                <span class="input-group-text">
                  <span class="input-group-text" id="basic-addon1">
                    <button
                      {...getRemoveFileProps()}
                      className="btn btn-outline-dark btn-block"
                      style={{ zIndex: 0 }}
                    >
                      <Icons.X size="16"></Icons.X>
                    </button>
                  </span>
                </span>
              </div>
            </div>
            <div className="col-4 mt-4">
              <button
                type="button"
                onClick={handleImportButton}
                className="btn btn-dark mt-2 col-12"
              >
                <Icons.CloudUploadOutline size="20" /> Import {title}
              </button>
            </div>
            <div className="col-12">
              <ProgressBar />
            </div>
          </div>
        </>
      )}
    </CSVReader>
  );
};

export default DamageProductImpoter;
