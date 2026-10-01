import { format } from "date-fns";
import React from "react";
import toWord from "../../Utility/toWord";
import SupplierSalesHeader from "./SupplierSalesHeader";
import { signInUser } from "../../Utility/Auth";
const auth=signInUser();

const SupplierSalesPrint = React.forwardRef(({ ...props }, ref) => {
  const { data, supplierInfo, endDate, startDate } = props;
  console.log(data);
  let i = 1;
  return (
    <div className="container py-2" ref={ref}>
      <SupplierSalesHeader
        data={data}
        startDate={startDate}
        endDate={endDate}
        supplierInfo={supplierInfo}
        title="Supplier Wise Sale"
        format={format}
        className="mb-5"
      />

      <div className="row pt-2">
        <div className="col-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">article_code</th>
                <th scope="col">name</th>
                <th scope="col">tp</th>
                <th scope="col">mrp</th>
                <th scope="col">totalQuantity</th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                data?.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id ?? item.article_code}>
                      <th>{i++}</th>

                      <td>{item.article_code}</td>
                      <td>{item.name}</td>
                      <td>{item.tp}</td>
                      <td>{item.mrp}</td>
                      <td>{item?.stock?.totalQty.toFixed(2) || ""}</td>
                      {/* 
                                                <td>{sale.price}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No product found</td>
                  </tr>
                )
              ) : (
                <tr>
                  <th colSpan="8" className="text-center">
                    Sorry! No Product Found
                  </th>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="8" className="text-end">
                  {/* Tax:{" "} */}
                </th>
                {/* <th>{data.tax}</th> */}
                {/* <th colSpan="2" className="text-end">
                  Ground Total:{" "}
                </th>
                <th>{Math.round(data?.total)}</th> */}
              </tr>
              <tr>
                {/* <td colSpan="9" className="text-start">
                  <i>
                    <b>In Words:</b> {toWord(Math.round(data?.total))} Taka Only
                  </i>
                </td> */}
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
            <b>Prepared By: {auth?.name}</b>
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

export default SupplierSalesPrint;
