import React from "react";
import { compareAsc, format } from "date-fns";
import AllCategoriesSalePrintHeader from "./AllCategoriesSalePrintHeader";
import { signInUser } from "../../Utility/Auth";


const AllCategoriesSalePrint = React.forwardRef(({ ...props }, ref) => {
    const { cat, startDate, endDate } = props;
    console.log(cat);
    let i = 1;
    const user = signInUser()
    console.log("user", user)
    return (
        <div className="container py-2" ref={ref}>

            <AllCategoriesSalePrintHeader
                className="mb-5"
                startDate={startDate}
                endDate={endDate}
            />

            <div className="row pt-2">
                <div className="col-12">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Name</th>
                                <th scope="col">Total Qty</th>
                                <th scope="col">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cat ? (
                                cat?.slice().sort((a, b) => a.order - b.order).map((item) => (
                                    <tr>
                                        <th>{i++}</th>
                                        <td>{item?._id?.code}</td>
                                        <td>{item?._id?.name}</td>
                                        <td>{item?.totalQuantity}</td>
                                        <td>{item.totalValue}</td>

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
