import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { usePriceByProductQuery, usePriceByProductSwitchQuery } from '../../../services/priceApi';
import { useProductInfoQuery, useProductPriceQuery } from '../../../services/productApi';

const ProductPriceModal = ({ show, handleClose, productId }) => {
  const productInfo = useProductInfoQuery(productId);
  const priceInfoActive = usePriceByProductQuery(productId);
  const priceInfoAll = usePriceByProductSwitchQuery(productId);
  // const ProductPriceList = useProductPriceQuery(productId);

  console.log("productInfo", productInfo)
  console.log("priceInfoAll", priceInfoAll)
  // console.log("ProductPriceList", ProductPriceList)
  console.log("priceInfoActive", priceInfoActive)

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
      className=""
    >
      <Modal.Header closeButton>
        <Modal.Title>Product Price Table</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-start">
        <div className="mx-auto">
          {/* <Card className="text-center"> */}
          <div className="">
            <p className="">
              <b>Product Name: </b>
              {productInfo?.data && productInfo?.data?.name}
            </p>
            <div className="d-flex justify-content-between">
              <span>
                <b>EAN:</b> {productInfo?.data && productInfo?.data?.ean}
              </span>
              <span>
                <b>Category:</b>{" "}
                {productInfo?.data && productInfo?.data?.category?.name}
              </span>
              <span>
                <b>MC:</b>{" "}
                {productInfo?.data && productInfo?.data?.master_category?.name}
              </span>
              <span>
                <b>Code:</b>{" "}
                {productInfo?.data && productInfo?.data?.article_code}
              </span>
            </div>
            <hr />
            <Table>
              <thead className="container">
                <tr className="row m-0">
                  <th className="col-md-1 text-center">#</th>
                  <th className="col-md-3">Vendor</th>
                  <th className="col-md-3">WH</th>
                  <th className="col-md-2">TP</th>
                  <th className="col-md-2">MRP</th>
                  <th className="col-md-1 text-center">X</th>
                </tr>
              </thead>
              <tbody className="container">
                {/* {priceListLoop.map((item, index) => (
                    <tr className="row m-0" key={item.order}>
                      <th className="col-md-1 text-center">{i++}</th>
                      <td className="col-md-3">
                        <SupplierSelectByProduct
                          article_code={
                            productInfo?.data && productInfo?.data?.article_code
                          }
                          handleOnChange={handleVendorChange}
                          className={item.order}
                          name={item.order}
                          value={
                            tempSupp[index]?.supplier
                              ? tempSupp[index]?.supplier
                              : item?.supplier
                          }
                        ></SupplierSelectByProduct>
                      </td>
                      <td className="col-md-3">
                        <WareHouseDW
                          handleOnChange={handleWhChange}
                          name={item.order}
                          warehouse={
                            tempWh[index]?.warehouse
                              ? tempWh[index]?.warehouse
                              : item?.warehouse
                          }
                        />
                      </td>
                      <td className="col-md-2">
                        <input
                          className="form-control"
                          onChange={(e) => handleCustomTp(e, item.order)}
                          value={
                            tempTp[index]?.tp
                              ? tempTp[index]?.tp
                              : parseFloat(item?.tp)
                          }
                          defaultValue={item?.tp}
                          type="text"
                        />
                      </td>
                      <td className="col-md-2">
                        <input
                          className="form-control"
                          onChange={(e) => handleCustomMrp(e, item.order)}
                          value={
                            tempMrp[index]?.mrp
                              ? tempMrp[index]?.mrp
                              : parseFloat(item?.mrp)
                          }
                          defaultValue={item?.mrp}
                          type="text"
                        />
                      </td>
                      <td className="col-md-1 text-center">
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => removeItem(item)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
   */}
                {/* <td>BDT</td> */}
              </tbody>
            </Table>
            <button
              className="btn btn-outline-dark float-end"
            // onClick={() => handleAddPrice(productId)}
            >
              + New Price
            </button>
          </div>
          {/* </Card> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          //    onClick={onUpdatePrice}
          variant="dark">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductPriceModal;