// import React from "react";
import { useCSVReader } from "react-papaparse";
import "./CsvImpoter.css";
import * as Icons from "heroicons-react";
// import { Papa, usePapaParse } from "react-papaparse";

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

const CsvImporterPrice = ({ setCsvData, handleImportButton, title }) => {
  // const { readString } = usePapaParse();
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        console.log("---------------------------");
        let processData = [];
        const importData = results.data;

        importData.map((item) => {
          if (item?._id?.length !== 0) {
            console.log(item);
            processData = [...processData, item];
          } else {
            processData = [
              ...processData,
              {
                supplier: item.supplier,
                warehouse: item.warehouse,
                article_code: item.article_code,
                tp: item.tp,
                mrp: item.mrp,
                order: item.order,
              },
            ];
          }
        });
        setCsvData(processData?.filter((item) => item.supplier));
        console.log(results);
        console.log("---------------------------");
      }}
      config={{ header: true }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div className="row mt-3 gx-0 ">
            {/* <div className="card mt-2 "> */}
            {/* <div className="card-header"> */}
            {/* <h5 className='card-title'>Import {title}</h5> */}
            {/* </div> */}
            {/* <div className='card-body'> */}
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

            <div class="input-group mb-3 col-8"></div>

            <ProgressBar />
            <button
              onClick={handleImportButton}
              className="btn btn-dark mt-2 col-12"
            >
              <Icons.CloudUploadOutline size="20"></Icons.CloudUploadOutline>{" "}
              Import {title}
            </button>
            {/* </div> */}
            {/* </div> */}
          </div>
        </>
      )}
    </CSVReader>
  );
};

export default CsvImporterPrice;
