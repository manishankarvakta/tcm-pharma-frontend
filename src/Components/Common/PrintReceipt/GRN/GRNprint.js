import React from "react";
import GrnHeader from "./parts/GrnHeader";
import { compareAsc, format } from "date-fns";
import toWord from "../../../Utility/toWord";
import GrnHeaderTpn from "./parts/GrnHeaderTpn";
import { Table } from "react-bootstrap";

const GRNprint = React.forwardRef(({ ...props }, ref) => {
  const { grn } = props;
  console.log(grn);
  let i = 1;
  return (
    <div className="container py-2" ref={ref}>
      {grn?.poNo !== null ? (
        <GrnHeader
          grn={grn}
          title="Goods Receive Note"
          format={format}
          className="mb-5"
        />
      ) : (
        <GrnHeaderTpn
          grn={grn}
          title="Goods Receive Note"
          format={format}
          className="mb-5"
        />
      )}
      {/* <GrnHeader
        grn={grn}
        title="Goods Receive Note"
        format={format}
        className="mb-5"
      /> */}

      <div className="row pt-2">
        <div className="col-12 ">
          <Table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">UoM</th>
                <th scope="col">Qty</th>
                <th scope="col">Tax</th>
                <th scope="col">TP</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {grn?.products ? (
                grn?.products
                  ?.slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <tr>
                      <th>{i++}</th>
                      <td>{item.article_code}</td>
                      <td>{item.name}</td>
                      <td>{item.unit}</td>
                      <td>{item.qty}</td>
                      <td>
                        {" "}
                        {(item.qty * 100) / item.tax !== 0
                          ? parseInt(item?.tax ? item?.tax : 0)
                          : 1}
                      </td>
                      <td>{parseFloat(item.tp).toFixed(2)}</td>
                      <td>
                        {parseFloat(
                          item.tp * item.qty
                          //  +
                          // ((item.qty * 100) / item.tax !== 0
                          //   ? parseInt(item.tax)
                          //   : 1)
                        )?.toFixed(2)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr colSpan="9" className="text-center">
                  <th>Sorry! No Product Found</th>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="1" className="text-end">
                  Discount:{" "}
                </th>
                <th>{grn?.discount}</th>
                <th colSpan="1" className="text-end">
                  Shipping:{" "}
                </th>
                {console.log(grn?.shipping_cost)}
                <th>{grn?.shipping_cost}</th>
                <th colSpan="1" className="text-end">
                  Total:{" "}
                </th>
                <th>{parseFloat(grn?.total).toFixed(2)}</th>
                <th colSpan="1" className="text-end">
                  Ground Total:{" "}
                </th>
                <th>
                  {parseFloat(
                    grn?.total + parseInt(grn?.shipping_cost)
                  ).toFixed(2) -
                    parseFloat(grn?.discount > 0 ? grn.discount : 0)}
                </th>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    <b>In Words:</b>{" "}
                    {toWord(
                      Math.round(grn?.total + parseInt(grn?.shipping_cost)) -
                        parseFloat(grn?.discount > 0 ? grn.discount : 0)
                    )}{" "}
                    Taka Only
                  </i>
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    {console.log(grn?.note)}
                    <b>Note:</b> {grn?.note}
                  </i>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="row px-2 bottom-2 ">
        <div className="col-4">
          <p>
            <b>Prepared By:{grn?.userId?.name}</b>
          </p>
        </div>
        <div className="col-4">
          <p>
            <b>Checked By:</b>
          </p>
        </div>
        <div className="col-4">
          <p>
            <b>Authorized By:</b>
          </p>
        </div>
      </div>
    </div>
  );
});

export default GRNprint;
