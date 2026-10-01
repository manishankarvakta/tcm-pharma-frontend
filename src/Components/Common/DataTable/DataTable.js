import axios from "../../../services/apiClient";
import React from "react";
import { useEffect, useState } from "react";
import Table from "./Table";
import { IoBeerOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import { Card } from "react-bootstrap";
import "./DataTable.css";
import ProductBarCodeModal from "../Modal/ProductBarCodeModal";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [searchColumns, setSearchColumns] = useState(["ean", "name", "code"]);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [barcodeData, setBarCodeData] = useState({});

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getData = async () => {
    setLoadingMessage("Fetching Data From Server...");
    const result = await axios.get(`${process.env.REACT_APP_API_URL}product`);
    const products = result.data;
    result.length > 0 && setLoadingMessage("Processing Data...");
    let dataProcess = [];
    products.map((product, index) => {
      dataProcess = [
        ...dataProcess,
        {
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
    // console.log(code, name, mrp)
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          {data.length > 0 ? (
            <Card className="my-2">
              <Card.Body>
                <Card.Title> Data Filter</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <div className="filterSelect">
                    {columns &&
                      columns.map((column) => (
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
                      ))}
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
          ) : (
            ""
          )}
        </div>
        <div className="col-12">
          {data.length > 0 ? (
            <Table data={search(data)} handleBarCode={handleBarCode} />
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
              <p>{loadingMessage}</p>
            </div>
          )}
        </div>
      </div>
      <ProductBarCodeModal
        show={show}
        handleClose={handleClose}
        barcodeData={barcodeData}
      ></ProductBarCodeModal>
    </div>
  );
};

export default DataTable;
