import React from "react";
import { useCSVReader } from "react-papaparse";
import "./CsvImpoter.css";
import * as Icons from "heroicons-react";

const AdjustProductImporter = ({ setCsvData, handleImportButton, title }) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        let importData = results.data.filter((row) => row.article_code);
        setCsvData(importData);
      }}
      config={{ header: true }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div className="row">
            <div className="col-8">
              <label className="mb-2">Import Adjust Products</label>
              <a
                href="/import/adjustimport.csv"
                download
                className="ms-2 text-decoration-none text-primary"
                style={{ fontSize: "12px" }}
              >
                (Download Sample)
              </a>
              <br />
              <div className="input-group mb-3">
                <span className="input-group-text">
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
                  readOnly
                />
                <span className="input-group-text">
                  <button
                    {...getRemoveFileProps()}
                    className="btn btn-outline-dark btn-block"
                    style={{ zIndex: 0 }}
                  >
                    <Icons.X size="16"></Icons.X>
                  </button>
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

export default AdjustProductImporter;
