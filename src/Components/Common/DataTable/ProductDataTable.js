import axios from "../../../services/apiClient";
import React from "react";
import { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import { IoBeerOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import { Card, ProgressBar } from "react-bootstrap";
import "./DataTable.css";
import ProductBarCodeModal from "../Modal/ProductBarCodeModal";
import ProductPriceModal from "../Modal/ProductPriceModal";

const ProductDataTable = () => {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [searchColumns, setSearchColumns] = useState(["ean", "name", "code"]);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [loadingData, setLoadingData] = useState(0);
  const [barcodeData, setBarCodeData] = useState({});
  const [productPrice, setProductPrice] = useState({});
  const [productData, setProductData] = useState({});

  const [show, setShow] = useState(false);
  const [showP, setPShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePClose = () => setPShow(false);
  const handlePShow = () => setPShow(true);

  const getData = async () => {
    setLoadingMessage("Fetching Data From Server...");
    const client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 90000,
    });
    const result = await client
      .get(`product`, {
        onDownloadProgress: (progressEvent) => {
          // console.log('download', progressEvent, progressEvent.total, progressEvent.loaded);
          const total = parseFloat(progressEvent.total);
          const current = parseFloat(progressEvent.loaded);

          let percentCompleted = Math.floor((current / total) * 100);
          setLoadingData(percentCompleted);
          // console.log('completed: ', percentCompleted)
        },
      })
      .then((res) => {
        // console.log("All DONE: ", res.data)
        return res.data;
      });
    const products = result;
    result.length > 0 && setLoadingMessage("Processing Data...");
    let dataProcess = [];
    products?.map((product, index) => {
      dataProcess = [
        ...dataProcess,
        {
          id: product._id,
          ean: product.ean,
          name: product.name,
          code: product.article_code,
          mc: product.master_category,
          tp: product.cost,
          mrp: product.price,
          unit: product.unit,
        },
      ];
    });
    dataProcess.length > 10 && setLoadingMessage("Data is ready...");
    setData(dataProcess);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleBarCode = (code, mrp, name) => {
    setBarCodeData({
      code: code,
      mrp: mrp,
      name: name,
    });
    handleShow();
    // console.log(code, name, mrp);
  };

  const handelPriceUpdateModal = (id) => {
    const product = data.find((p) => p.code === id);
    setProductData(product);
    handlePShow();
  };

  function search(rows) {
    return rows.filter((row) =>
      searchColumns?.some(
        (column) =>
          row[column]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1
      )
    );
  }
  const columns = data[0] && Object.keys(data[0]);
  // console.log(loadingData);
  return (
    <div className="row">
      <div className="col-12">
        <Card className="my-2">
          <Card.Body>
            <Card.Title>
              Data Filter
              <span className="float-end">
                <i>Product Show: {`${search(data).length}`}</i>
              </span>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              <div className="filterSelect">
                {columns &&
                  columns.map((column) =>
                    column === "id" ? (
                      ""
                    ) : (
                      <div className="form-check">
                        <input
                          checked={searchColumns.includes(column)}
                          type="checkbox"
                          id={column}
                          className="form-check-input"
                          onChange={(e) => {
                            const checked = searchColumns.includes(column);
                            setSearchColumns((prev) =>
                              checked
                                ? prev.filter((sc) => sc !== column)
                                : [...prev, column]
                            );
                          }}
                        />
                        <label
                          className="form-check-label pe-3"
                          htmlFor={column}
                        >
                          {" "}
                          {column}
                        </label>
                      </div>
                    )
                  )}
              </div>
            </Card.Subtitle>
            <Card.Text>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Search..."
              ></input>
            </Card.Text>

            {/* <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link> */}
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-12 table-responsive">
        {data.length > 0 ? (
          <ProductTable
            data={search(data)}
            handelPriceUpdateModal={handelPriceUpdateModal}
            handleBarCode={handleBarCode}
          />
        ) : (
          <div className="text-center mt-5 pt-5">
            <IconContext.Provider
              value={{
                color: "#1477BD",
                className: "global-class-name",
                size: 150,
              }}
            >
              <div>
                <IoBeerOutline />
              </div>
            </IconContext.Provider>
            <p className="d-flex justify-content-center">
              <ProgressBar
                className="w-25 mt-2"
                variant="danger"
                animated
                now={loadingData}
                label={`${loadingData}%`}
              />
            </p>
          </div>
        )}
      </div>
      <ProductBarCodeModal
        show={show}
        handleClose={handleClose}
        barcodeData={barcodeData}
      ></ProductBarCodeModal>
      <ProductPriceModal
        show={showP}
        handleClose={handlePClose}
        animation={false}
        product={productData}
      ></ProductPriceModal>
    </div>
  );
};

export default ProductDataTable;
