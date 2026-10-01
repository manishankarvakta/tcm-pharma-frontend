import React, { useEffect, useState } from "react";
import { compareAsc, format } from "date-fns";
import toWord from "../Utility/toWord";
import { useSaleByDateAfterSaleQuery } from "../../services/saleApi";
import { usePurchaseQuery } from "../../services/purchasApi";
import { useGrnQuery } from "../../services/grnApi";
import AccountHeader from "./AccountHeader";

const AccountPrint = React.forwardRef(({ ...props }, ref) => {
  const { account, refetchAccount } = props;
  // console.log(account);
  let i = 1;
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [supplier, setSupplier] = useState("");
  const [grn, setGrn] = useState("");
  const [grnDetails, setGrnDetails] = useState({});
  const [po, setPo] = useState("");
  const [poDetails, setPoDetails] = useState({});
  const {
    data: podetail,
    isSuccess: poIsSuccess,
    refetch: poRefetch,
  } = usePurchaseQuery(po);
  const {
    data: grndetail,
    isSuccess: grnIsSuccess,
    refetch: grnRefetch,
  } = useGrnQuery(grn);

  useEffect(() => {
    setStartDate(account?.fromDate);
    setEndDate(account?.toDate);
    setSupplier(account?.supplier?._id);
    setPo(account?.poId?._id);
    setGrn(account?.grnId?._id);
  }, [account]);

  useEffect(() => {
    if (podetail?.products?.length > 0) {
      setPoDetails(podetail);
    }
  }, [podetail]);

  useEffect(() => {
    poRefetch();
  }, [po]);
  useEffect(() => {
    grnRefetch();
  }, [grn]);

  useEffect(() => {
    if (grndetail?.products?.length > 0) {
      setGrnDetails(grndetail);
    }
  }, [grndetail]);

  const { data, isSuccess, refetch } = useSaleByDateAfterSaleQuery({
    startDate,
    endDate,
    supplier,
  });

  useEffect(() => {
    refetch();
  }, [data, isSuccess]);

  // console.log("data", data)
  // console.log("podetails", podetail)
  // console.log("grndetails", grndetail)
  return (
    <div className="container py-2" ref={ref}>
      {/* {
        account?.poNo !== null ? <GrnHeader
          account={account}
          title="Goods Receive Note"
          format={format}
          className="mb-5"
        /> : <GrnHeaderTpn
          account={account}
          title="Goods Receive Note"
          format={format}
          className="mb-5"
        />
      } */}
      <AccountHeader
        account={account}
        title="Account Details"
        format={format}
        className="mb-5"
      />
      <div className="row px-2 bottom-2 "></div>

      {data?.product.length > 0 ? (
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
                {data?.product?.length > 0 ? (
                  data?.product
                    ?.slice()
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <tr>
                        <th>{i++}</th>
                        <td>{item.article_code}</td>
                        <td>{item.name}</td>
                        <td>{item.unit}</td>
                        <td>{item.totalQuantity}</td>
                        <td>
                          {" "}
                          {(item.totalQuantity * 100) / item.tax !== 0
                            ? parseInt(item?.tax ? item?.tax : 0)
                            : 1}
                        </td>
                        <td>{parseFloat(item.tp).toFixed(2)}</td>
                        <td>
                          {parseFloat(
                            item.tp * item.totalQuantity
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
                    Tax:{" "}
                  </th>
                  <th>{account.tax}</th>
                  <th colSpan="1" className="text-end">
                    Shipping:{" "}
                  </th>
                  {/* {console.log(account?.shipping_cost)} */}
                  <th>{account?.shipping_cost}</th>
                  <th colSpan="1" className="text-end">
                    Total:{" "}
                  </th>
                  <th>{parseFloat(data?.totalItemOty).toFixed(2)}</th>
                  <th colSpan="1" className="text-end">
                    Ground Total:{" "}
                  </th>
                  <th>{parseFloat(data?.totalTP)}</th>
                </tr>
                <tr>
                  <td colSpan="9" className="text-start">
                    <i>
                      <b>In Words:</b> {toWord(Math.round(data?.totalTP))} Taka
                      Only
                    </i>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}
      {grnDetails?.products?.length > 0 ? (
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
                {grnDetails?.products?.length > 0 ? (
                  grnDetails?.products
                    ?.slice()
                    ?.sort((a, b) => a.order - b.order)
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
                    Tax:{" "}
                  </th>
                  <th>{account.tax}</th>
                  <th colSpan="1" className="text-end">
                    Shipping:{" "}
                  </th>
                  {/* {console.log(account?.shipping_cost)} */}
                  <th>{account?.shipping_cost}</th>
                  <th colSpan="1" className="text-end">
                    Total:{" "}
                  </th>
                  <th>{parseFloat(grnDetails?.totalItem).toFixed(2)}</th>
                  <th colSpan="1" className="text-end">
                    Ground Total:{" "}
                  </th>
                  <th>{parseFloat(grnDetails?.total)}</th>
                </tr>
                <tr>
                  <td colSpan="9" className="text-start">
                    <i>
                      <b>In Words:</b> {toWord(Math.round(grnDetails?.total))}{" "}
                      Taka Only
                    </i>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}
      {poDetails?.products?.length > 0 ? (
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
                {poDetails?.products?.length > 0 ? (
                  poDetails?.products
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
                    Tax:{" "}
                  </th>
                  <th>{account.tax}</th>
                  <th colSpan="1" className="text-end">
                    Shipping:{" "}
                  </th>
                  {/* {console.log(account?.shipping_cost)} */}
                  <th>{account?.shipping_cost}</th>
                  <th colSpan="1" className="text-end">
                    Total:{" "}
                  </th>
                  <th>{parseFloat(poDetails?.totalItem).toFixed(2)}</th>
                  <th colSpan="1" className="text-end">
                    Ground Total:{" "}
                  </th>
                  <th>{parseFloat(poDetails?.total)}</th>
                </tr>
                <tr>
                  <td colSpan="9" className="text-start">
                    <i>
                      <b>In Words:</b> {toWord(Math.round(poDetails?.total))}{" "}
                      Taka Only
                    </i>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}

      <br />
      <div className="row px-2 bottom-2 ">
        {account?.fromDate !== null || account?.toDate !== null ? (
          <div className="col-12">
            <p>
              <b> From Date : </b>
              {account?.fromDate}
            </p>
            <p>
              <b>To Date :</b> {account?.toDate}
            </p>
          </div>
        ) : (
          <></>
        )}
        {account?.poId !== null ? (
          <div className="col-12">
            <p>
              <b>Po No :</b> {account?.poId?.poNo}
            </p>
          </div>
        ) : (
          <></>
        )}
        {account?.grnId !== null ? (
          <div className="col-12">
            <p>
              <b>GRN No :</b> {account?.grnId?.grnNo}
            </p>
          </div>
        ) : (
          <></>
        )}
        <div className="col-12">
          <p>
            <b>Paid Amount : {account?.amount}</b>
          </p>
        </div>
        <div className="col-12">
          <p>
            <b>Receiver : {account?.paidTo}</b>
          </p>
        </div>
      </div>
      <div className="row px-2 bottom-2 ">
        <div className="col-4">
          <p>
            <b>Prepared By: {account?.user?.name}</b>
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

export default AccountPrint;
