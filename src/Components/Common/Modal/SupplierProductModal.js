import axios from "../../../services/apiClient";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { notify } from "../../Utility/Notify";
import SupplierProductImporter from "../CsvImporter/SupplierProductImporter";
import LoadingModal from "./LoadingModal";

const SupplierProductModal = ({
  handleClose,
  setPData,
  show,
  setShow
}) => {
  const [csvData, setCsvData] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const [loader, setLoader] = useState(false)
  const handleLoaderClose = () => setLoader(false)
  const importToCart = async () => {
    // console.log("import Now");


    // TODO::LOOP
    // Show Loading
    // GRT LOCAL STORAGE DATA
    // LOOP
    // => CHECK IF Article Code Exist
    // => if not Exist 
    // ==> Axios > get product details
    // ==>  append formatted data

    // LOOP Done
    // SetPData
    // close Loading
    const localData = localStorage.getItem("supplier_cart");
    let listData = localData ? JSON.parse(localData) : [];
    // console.log(listData)
    // console.log(csvData)
    let productList = listData;

    if (csvData?.length > 0) {
      csvData?.map(async (product) => {
        console.log(product)
        const matched = listData?.find(
          (pro) => pro?.article_code === product.article_code
        );

        console.log("match", matched)
        if (!matched) {
          try {
            // AXIOSCALL
            await axios(
              `${BASE_URL}/product/pro-details/${product.article_code}`
            ).then(res => {
              const data = res.data
              // FORMATE DATA
              console.log(data)
              const newProduct = {
                id: data?._id,
                article_code: data?.article_code,
                name: data?.name,
                unit: data?.unit?.name,
                brand: data?.brand?.name || "N/A",
                generic: data?.generic?.name || "N/A",
                group: data?.group?.name || "N/A",
                tp: data?.tp,
                mrp: data?.mrp,
                // tp: data.priceTable[0].tp,
                // mrp: data.priTable[0].mrp,
              }
              console.log(newProduct)
              // ADDTO CART
              productList = [...productList, newProduct]

              console.log(productList)
              setPData(productList)
              setLoader(true)
            })

          } catch (err) {
            console.log(err)
          } finally {
            setShow(false)
            setLoader(false)
          }
        }
      });

    }
    else {
      setShow(false)
    }
    console.log("Not Matched:", productList)

  };




  return (
    <div>
      <LoadingModal
        title=""
        onShow={loader}
        handleClose={handleLoaderClose}
      ></LoadingModal>
      <Modal
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Import Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SupplierProductImporter
            setCsvData={setCsvData}
            handleImportButton={importToCart}
            title="Product"
          ></SupplierProductImporter>
          <div className="row">
            <div className="col-12">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    {/* <th>EAN</th> */}
                    <th>Code</th>
                    {/* <th>Name</th>
                    <th>Unit</th> */}
                  </tr>
                </thead>
                <tbody>
                  {csvData.length > 0 &&
                    csvData.map((pro) => (
                      <tr>
                        <td>{pro.order}</td>
                        {/* <td>{pro.ean}</td> */}
                        <td>{pro.article_code}</td>
                        {/* <td>{pro.name}</td>
                        <td>{pro.unit}</td> */}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SupplierProductModal;
