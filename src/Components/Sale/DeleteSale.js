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
  useDelSaleExportByDateQuery,
  useSaleArticelExportByDateQuery,
} from "../../services/saleApi";
import { startOfToday, endOfToday, format, formatDistance } from "date-fns";
import DatePicker from "react-datepicker";
import BulierSelcet from "../Common/CustomSelect/BulierSelcet";

const DeleteSale = () => {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [billerSelect, setBillerSelect] = useState("");

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useDelSaleExportByDateQuery({
      startDate,
      endDate,
    });

  //   const articaleExport = useSaleArticelExportByDateQuery({
  //     startDate,
  //     endDate,
  //   });

  console.log(startDate, endDate, data);
  // const { adjustInventorySaleDel } = useInventory();
  const [sales, setSales] = useState([]);
  const [exportCSV, setExportCSV] = useState([]);
  const [articleExport, setArticleExport] = useState([]);
  const [articelSale, setArticelSale] = useState([]);

  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  useEffect(() => {
    setSales(data);
    console.log(data);
  }, [isSuccess, isFetching]);

  //   useEffect(() => {
  //     let articleSales = [];
  //     console.log("article", articaleExport.data);
  //     articleExport?.data?.map((sale) =>
  //       sale?.products?.map((pro) => {
  //         console.log(pro);
  //         articleSales = [
  //           ...articleSales,
  //           {
  //             // invoiceId: sale.invoiceId,
  //             articleCode: pro.article_code,
  //             mrp: pro.mrp,
  //             qty: pro.qty,
  //             name: pro.name,
  //           },
  //         ];
  //       })
  //     );
  //     setArticelSale(articleSales);
  //   }, [articaleExport.isSuccess]);

  //   console.log("Article Datas", articaleExport.data);

  useEffect(() => {
    let saleData = [];
    sales?.map((sale) => {
      saleData = [
        ...saleData,
        {
          Date: format(new Date(sale.createdAt), "MM/dd/yyyy h:m"),
          dDate: format(new Date(sale.updatedAt), "MM/dd/yyyy h:m:s"),
          Biller: sale?.billerId?.name,
          updateUser: sale?.updateUser?.name,
          Customer: sale.customerId.phone,
          totalItem: sale.totalItem,
          Total: sale.total,
          vat: sale.vat,
          grossTotalRound: sale.grossTotalRound,
          Amount: sale.totalReceived,
          cash: sale.paidAmount.cash,
          card: sale.paidAmount?.card?.amount,
          MFS: sale.paidAmount?.mfs?.amount,
          Change: sale.changeAmount,
          invoice_no: sale.invoiceId,
        },
      ];
    });
    setExportCSV(saleData);
    console.log("dates", saleData);
  }, [sales]);

  const headers = [
    { label: "Invoice No", key: "invoice_no" },
    { label: "Date", key: "date" },
    { label: "Delete at", key: "ddate" },
    { label: "Biller", key: "Biller" },
    { label: "Deleted By", key: "updateUser" },
    { label: "Customer", key: "Customer" },
    { label: "Item No", key: "totalItem" },
    { label: "Total", key: "Total" },
    { label: "Vat", key: "vat" },
    { label: "Total Round", key: "grossTotalRound" },
    { label: "Paid Amount", key: "Amount" },
    { label: "Cash", key: "cash" },
    { label: "Card", key: "card" },
    { label: "MFS", key: "MFS" },
    { label: "Change Amount", key: "Change" },
  ];

  // invoice id, article code, name, qty, mrp, tp, vat, total

  const handleOnBiller = (e) => {
    setBillerSelect(e.target.value);
  };

  // console.log("Amar Sonar bangla");

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-SALE-EXPORT</title>
      </Helmet>
      <div className="container-fluid">
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

                  <div className="col-md-3 mt-2 mb-2">
                    <BulierSelcet
                      billerSelect={billerSelect}
                      handleOnchange={handleOnBiller}
                    />
                  </div>

                  <div className="col-md-3">
                    <CSVLink
                      className="btn btn-dark float-end my-2 mr-2"
                      data={exportCSV}
                      asyncOnClick={true}
                      headers={headers}
                    >
                      {exportCSV === []
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
                      <th scope="col">dDate</th>
                      <th scope="col">Biller</th>
                      <th scope="col">User</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Items</th>
                      <th scope="col">Gross Total</th>
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
                        <tr key={sale._id}>
                          {/* <th >{i++}</th> */}
                          <th scope="row">{sale.invoiceId}</th>
                          <td>
                            {sale.createdAt &&
                              format(
                                new Date(sale.createdAt),
                                "MM-dd-yyyy h:m"
                              )}
                          </td>
                          <td>
                            {sale.updatedAt &&
                              format(
                                new Date(sale.updatedAt),
                                "MM-dd-yyyy h:m"
                              )}
                          </td>
                          <td>{sale?.billerId?.name}</td>
                          <td>{sale?.updateUser?.name}</td>
                          <td>{sale?.customerId?.phone}</td>
                          <td>{sale.totalItem}</td>
                          <td>{sale.grossTotalRound}</td>
                          <td>{sale.totalReceived}</td>
                          <td>{sale.changeAmount}</td>
                          <td>{sale.status}</td>
                          {/* 
                                              <td>{sale.price}</td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>Loading...</td>
                      </tr>
                    )}
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

export default DeleteSale;
