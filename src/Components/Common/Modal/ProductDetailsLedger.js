import React from "react";
import { Button, Modal } from "react-bootstrap";
import * as Icons from "heroicons-react";
import { format } from "date-fns";

const ProductDetailsLedger = ({
  onShow,
  handleClose,
  pDetails,
  start,
  end,
}) => {
  console.log("pDetails", pDetails)
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {`Product Details Between ${start} to ${end}`}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {pDetails ? (
          <div className="container py-2">
            <div className="row pt-3 pb-3 mb-2 border-bottom">
              <p className="p-0 m-0 text-start">
                <b>Name :</b> {pDetails?.name}
              </p>
              <p className="p-0 m-0 text-start">
                <b>Article Code :</b> {pDetails?.article_code}
              </p>
              <p className="p-0 m-0 text-start">
                <b>Group:</b> {pDetails?.group?.name}
              </p>
              <p className="p-0 m-0 text-start">
                <b>Opening:</b>{" "}
                {pDetails?.grnPQty +
                  pDetails?.saleRPQty -
                  pDetails?.salePQty -
                  pDetails?.damagePQty -
                  pDetails?.rtvPQty -
                  pDetails?.tpnPQty}
              </p>
              <p className="p-0 m-0 text-start">
                <b>Closing:</b>{" "}
                {pDetails?.grnPQty +
                  pDetails?.saleRPQty -
                  pDetails?.salePQty -
                  pDetails?.damagePQty -
                  pDetails?.rtvPQty -
                  pDetails?.tpnPQty +
                  (pDetails?.grnQty +
                    pDetails?.saleRQty -
                    pDetails?.saleQty -
                    pDetails?.damageQty -
                    pDetails?.rtvQty -
                    pDetails?.tpnQty)}
              </p>
            </div>
            <div>
              <div className="row pt-1 pb-1 mb-1 border-bottom">
                <p className="p-0 m-0 text-start">
                  <b>Total GRN :</b> {pDetails?.grnQty}
                </p>
                <div className="row pt-2">
                  <div className="col-12">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Code</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">TP</th>
                          <th scope="col">MRP</th>
                          <th scope="col">Entry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pDetails?.grnDetails?.length > 0 ? (
                          pDetails?.grnDetails
                            ?.slice()
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <tr>
                                <td>{item.grnNo}</td>
                                <td>{item.qty}</td>
                                <td>{item.tp}</td>
                                <td>{item.mrp}</td>
                                <td>
                                  {format(
                                    new Date(item.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr colSpan="9" className="text-center">
                            <th>Sorry! No GRN Found</th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row pt-1 pb-1 mb-1 border-bottom">
                <p className="p-0 m-0 text-start">
                  <b>Total Rtv :</b> {pDetails?.rtvQty}
                </p>
                <div className="row pt-2">
                  <div className="col-12">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Code</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">TP</th>
                          <th scope="col">MRP</th>
                          <th scope="col">Entry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pDetails?.rtvDetails.length > 0 ? (
                          pDetails?.rtvDetails
                            ?.slice()
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <tr>
                                <td>{item.rtvNo}</td>
                                <td>{item.qty}</td>
                                <td>{item.tp}</td>
                                <td>{item.mrp}</td>
                                <td>
                                  {format(
                                    new Date(item.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr colSpan="9" className="text-center">
                            <th>Sorry! No RTV Found</th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row pt-1 pb-1 mb-1 border-bottom">
                <p className="p-0 m-0 text-start">
                  <b>Total Damage :</b> {pDetails?.damageQty}
                </p>
                <div className="row pt-2">
                  <div className="col-12">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Code</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">TP</th>
                          <th scope="col">MRP</th>
                          <th scope="col">Entry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pDetails?.damageDetails.length > 0 ? (
                          pDetails?.damageDetails
                            ?.slice()
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <tr>
                                <td>{item.damageNo}</td>
                                <td>{item.qty}</td>
                                <td>{item.tp}</td>
                                <td>{item.mrp}</td>
                                <td>
                                  {format(
                                    new Date(item.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr colSpan="9" className="text-center">
                            <th>Sorry! No Damage Found</th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row pt-1 pb-1 mb-1 border-bottom">
                <p className="p-0 m-0 text-start">
                  <b>Total TPN :</b> {pDetails?.tpnQty}
                </p>
                <div className="row pt-2">
                  <div className="col-12">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Code</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">TP</th>
                          <th scope="col">MRP</th>
                          <th scope="col">Entry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pDetails?.tpnDetails.length > 0 ? (
                          pDetails?.tpnDetails
                            ?.slice()
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <tr>
                                <td>{item.tpnNo}</td>
                                <td>{item.qty}</td>
                                <td>{item.tp}</td>
                                <td>{item.mrp}</td>
                                <td>
                                  {format(
                                    new Date(item.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr colSpan="9" className="text-center">
                            <th>Sorry! No TPN Found</th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row pt-1 pb-1 mb-1 border-bottom">
                <p className="p-0 m-0 text-start">
                  <b>Total Sale :</b> {pDetails?.saleQty}
                </p>
                <div className="row pt-2">
                  <div className="col-12">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Code</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">TP</th>
                          <th scope="col">MRP</th>
                          <th scope="col">Entry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pDetails?.saleDetails.length > 0 ? (
                          pDetails?.saleDetails
                            ?.slice()
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <tr>
                                <td>{item.invoiceId}</td>
                                <td>{item.qty}</td>
                                <td>{item.tp}</td>
                                <td>{item.mrp}</td>
                                <td>
                                  {format(
                                    new Date(item.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr colSpan="9" className="text-center">
                            <th>Sorry! No Sale Found</th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row pt-1 pb-1 mb-1 border-bottom">
                <p className="p-0 m-0 text-start">
                  <b>Total Return Sale :</b> {pDetails?.saleRQty}
                </p>
                <div className="row pt-2">
                  <div className="col-12">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Code</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">TP</th>
                          <th scope="col">MRP</th>
                          <th scope="col">Entry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pDetails?.saleReturnDetails.length > 0 ? (
                          pDetails?.saleReturnDetails
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map(
                              (
                                item,
                                index // Added index as key
                              ) => (
                                <tr key={index}>
                                  <td>{item.invoiceId}</td>
                                  <td>{item.qty}</td>
                                  <td>{item.tp}</td>
                                  <td>{item.mrp}</td>
                                  <td>
                                    {format(
                                      new Date(item.createdAt),
                                      "MMMM d, yyyy"
                                    )}
                                  </td>
                                </tr>
                              )
                            )
                        ) : (
                          <tr colSpan="5" className="text-center">
                            <td>Sorry! No Sale Return Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="darkOutline" onClick={handleClose}>
          <Icons.X className="icon-trash text-danger" size={22} /> Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailsLedger;
