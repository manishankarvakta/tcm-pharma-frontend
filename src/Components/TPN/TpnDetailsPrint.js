import React, { useEffect, useState } from "react";
import { compareAsc, format } from "date-fns";
// import toWord from "../../../Utility/toWord";
import TpnHeader from "./TpnHeader";
import toWord from "../Utility/toWord";

const TpnDetailsPrint = React.forwardRef(({ ...props }, ref) => {
  const { tpn } = props;
  const [productList, setProductList] = useState([])
  let i = 1;
  console.log(tpn);
  console.log(productList);


  useEffect(() => {
    if (tpn?.products?.length > 0) {
      const products = tpn?.products ? tpn?.products : []
      if (products.length > 0) {

        setProductList(products?.slice().sort((a, b) => a.order - b.order))
      }
    }
  }, [tpn])

  return (
    <div className="container py-2" ref={ref}>
      <TpnHeader
        tpn={tpn}
        title="Tpn Order"
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
                <th scope="col">Tax</th>
                <th scope="col">TP</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {console.log(tpn?.products)}

              {productList?.length > 0 ? (

                productList
                  // ?.sort((a, b) => a?.order - b?.order)
                  ?.map((item) => (
                    <tr>
                      <th>{i++}</th>
                      <td>{item.article_code}</td>
                      <td>{item.name}</td>
                      <td>{item.unit}</td>
                      <td>{item.qty}</td>
                      <td>
                        {(item.qty * 100) / item?.tax !== 0
                          ? parseInt(item?.tax ? item?.tax : 0)
                          : 1}
                      </td>
                      <td>{parseFloat(item?.tp ? item?.tp : 0).toFixed(2)}</td>
                      <td>
                        {item?.tp ? parseFloat(item.tp * item.qty +
                          ((item.tp * item.qty * 100) / item.tax !== 0
                            ? parseInt(item?.tax ? item?.tax : 0)
                            : 1))?.toFixed(2) : parseFloat(0).toFixed(2)}
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
                <th colSpan="" className="">
                  Total:
                </th>
                <th className="">{parseFloat(tpn?.total).toFixed(2)}</th>
                <th colSpan="" className="text-end">
                  Shipping Cost:
                </th>
                <th className="">{parseFloat(tpn?.shipping_cost).toFixed(2)}</th>
                {/* <th className="">Discount</th> */}
                {/* <th>{tpn?.discount === null && 0}</th> */}
                <th></th>
                <th></th>
                <th colSpan="" className="">
                  Ground Total:{" "}
                </th>
                <th>{Math.round(tpn?.total + tpn?.shipping_cost)}</th>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    <b>In Words:</b>{" "}
                    {toWord(Math.round((tpn?.total ? tpn?.total : 0) + (tpn?.tax ? tpn?.tax : 0) + (tpn?.shipping_cost ? tpn?.shipping_cost : 0)))} Taka
                    Only
                  </i>
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    <b>Note:</b>{" "}
                    {tpn?.note ? tpn?.note : ""}
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
            <b>Prepared By:</b> {tpn?.userId?.name}
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

export default TpnDetailsPrint;
