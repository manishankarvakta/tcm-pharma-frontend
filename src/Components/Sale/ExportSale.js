import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { CSVLink, CSVDownload } from "react-csv";
import { Helmet } from "react-helmet";
import useInventory from "../Hooks/useInventory";
import axios from "../../services/apiClient";
import {
  useSaleByDateQuery,
  useDeleteSaleMutation,
  useSaleExportByDateQuery,
  useSaleArticelExportByDateQuery,
  useSaleTotalQuery,
} from "../../services/saleApi";
import { startOfToday, endOfToday, format, formatDistance } from "date-fns";
import DatePicker from "react-datepicker";
import BillerSelectNew from "../Common/CustomSelect/BulierSelcet";
import LoadingModal from "../Common/Modal/LoadingModal";

const ExportSale = () => {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [billerSelect, setBillerSelect] = useState("");

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleExportByDateQuery({
      startDate,
      endDate,
    });
  // console.log(startDate, endDate);

  // const {
  //   data: articaleExport,
  //   error: aerror,
  //   isLoading: aisLoading,
  //   isFetching: aisFetching,
  //   isSuccess: aisSuccess,
  //   refetch: arefetch,
  // } = useSaleArticelExportByDateQuery({
  //   startDate,
  //   endDate,
  // });

  // const {
  //   data: total,
  //   error: terror,
  //   isLoading: tisLoading,
  //   isFetching: tisFetching,
  //   isSuccess: tisSuccess,
  //   refetch: trefetch,
  // } = useSaleTotalQuery({
  //   startDate,
  //   endDate,
  // });

  const [loader, setLoader] = useState(true);
  const handleLoaderClose = () => setLoader(false);

  // console.log(startDate, endDate, articaleExport?.data);
  // const { adjustInventorySaleDel } = useInventory();
  const [sales, setSales] = useState([]);
  const [exportCSV, setExportCSV] = useState([]);
  const [articleExport, setArticleExport] = useState([]);
  const [articelSale, setArticelSale] = useState([]);

  const [totalGross, setTotalGross] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [totalAPaid, setTotalAPaid] = useState(0);
  const [totalChange, setTotalChange] = useState(0);

  console.log(startDate, endDate, sales);

  useEffect(() => {
    refetch();
    // arefetch();
    // trefetch();
  }, [startDate, endDate]);

  useEffect(() => {
    setSales(data);
    if (data?.length > 0) {
      setExportCSV(data);
    }
    isSuccess ? setLoader(false) : setLoader(true);
  }, [isSuccess, isFetching, startDate, endDate, data]);

  useEffect(() => {
    let totalGross = 0;
    let totalDiscount = 0;
    let totalAfterDiscount = 0;
    let totalAPaid = 0;
    let totalChange = 0;
    data?.map((sale) => {
      totalGross = parseFloat(totalGross) + parseFloat(sale?.grossTotalRound);
      totalDiscount = parseFloat(totalDiscount) + parseFloat(sale?.discount);
      totalAfterDiscount =
        parseFloat(totalAfterDiscount) +
        (parseFloat(sale?.grossTotalRound) - parseFloat(sale?.discount));
      totalAPaid = parseFloat(totalAPaid) + parseFloat(sale?.totalReceived);
      totalChange = parseFloat(totalChange) + parseFloat(sale?.changeAmount);
    });
    setTotalGross(totalGross);
    setTotalDiscount(totalDiscount);
    setTotalAfterDiscount(totalAfterDiscount);
    setTotalAPaid(totalAPaid);
    setTotalChange(totalChange);
  }, [data, isSuccess, isFetching]);

  // useEffect(() => {
  //   let articleSales = [];
  //   // console.log("article", articaleExport);
  //   articleExport?.map((sale) =>
  //     sale?.products?.map((pro) => {
  //       console.log(pro);
  //       articleSales = [
  //         ...articleSales,
  //         {
  //           // invoiceId: sale?.invoiceId,
  //           articleCode: pro.article_code,
  //           mrp: pro.mrp,
  //           qty: pro.qty,
  //           name: pro.name,
  //         },
  //       ];
  //     })
  //   );
  //   setArticelSale(articleSales);
  // }, [aisSuccess]);

  // useEffect(() => {
  //   let saleData = [];
  //   sales?.map((sale) => {
  //     saleData = [
  //       ...saleData,
  //       {
  //         Date: format(new Date(sale?.createdAt), "MM/dd/yyyy"),
  //         Biller: sale?.biller?.name,
  //         Customer: sale?.customer?.phone,
  //         totalItem: sale?.totalItem,
  //         Total: sale?.total,
  //         vat: sale?.vat,
  //         grossTotalRound: sale?.grossTotalRound,
  //         productTpSum: sale?.productTpSum,
  //         Amount: sale?.totalReceived,
  //         cash: sale?.paidAmount?.cash,
  //         card: sale?.paidAmount?.card?.amount,
  //         MFS: sale?.paidAmount?.mfs?.amount,
  //         change: sale?.changeAmount,
  //         invoice_no: sale?.invoiceId,
  //         discount: sale?.discount ? sale?.discount : 0,
  //         afterDiscount: (
  //           parseFloat(sale?.grossTotalRound) -
  //           (sale?.discount ? parseFloat(sale?.discount) : 0)
  //         )?.toFixed(2),
  //       },
  //     ];
  //   });
  //   setExportCSV(saleData);
  //   console.log("dates", saleData);
  // }, [sales]);
  // console.log("Data:", data);

  // const headers = [
  //   { label: "Invoice No", key: "invoiceId" },
  //   { label: "Date", key: "date" },
  //   { label: "Biller", key: "biller" },
  //   { label: "Customer", key: "customer" },
  //   { label: "Item No", key: "totalItem" },
  //   { label: "Total Tp", key: "tpTotal" },
  //   { label: "Total MRP", key: "mrpTotal" },
  //   { label: "Gross Sales", key: "grossTotalRound" },
  //   { label: "Discount", key: "discount" },
  //   { label: "Net Sales", key: "netSale" },
  //   { label: "Paid Amount", key: "totalReceived" },
  //   { label: "Change Amount", key: "changeAmount" },
  //   { label: "Return Items", key: "returnItem" },
  //   { label: "Return TP", key: "returnTp" },
  //   { label: "Cash", key: "cash" },
  //   { label: "Card", key: "card" },
  //   { label: "MFS", key: "mfs" },
  //   { label: "Status", key: "status" },
  // ];
  const headers = [
    { label: "Invoice No", key: "invoiceId" },
    { label: "Date", key: "date" },
    { label: "Biller", key: "biller" },
    { label: "Customer", key: "customer" },
    { label: "Item No", key: "totalItem" },
    { label: "Total Tp", key: "tpTotal" },
    { label: "Total MRP", key: "mrpTotal" },
    { label: "Gross Sales", key: "grossTotalRound" },
    { label: "Discount", key: "discount" },
    { label: "Net Sales", key: "netSale" },
    { label: "Paid Amount", key: "totalReceived" },
    { label: "Change Amount", key: "changeAmount" },
    { label: "Return Items", key: "returnItem" },
    { label: "Return TP", key: "returnTp" },
    { label: "Cash", key: "cash" },
    { label: "Card", key: "card" },
    { label: "MFS", key: "mfs" },
    { label: "Status", key: "status" },
  ];

  // invoice id, article code, name, qty, mrp, tp, vat, total

  // const handleOnBiller = (e) => {
  //   console.log("event", e);
  //   console.log("event");
  //   setBillerSelect(e.target.value);
  // };

  // console.log("Amar Sonar bangla");

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-SALE-EXPORT</title>
      </Helmet>
      <div className="container-fluid">
        <LoadingModal
          title={"Please Wait"}
          onShow={loader}
          handleClose={handleLoaderClose}
        ></LoadingModal>
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Export Sales"></Header>
            <div className="row">
              <div className="col-md-12">
                {/* Sort date range */}
                <div className="row">
                  <div className="col-md-3">
                    <div className="date-picker d-flex mt-2 mb-2 align-items-center">
                      <DatePicker
                        selected={new Date(startDate)}
                        className="form-control me-2"
                        onChange={(date) =>
                          setStartDate(format(new Date(date), "MM-dd-yyyy"))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="date-picker d-flex mt-2 mb-2 align-items-center">
                      <DatePicker
                        selected={new Date(endDate)}
                        className="form-control"
                        onChange={(date) =>
                          setEndDate(format(new Date(date), "MM-dd-yyyy"))
                        }
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-3 mt-2 mb-2">
                    <BillerSelectNew
                      // billerSelect={billerSelect}
                      handleOnchange={handleOnBiller}
                    />
                  </div> */}

                  <div className="col-md-3">
                    <CSVLink
                      className="btn btn-dark float-right my-2 mr-2"
                      data={exportCSV}
                      asyncOnClick={true}
                      headers={headers}
                      filename={`Pharmacy Sales from [${startDate} to ${endDate}].csv`}
                    >
                      {exportCSV?.length === 0
                        ? "Loading csv..."
                        : "Export Sales Report"}
                    </CSVLink>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <Table hover className="mt-4">
                  <thead>
                    <tr>
                      {/* <th scope="col">#</th> */}
                      <th scope="col">Invoice ID</th>
                      <th scope="col">Date</th>
                      <th scope="col">Biller</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Items</th>
                      <th scope="col">Gross Total</th>
                      <th scope="col">Discount</th>
                      <th scope="col">Net Sale</th>
                      <th scope="col">Paid</th>
                      <th scope="col">Change</th>
                      <th scope="col">Status</th>
                      {/* <th scope="col">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(sales)} */}
                    {sales ? (
                      sales.map((sale) => (
                        <tr key={sale?._id}>
                          <th scope="row">{sale?.invoiceId}</th>
                          <td>{sale?.date}</td>
                          <td>{sale?.biller}</td>
                          <td>{sale?.customer}</td>
                          <td>{sale?.totalItem}</td>
                          <td>{sale?.grossTotalRound}</td>
                          <td>{sale?.discount}</td>
                          <td>{parseFloat(sale?.netSale)?.toFixed(2)}</td>
                          <td>{sale?.totalReceived}</td>
                          <td>{sale?.changeAmount}</td>
                          <td>{sale?.status}</td>

                          {/* 
                                              <td>{sale?.price}</td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>Loading...</td>
                      </tr>
                    )}
                    {
                      <tr>
                        <td></td>
                        <td></td>

                        <td>COGS</td>
                        {/* <td>{total?.cogs?.toFixed(2)}</td> */}
                        <td></td>
                        <td></td>
                        {/* <td>{total?.cogs?.toFixed(2)}</td>
                        <td>{parseFloat(totalGross)?.toFixed(2)}</td>
                        <td>{parseFloat(totalDiscount)?.toFixed(2)}</td>
                        <td>{parseFloat(totalAfterDiscount)?.toFixed(2)}</td>
                        <td>{parseFloat(totalAPaid)?.toFixed(2)}</td>
                        <td>{parseFloat(totalChange)?.toFixed(2)}</td> */}
                        <td></td>
                      </tr>
                    }
                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Profit</td>
                        {/* <td>
                          {(
                            parseFloat(totalAfterDiscount) -
                            parseFloat(total?.cogs)
                          )?.toFixed(2)} 
                        </td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* <Link to="/category-sales" className="btn btn-dark float-end my-2 | mx-2">Category Sales </Link> */}
      </div>
    </div>
  );
};

export default ExportSale;
