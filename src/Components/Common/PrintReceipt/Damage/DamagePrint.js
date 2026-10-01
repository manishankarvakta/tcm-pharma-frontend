import { format } from "date-fns";
import React from "react";
import { signInUser } from "../../../Utility/Auth";
import toWord from "../../../Utility/toWord";
import DamageHeader from "./parts/DamageHeader";

const DamagePrint = React.forwardRef(({ ...props }, ref) => {
 
  
  const { damage } = props;
  console.log(damage);
  console.log(damage?.products);
  let i = 1;
  return (
    <div className="container py-2" ref={ref}>
      <DamageHeader
        damage={damage}
        title="Damage"
        format={format}
        className="mb-5"
      />

      <div className="row pt-2">
        <div className="col-12">
          <table class="table table-striped">
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
              {damage?.products ? (
                damage?.products
                  ?.slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <tr>
                      <th>{i++}</th>
                      <td>{item.article_code}</td>
                      <td>{item.name}</td>
                      <td>{item.unit}</td>
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
                <tr colSpan="9" className="text-center">
                  <th>Sorry! No Product Found</th>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                {/* <th colSpan="1" className="text-end">
                                    Tax:{" "}
                                </th>
                                <th>{damage.tax}</th>
                                <th colSpan="1" className="text-end">
                                    Shipping:{" "}
                                </th>
                                {console.log(damage?.shipping_cost)}
                                <th>{damage?.shipping_cost}</th> */}
                <th colSpan="1" className="text-end">
                  Total Items:{" "}
                </th>
                <th>{parseFloat(damage?.totalItem).toFixed(0)}</th>
                <th colSpan="1" className="text-end">
                  Ground Total:{" "}
                </th>
                <th>{parseFloat(damage?.total).toFixed(2)}</th>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    <b>In Words:</b> {toWord(Math.round(damage?.total))} Taka
                    Only
                  </i>
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    {console.log(damage?.note)}
                    <b>Note:</b> {damage?.note}
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
            <b>Prepared By:{damage?.userId?.name}</b>
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

export default DamagePrint;
