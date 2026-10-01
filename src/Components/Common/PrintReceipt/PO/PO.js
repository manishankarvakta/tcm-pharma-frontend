import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { signInUser } from "../../../Utility/Auth";
import toWord from "../../../Utility/toWord";
import PoHeader from "./parts/PoHeader";

const PO = React.forwardRef(({ ...props }, ref) => {
  const auth = signInUser();
  const { storeSettings } = auth;
  const { purchase } = props;
  const [productList, setProductList] = useState([]);
  let i = 1;
  // console.log(purchase);

  useEffect(() => {
    if (purchase?.products?.length > 0) {
      const products = purchase?.products ? purchase?.products : [];
      if (products.length > 0) {
        setProductList(products?.slice().sort((a, b) => a.order - b.order));
      }
    }
  }, [purchase]);

  return (
    <div className="container py-2" ref={ref}>
      <PoHeader
        purchase={purchase}
        title="Purchase Order"
        format={format}
        className="mb-5"
        storeSettings={storeSettings}
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
              {/* {console.log(purchase?.products)} */}

              {productList?.length > 0 ? (
                productList
                  // ?.sort((a, b) => a?.order - b?.order)
                  ?.map((item) => (
                    <tr>
                      <th>{i++}</th>
                      <td>{item?.article_code}</td>
                      <td>{item?.name}</td>
                      <td>{item?.unit}</td>
                      <td>{item?.qty}</td>
                      <td>
                        {(item?.qty * 100) / item?.tax !== 0
                          ? parseInt(item?.tax)
                          : 1}
                      </td>
                      <td>{parseFloat(item?.tp ? item?.tp : 0).toFixed(2)}</td>
                      <td>
                        {item?.tp
                          ? parseFloat(
                              item?.tp * item?.qty +
                                ((item?.tp * item?.qty * 100) / item?.tax !== 0
                                  ? parseInt(item?.tax)
                                  : 1)
                            )?.toFixed(2)
                          : parseFloat(0).toFixed(2)}
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
                <th className="">{parseFloat(purchase?.total).toFixed(2)}</th>
                <th colSpan="" className="text-end">
                  Shipping Cost:
                </th>
                <th className="">
                  {parseFloat(
                    purchase?.shipping_cost ? purchase?.shipping_cost : 0
                  ).toFixed(2)}
                </th>
                <th className="">Discount</th>
                <th>{purchase?.discount ? purchase?.discount : 0}</th>
                <th colSpan="" className="">
                  Ground Total:{" "}
                </th>
                <th>
                  {Math.round(
                    purchase?.total +
                      purchase?.shipping_cost -
                      parseFloat(purchase?.discount)
                  )}
                </th>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    <b>In Words:</b>{" "}
                    {toWord(
                      Math.round(
                        purchase?.total +
                          purchase?.tax +
                          purchase?.shipping_cost -
                          parseFloat(purchase?.discount)
                      )
                    )}{" "}
                    Taka Only
                  </i>
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="text-start">
                  <i>
                    <b>Note:</b> {purchase?.note}
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
            <b>Prepared By:</b> {purchase?.userId?.name}
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

export default PO;
