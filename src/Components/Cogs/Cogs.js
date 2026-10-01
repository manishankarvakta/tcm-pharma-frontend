import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";

import { startOfToday, endOfToday, format, formatDistance } from "date-fns";
import DatePicker from "react-datepicker";
// import { useNavigate } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import { useSaleArticelExportByDateQuery } from "../../services/saleApi";
import LoadingModal from "../Common/Modal/LoadingModal";

const Cogs = () => {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [q, setQ] = useState("");
  const [loader, setLoader] = useState(false);
  const handleLoader = () => setLoader(false);

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleArticelExportByDateQuery({
      startDate,
      endDate,
      q,
    });

  // const { data, error, isLoading, isFetching, isSuccess, refetch } =
  // useProductPagenationQuery({
  //   page,
  //   size,
  // });

  // console.log(startDate, endDate, data);
  // const { adjustInventorySaleDel } = useInventory();
  const [articleSale, setArticleSale] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    refetch();
    if (isLoading) {
      setLoader(true);
    }
  }, [startDate, endDate, q, isLoading]);

  useEffect(() => {
    if (isFetching) {
      setLoader(true);
    } else if (isSuccess) {
      setLoader(false);
    }
  }, [isFetching, isSuccess]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     setLoader(false)
  //   }
  // }, [isSuccess])

  useEffect(() => {
    let articleSales = [];
    // let test = [{ id: 5 }];
    // console.log("article", data);
    // const testing = test.find(pro => pro.id === 5)
    // console.log("testing", testing)
    // (product = [...product, sale.products])
    // console.log(sale?.products);
    // let product = [];
    data?.map((sale) => {
      // console.log("sale", sale);
      sale?.products?.map((product) => {
        // console.log("product.article_code", product.article_code);
        // console.log("articlesales", articleSales)
        // CHECK POST
        const matched = articleSales?.find(
          (pro) => pro?.code === product?.article_code
        );
        // pro.article_code == product.article_code
        console.log("matched", matched);
        const rest = articleSales?.filter(
          (pro) => pro?.code !== product?.article_code
        );
        // console.log("rest", rest);
        if (matched) {
          // articleSales = [...rest, product.article_code]
          articleSales = [
            ...rest,
            {
              code: product.article_code,
              name: product.name,
              vat: (
                parseFloat(matched.vat) +
                (parseFloat(product.vat) / 100) *
                  (parseFloat(product.qty) * parseFloat(product.mrp))
              ).toFixed(2),

              qty: (parseFloat(matched.qty) + parseFloat(product.qty)).toFixed(
                2
              ),

              total: (
                parseFloat(matched.total) +
                parseFloat(product.qty) * parseFloat(product.mrp)
              ).toFixed(2),
              // totalWVat: (parseFloat(matched.total) + (
              //   parseFloat(product.qty) * parseFloat(product.mrp) +
              //   (parseFloat(product.vat) / 100) * (parseFloat(product.qty) * parseFloat(product.mrp))
              // )).toFixed(2),

              mrpTotal: (
                parseFloat(matched.mrpTotal) +
                parseFloat(product.qty) * parseFloat(product.mrp)
              ).toFixed(2),

              tpTotal: (
                parseFloat(matched.tpTotal) +
                parseFloat(product.qty) * parseFloat(product.tp)
              ).toFixed(2),

              // avgMrp: matched.mrpTotal,

              avgMrp: (
                (parseFloat(matched.mrpTotal) +
                  parseFloat(product.qty) * parseFloat(product.mrp)) /
                (parseFloat(matched.qty) + parseFloat(product.qty))
              ).toFixed(2),

              avgTp: (
                (parseFloat(matched.tpTotal) +
                  parseFloat(product.qty) * parseFloat(product.tp)) /
                (parseFloat(matched.qty) + parseFloat(product.qty))
              ).toFixed(2),

              // avgTp: (parseFloat(matched.qty) + parseFloat(product.qty)).toFixed(2) == 0.00 ? 0.00 : ((parseFloat(matched.tpTotal) + (parseFloat(product.qty) * parseFloat(product.tp))) / (parseFloat(matched.qty) + parseFloat(product.qty))).toFixed(2),

              profit: (
                parseFloat(matched.profit) +
                (parseFloat(product.qty) * parseFloat(product.mrp) -
                  parseFloat(product.qty) * parseFloat(product.tp))
              ).toFixed(2),
              // profit: ((parseFloat(matched.mrpTotal) + (parseFloat(product.qty) * parseFloat(product.mrp))) / (parseFloat(matched.qty) + parseFloat(product.qty)) - (parseFloat(matched.tpTotal) + (parseFloat(product.qty) * parseFloat(product.tp))) / (parseFloat(matched.qty) + parseFloat(product.qty))).toFixed(2),
            },
          ];

          // console.log("articleSales with match", articleSales)
        } else {
          // articleSales = [...articleSales, product.article_code]
          articleSales = [
            ...articleSales,
            {
              code: product.article_code,
              name: product.name,
              vat: (
                (parseFloat(product.vat) / 100) *
                (parseFloat(product.qty) * parseFloat(product.mrp))
              ).toFixed(2),
              qty: parseFloat(product.qty).toFixed(2),
              total: (
                parseFloat(product.qty) * parseFloat(product.mrp)
              ).toFixed(2),

              // total: (
              //   parseFloat(product.qty) * parseFloat(product.mrp) +
              //   (parseFloat(product.vat) / 100) * (parseFloat(product.qty) * parseFloat(product.mrp))
              // ).toFixed(2),

              mrpTotal: (
                parseFloat(product.qty) * parseFloat(product.mrp)
              ).toFixed(2),

              tpTotal: (
                parseFloat(product.qty) * parseFloat(product.tp)
              ).toFixed(2),

              avgMrp:
                parseFloat(product.qty).toFixed(2) == 0.0
                  ? parseFloat(product.mrp)
                  : (
                      (
                        parseFloat(product.qty) * parseFloat(product.mrp)
                      ).toFixed(2) / parseFloat(product.qty)
                    ).toFixed(2),

              // avgTp: ((parseFloat(product.qty) * parseFloat(product.tp)) / parseFloat(product.qty)).toFixed(2),
              avgTp:
                parseFloat(product.qty).toFixed(2) == 0.0
                  ? parseFloat(product.tp)
                  : (
                      (parseFloat(product.qty) * parseFloat(product.tp)) /
                      parseFloat(product.qty)
                    ).toFixed(2),

              profit: (parseFloat(product.qty).toFixed(2) == 0.0
                ? 0.0
                : parseFloat(product.qty) * parseFloat(product.mrp) -
                  parseFloat(product.qty) * parseFloat(product.tp)
              ).toFixed(2),
              // profit: (parseFloat(product.qty)).toFixed(2) == 0.00 ? 0.00 : ((parseFloat(product.qty) * parseFloat(product.mrp)) / parseFloat(product.qty) - (parseFloat(product.qty) * parseFloat(product.tp)) / parseFloat(product.qty)).toFixed(2),
            },
          ];
          // console.log("articleSales with not  match", articleSales)
        }
        // console.log("article sales total", articleSales)
        // articleSales = [
        //   ...articleSales,
        //   {
        //     invoice_no: sale?.invoiceId,
        //     date:
        //       sale?.createdAt &&
        //       format(new Date(sale?.createdAt), "MM/dd/yyyy"),
        //     // Product Loop
        //     code: product.article_code,
        //     tp: product.tp,
        //     mrp: product.mrp,
        //     name: product.name,
        //     vat: ((product.vat / 100) * (product.qty * product.mrp)).toFixed(2),
        //     qty: (product.qty.toFixed(2)),
        //     total: (
        //       product.qty * product.mrp +
        //       (product.vat / 100) * (product.qty * product.mrp)
        //     ).toFixed(2),
        //     mrpTotal: (product.qty * product.mrp).toFixed(2),
        //     tpTotal: (product.qty * product.tp).toFixed(2),
        //     profit: ((product.qty * product.mrp) - (product.qty * product.tp)).toFixed(2),
        //   },
        // ];
      });
      sale?.returnProducts?.map((product) => {
        const matched = articleSales?.find(
          (pro) => pro?.code === product?.article_code
        );
        const rest = articleSales?.filter(
          (pro) => pro?.code !== product?.article_code
        );
        if (matched) {
          // articleSales = [...rest, product.article_code]
          articleSales = [
            ...rest,
            {
              code: product.article_code,
              name: product.name,

              vat: (
                parseFloat(matched.vat) -
                (parseFloat(product.vat) / 100) *
                  (parseFloat(product.qty) * parseFloat(product.mrp))
              ).toFixed(2),

              qty: (parseFloat(matched.qty) - parseFloat(product.qty)).toFixed(
                2
              ),

              total: (
                parseFloat(matched.total) -
                parseFloat(product.qty) * parseFloat(product.mrp)
              ).toFixed(2),

              // total: (parseFloat(matched.total) - (
              //   parseFloat(product.qty) * parseFloat(product.mrp) +
              //   (parseFloat(product.vat) / 100) * (parseFloat(product.qty) * parseFloat(product.mrp))
              // )).toFixed(2),

              mrpTotal: (
                parseFloat(matched.mrpTotal) -
                parseFloat(product.qty) * parseFloat(product.mrp)
              ).toFixed(2),

              tpTotal: (
                parseFloat(matched.tpTotal) -
                parseFloat(product.qty) * parseFloat(product.tp)
              ).toFixed(2),

              avgMrp: (
                (parseFloat(matched.mrpTotal) -
                  parseFloat(product.qty) * parseFloat(product.mrp)) /
                (parseFloat(matched.qty) - parseFloat(product.qty))
              ).toFixed(2),

              avgTp: (
                (parseFloat(matched.tpTotal) -
                  parseFloat(product.qty) * parseFloat(product.tp)) /
                (parseFloat(matched.qty) - parseFloat(product.qty))
              ).toFixed(2),

              profit: (
                parseFloat(matched.profit) -
                (parseFloat(product.qty) * parseFloat(product.mrp) -
                  parseFloat(product.qty) * parseFloat(product.tp))
              ).toFixed(2),
              // profit: ((parseFloat(matched.mrpTotal) - (parseFloat(product.qty) * parseFloat(product.mrp))) / (parseFloat(matched.qty) - parseFloat(product.qty)) - (parseFloat(matched.tpTotal) - (parseFloat(product.qty) * parseFloat(product.tp))) / (parseFloat(matched.qty) - parseFloat(product.qty))).toFixed(2),
            },
          ];

          // console.log("articleSales with match return", articleSales)
        }
      });
    });
    console.log("article sales total new", articleSales);
    // console.log(articleSales.length)
    // console.table("product", articleSales);
    setArticleSale(articleSales);
  }, [isSuccess, isFetching]);

  const articleHeaders = [
    // { label: "Invoice No", key: "invoice_no" },
    // { label: "Date", key: "date" },
    { label: "Code", key: "code" },
    { label: "Name", key: "name" },
    { label: "Total Quantity", key: "qty" },
    { label: "Vat", key: "vat" },
    { label: "Total", key: "total" },
    { label: "AvgMrp", key: "avgMrp" },
    { label: "AvgTp", key: "avgTp" },
    // { label: "TpTotal", key: "tpTotal" },
    { label: "Profit", key: "profit" },
  ];

  // let exportData = [];
  useEffect(() => {
    if (articleSale.length > 0) {
      let expD = articleSale;
      setExportData(expD);
      setLoader(false);
    }
  }, [articleSale]);

  const filterByArticleCode = (code) => {
    console.log(code);
    setQ(code);
    // console.log(articleSale)
  };
  // invoice id, article code, name, qty, mrp, tp, vat, total

  // const handleOnBiller = (e) => {
  //   setBillerSelect(e.target.value);
  // };

  return (
    <div>
      <div className="container-fluid">
        <LoadingModal onShow={loader} handleClose={handleLoader}></LoadingModal>
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="COGS"></Header>
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
                    <input
                      className="form-control"
                      type="text"
                      name="product"
                      placeholder="article code"
                      onChange={(e) => filterByArticleCode(e.target.value)}
                    />
                  </div>

                  <div className="col-md-3">
                    {/* ${format(new Date(new Date.now()), "MM/dd/yyyy")} */}
                    <CSVLink
                      filename={`COGS- ${startDate} to ${endDate}.csv`}
                      className="btn btn-dark float-end my-2 mr-2"
                      data={exportData}
                      asyncOnClick={true}
                      headers={articleHeaders}
                    >
                      {exportData?.length === 0
                        ? "Loading csv..."
                        : "Export COGS Report"}
                    </CSVLink>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <Table hover className="mt-4">
                  <thead>
                    <tr>
                      {/* <th scope="col">Invoice ID</th> */}
                      {/* <th scope="col">Date</th> */}
                      <th scope="col">Code</th>
                      <th scope="col">Name</th>
                      {/* <th scope="col">MRP</th> */}
                      <th scope="col">TotalQty</th>
                      <th scope="col">VAT</th>
                      <th scope="col">Total</th>
                      <th scope="col">AvgMRP</th>
                      <th scope="col">AvgTp</th>
                      <th scope="col">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(exportData)}
                    {exportData ? (
                      exportData.map((product) => (
                        <tr key={product.invoice_no}>
                          {/* <th >{i++}</th> */}
                          {/* <th scope="row">{product.invoice_no}</th> */}
                          {/* <td>{product.date}</td> */}
                          <td>{product?.code}</td>
                          <td>{product?.name}</td>
                          {/* <td>{product.mrp}</td> */}
                          <td>{product.qty}</td>
                          <td>{product.vat}</td>
                          <td>{product.total}</td>
                          <td>{product.avgMrp}</td>
                          <td>{product.avgTp}</td>
                          <td>{product.profit}</td>
                          {/* <td>{sale.totalReceived}</td>
                      <td>{sale.status}</td> */}
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

          {}
        </div>
      </div>
      {/* <Toaster position="bottom-right" /> */}
    </div>
  );
};

export default Cogs;
