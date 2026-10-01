import React, { useEffect, useState } from "react";
import { compareAsc, format } from "date-fns";
import toWord from "../../Utility/toWord";
import PopularProductsSalesHeader from "./PopularProductsSalesHeader";
import { totalCalculation } from "../../Utility/PopularProductCalculations";
import { signInUser } from "../../Utility/Auth";


const PopularProductSalesPrint = React.forwardRef(({ ...props }, ref) => {
    const { data, endDate, startDate } = props;
    console.log(data);
    const [total, setTotal] = useState(0)
    const [totalItemQty, setTotalItemQty] = useState(0)
    let i = 1;
    const user = signInUser();
    useEffect(() => {
        const { total, totalItemQty } = totalCalculation(data)
        console.log(total, totalItemQty)
        setTotal(total)
        setTotalItemQty(totalItemQty)
    }, [data])

    return (
        <div className="container py-2" ref={ref}>
            <PopularProductsSalesHeader
                data={data}
                startDate={startDate}
                endDate={endDate}
                title="Popular Products Sale"
                format={format}
            // className="mb-2"
            />

            <div className="row">
                <div className="col-12">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Name</th>
                                {/* <th scope="col">UoM</th> */}
                                <th scope="col">Qty</th>
                                {/* <th scope="col">Tax</th> */}
                                <th scope="col"></th>
                                <th scope="col">TP</th>
                                <th scope="col">MRP</th>
                                <th scope="col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data ? (
                                data?.map((item) => (
                                    <tr>
                                        <th>{i++}</th>
                                        <td>{item?.article_code}</td>
                                        <td>{item?.name}</td>
                                        {/* <td>{item?.unit}</td> */}
                                        <td>{item?.totalSoldQuantity}</td>
                                        {/* <td>
                      {" "}
                      {(item?.qty * 100) / item?.tax !== 0
                        ? parseInt(item?.tax)
                        : 1}
                    </td> */}
                                        <td>{ }</td>
                                        <td className="text-start">{item?.tp}</td>
                                        <td className="text-start">{item?.mrp}</td>
                                        <td className="text-end">{(parseFloat(item?.mrp) * parseFloat(item?.totalSoldQuantity)).toFixed(2)}</td>
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
                                <th colSpan="4" className="text-end">
                                    Tax:{" "}
                                </th>
                                <th>{totalItemQty}</th>
                                <th colSpan="2" className="text-end">
                                    Ground Total:{" "}
                                </th>
                                <th>{Math.round(total)}</th>
                            </tr>
                            <tr>
                                <td colSpan="9" className="text-start">
                                    <i>
                                        <b>In Words:</b> {toWord(Math.round(total))} Taka Only
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
                        <b>Prepared By:  {user?.name}</b>

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

export default PopularProductSalesPrint;
