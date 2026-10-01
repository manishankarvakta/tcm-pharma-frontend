import React from "react";
import { compareAsc, format } from "date-fns";
import toWord from "../Utility/toWord";
import AdjustHeader from "./AdjustHeader";

const AdjustPrint = React.forwardRef(({ ...props }, ref) => {
  const { adjust } = props;
  console.log(adjust);
  console.log(adjust?.products);
  let i = 1;
  return (
    <div className="container py-2" ref={ref}>
      <AdjustHeader
        adjust={adjust}
        title="Adjust"
        format={format}
        className="mb-5"
      />

      <div className="row pt-2">
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">UoM</th>
                <th scope="col">Reason</th>
                <th scope="col">type</th>
                <th scope="col">Qty</th>
                {/* <th scope="col">Tax</th> */}
                <th scope="col">TP</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {adjust?.products ? (
                adjust?.products
                  ?.slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <tr>
                      <th>{i++}</th>
                      <td>{item.article_code}</td>
                      <td>{item.name}</td>
                      <td>{item.unit}</td>
                      <td>{item?.reason}</td>
                      <td>{item?.type === true ? "In" : "Out"}</td>
                      <td>{item.qty}</td>
                      {/* <td>
                                            {" "}
                                            {(item.qty * 100) / item.tax !== 0
                                                ? parseInt(item.tax)
                                                : 1}
                                        </td> */}
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
                <tr className="text-center">
                  <th colSpan="9">Sorry! No Product Found</th>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                {/* <th colSpan="1" className="text-end">
                                    Tax:{" "}
                                </th>
                                <th>{adjust.tax}</th>
                                <th colSpan="1" className="text-end">
                                    Shipping:{" "}
                                </th>
                                {console.log(adjust?.shipping_cost)}
                                <th>{adjust?.shipping_cost}</th> */}
                <th colSpan="4" className="text-end">
                  Total Items: {parseFloat(adjust?.totalItem).toFixed(0)}
                </th>
                <th colSpan="5" className="text-end">
                  Ground Total: {parseFloat(adjust?.total).toFixed(2)}
                </th>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    <b>In Words:</b> {toWord(Math.round(adjust?.total))} Taka
                    Only
                  </i>
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    {console.log(adjust?.note)}
                    <b>Note:</b> {adjust?.note}
                  </i>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="row px-2 bottom-2 ">
        <div className="col-4">
          <p>
            <b>Prepared By:{adjust?.userId?.name}</b>
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

export default AdjustPrint;
