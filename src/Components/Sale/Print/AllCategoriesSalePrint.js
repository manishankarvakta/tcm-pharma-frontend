import React from "react";
import { signInUser } from "../../Utility/Auth";
import AllCategoriesSalePrintHeader from "./AllCategoriesSalePrintHeader";

const AllCategoriesSalePrint = React.forwardRef(({ ...props }, ref) => {
  const { cat, startDate, endDate, footfall, total } = props;
  console.log(cat);
  console.log(footfall);
  console.log(total);
  let i = 1;
  const user = signInUser();
  console.log("user", user);
  return (
    <div className="container " ref={ref}>
      <AllCategoriesSalePrintHeader startDate={startDate} endDate={endDate} />

      <div className="row pt-2">
        <div className="col-12">
          <table class="table table-bordered ">
            <thead className="px-2">
              <tr >
                <th scope="col">Outlet</th>
                <th scope="col">FootFall</th>
                {/* <th scope="col">Sales</th> */}
                {/* <th scope="col">Basket Size</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>{user?.storeSettings?.storeName || "Aamar Dokan"} </th>
                <td className="">
                  {footfall && (footfall[0]?.footfall).toFixed(2)}
                </td>
                {/* <td className="text-end">{total?.toFixed(2)}</td> */}
                {/* <td className="text-end">
                                    {(total[0]?.grossTotalRound > 0 && footfall[0]?.footfall > 0
                                        ? total[0]?.grossTotalRound / footfall[0]?.footfall
                                        : 0
                                    )?.toFixed(2)
                                    }</td> */}
                {/* <td>{item.totalValue}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row pt-2">
        <div className="col-12">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  #
                </th>
                <th className="text-center" scope="col">
                  Code
                </th>
                <th className="text-center" scope="col">
                  Name
                </th>
                <th className="text-center" scope="col">
                  Sold Qty
                </th>
                <th className="text-center" scope="col">
                  Sold Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {cat ? (
                cat
                  ?.slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <tr>
                      <th className="text-center">{i++}</th>
                      <td className="text-center">{item?.code}</td>
                      <td className="text-center">{item?.name}</td>
                      <td className="text-center">
                        {(item?.totalQuantity).toFixed(2)}
                      </td>
                      <td className="text-center">
                        {(item?.totalValue).toFixed(2)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr colSpan="9" className="text-center">
                  <th>Sorry! No Product Found</th>
                </tr>
              )}
            </tbody>
            {/* <tfoot>
                            <tr>
                                <th colSpan="1" className="text-end">
                                    Tax:{" "}
                                </th>
                                <th>{cat.tax}</th>
                                <th colSpan="1" className="text-end">
                                    Shipping:{" "}
                                </th>
                                {console.log(cat?.shipping_cost)}
                                <th>{cat?.shipping_cost}</th>
                                <th colSpan="1" className="text-end">
                                    Total:{" "}
                                </th>
                                <th>{parseFloat(cat?.total).toFixed(2)}</th>
                                <th colSpan="1" className="text-end">
                                    Ground Total:{" "}
                                </th>
                                <th>{parseFloat(cat?.total + parseInt(cat?.shipping_cost)).toFixed(2)}</th>
                            </tr>
                            <tr>
                                <td colSpan="9" className="text-start">
                                    {/* <i>
                                        <b>In Words:</b> {toWord(Math.round(cat?.total + parseInt(cat?.shipping_cost)))} Taka Only
                                    </i> */}
            {/* </td>
                            </tr>
                            <tr>
                                <td colSpan="9" className="text-start">
                                    <i>
                                        {console.log(cat?.note)}
                                        <b>Note:</b> {cat.note}
                                    </i>
                                </td>
                            </tr>
                        </tfoot> */}
          </table>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="row px-2 bottom-2 ">
        <div className="col-4">
          <p>
            <b>Prepared By:{user?.name}</b>
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

export default AllCategoriesSalePrint;
