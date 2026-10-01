import React from "react";
import { compareAsc, format } from "date-fns";
import toWord from "../../../Utility/toWord";
import RtvHeader from "./parts/RtvHeader";
import { Table } from "react-bootstrap";

const RTVprint = React.forwardRef(({ ...props }, ref) => {
  const { grn } = props;
  console.log(grn);
  let i = 1;
  return (
    <div className="container py-2" ref={ref}>
      <RtvHeader
        grn={grn}
        title="Return To Vendor"
        format={format}
        className="mb-5"
      />

      <div className="row pt-2">
        <div className="col-12">
          {/* Add responsive table wrapper */}
          <div className="table-responsive">
            <Table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Code</th>
                  <th scope="col">Name</th>
                  <th scope="col">UoM</th>
                  <th scope="col">Qty</th>
                  {/* <th scope="col">Tax</th> */}
                  <th scope="col">TP</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {grn?.products?.length > 0 ? (
                  grn.products.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{item?.article_code}</td>
                      <td>{item?.name}</td>
                      <td>{item?.unit}</td>
                      <td>{item?.qty}</td>
                      {/* <td>
                  {" "}
                  {(item?.qty * 100) / item?.tax !== 0
                    ? parseInt(item?.tax)
                    : 1}
                </td> */}
                      <td>{item?.tp}</td>
                      <td>{parseFloat(item?.tp * item?.qty).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Sorry! No Product Found
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="4" className="text-end">
                    {/* Tax:{" "} */}
                  </th>
                  {/* <th>{grn.tax}</th> */}
                  <th colSpan="2" className="text-end">
                    Grand Total:
                  </th>
                  <th>{Math.round(grn?.total)}</th>
                </tr>
                <tr>
                  <td colSpan="7" className="text-start">
                    <i>
                      <b>In Words:</b> {toWord(Math.round(grn?.total))} Taka
                      Only
                    </i>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <div className="row px-2 bottom-2 ">
        <div className="col-4">
          <p>
            <b>Prepared By:</b>
            {grn?.userId?.name}
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

export default RTVprint;
