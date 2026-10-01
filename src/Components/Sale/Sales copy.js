import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { CSVLink, CSVDownload } from "react-csv";
// import ExportSales from "..x/Common/Modal/ExportSales";
// import ExportArticleSales from "../Common/Modal/ExportArticleSales";
// import useInventory from "../Hooks/useInventory";
import axios from "../../services/apiClient";
import {
  useSaleByDateQuery,
  useDeleteTempSaleMutation,
  useSaleByDateInvoiceQuery,
  useSaleExportByDateQuery,
} from "../../services/saleApi";
import { startOfToday, endOfToday, format, formatDistance } from "date-fns";
import DatePicker from "react-datepicker";
import { Helmet } from "react-helmet";
import LoadingModal from "../Common/Modal/LoadingModal";
const Sales = () => {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [q, setQ] = useState("");
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSaleExportByDateQuery({
      startDate,
      endDate,
      q,
    });
  // const { data, error, isLoading, isFetching, isSuccess, refetch } =
  //   useSaleByDateInvoiceQuery({
  //     startDate,
  //     endDate,
  //     q,
  //   });
  // const { data, error, isLoading, isFetching, isSuccess, refetch } =
  // useProductPagenationQuery({
  //   page,
  //   size,
  //   q,
  // });
  // console.log(data);
  const user = signInUser();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // const { updateInventoryInOnSaleDel } = useInventory();
  // console.log(startDate, endDate, data);
  // const { adjustInventorySaleDel } = useInventory();
  const [sales, setSales] = useState([]);
  const [exportCSV, setExportCSV] = useState([]);

  const [deleteSale] = useDeleteTempSaleMutation();

  const [show, setShow] = useState(false);
  const [showA, setShowA] = useState(false);

  const handleAClose = () => setShowA(false);
  const handleAShow = () => setShowA(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const loadSales = async () => {
  //   await fetch(`${process.env.REACT_APP_API_URL}sale`)
  //     .then((res) => res.json())
  //     .then((data) => setSales(data));
  // };

  const [loader, setLoader] = useState(true);
  const handleLoaderClose = () => setLoader(false);

  useEffect(() => {
    sales ? setLoader(false) : setLoader(true);
  }, [sales]);

  useEffect(() => {
    refetch();
  }, [startDate, endDate, q]);

  useEffect(() => {
    setSales(data);
  }, [isSuccess, isFetching]);

  console.log(sales);
  console.log("dates", startDate, endDate);
  const handelDeleteSale = async (id) => {
    let newIn = [];
    console.log(id);
    /// axios diye data from data get
    // const result = await axios.get(`${BASE_URL}/sale/${id}`);
    // console.log(result.data.products)
    // if (result?.data?.products?.length > 0) {

    //   result?.data?.products?.map((pro) => {
    //     newIn = [
    //       ...newIn,
    //       {
    //         article_code: pro?.article_code,
    //         qty: pro?.qty,
    //         priceId: pro?.priceId,
    //         name: pro?.name,
    //       },
    //     ];
    //   });
    // }
    const confirm = window.confirm("Are you Sure? Delete this Sale?");
    const data = {
      _id: id,
      updateUser: user.id,
      status: "delete",
    };
    if (confirm) {
      console.log(deleteSale(data));
      // // // UPDATE INVENTORY
      // const inventory = await updateInventoryInOnSaleDel(newIn);
      // console.log(inventory)
    }
  };

  const handelSearchInvoice = (e) => {
    const searchString = e.target.value;
    setQ(searchString);
    // console.log(searchString);
    // const regex = /start(.*?)end/;

    // let sales = [];
    // sales = sales.filter(sale => sale.invoiceId )
  };
  return (
    <div>
      <LoadingModal
        title={"Please Wait"}
        onShow={loader}
        handleClose={handleLoaderClose}
      ></LoadingModal>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PHARMACY-POS-SALE</title>
      </Helmet>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="All Sales"></Header>
            <div className="row">
              <div className="col-md-6">
                {/* Sort date range */}
                <div className="date-picker d-flex mt-2 mb-2 align-items-center">
                  {/* <b>Start:</b> */}
                  <DatePicker
                    selected={new Date(startDate)}
                    className="form-control me-2"
                    onChange={(date) =>
                      setStartDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />
                  <span width="10px"></span>
                  {/* <b>End:</b> */}
                  <DatePicker
                    selected={new Date(endDate)}
                    className="form-control"
                    onChange={(date) =>
                      setEndDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => handelSearchInvoice(e)}
                    placeholder="Search invoice id"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  {/* <div className="col-md-1"></div> */}
                  {/* <div className="col-md-4">
                    <Link
                      to="/categorySaleExport"
                      className="btn btn-dark float-end my-2 mr-2"
                    // onClick={() => setShow(true)}
                    >
                      Category Sales Report
                    </Link>
                  </div> */}
                  <div className="col-md-6">
                    <Link
                      to="/saleExport"
                      className="btn btn-dark float-end my-2 mr-2"
                      // onClick={() => setShow(true)}
                    >
                      Export Sales Report
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/articleSaleExport"
                      className="btn btn-dark  my-2 mr-2"
                      // onClick={() => setShow(true)}
                    >
                      Export Article Report
                    </Link>
                  </div>
                </div>

                {/* <button
                  className="btn btn-dark float-end my-2 mr-2 mx-2"
                  onClick={() => setShowA(true)}
                >
                  Article Sales Export CSV{" "}
                </button> */}
              </div>
            </div>

            {/* <Link to="/category-sales" className="btn btn-dark float-end my-2  mx-2">Category Sales </Link> */}

            <Table hover className="mt-4 table-bordered table-striped">
              <thead>
                <tr>
                  {/* <th scope="col">#</th> */}
                  <th scope="col">Invoice ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Biller</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Items</th>
                  <th scope="col">Paid</th>
                  <th scope="col">Change</th>
                  <th scope="col">Net Sale</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {console.log(sales)} */}
                {sales?.length > 0 ? (
                  sales.map((sale) => (
                    <tr key={sale._id}>
                      {/* <th >{i++}</th> */}
                      <th scope="row">{sale.invoiceId}</th>
                      <td>
                        {sale.createdAt &&
                          format(new Date(sale.createdAt), "MM-dd-yyyy H:m:ss")}
                      </td>
                      <td>{sale?.biller?.name}</td>
                      <td>{sale?.customer?.phone}</td>
                      <td>{sale.totalItem}</td>
                      <td>{sale.totalReceived}</td>
                      <td>{sale.changeAmount}</td>
                      <td>
                        {/* {sale.discount} */}
                        <b>
                          {parseFloat(sale?.grossTotalRound) -
                            parseFloat(sale?.discount)}
                        </b>
                      </td>
                      <td>{sale.status}</td>
                      {/* 
                                                <td>{sale.price}</td> */}
                      <td>
                        <Link to={`/print/${sale._id}`} target="_blank">
                          <Icons.EyeOutline
                            className="icon-eye"
                            size={22}
                          ></Icons.EyeOutline>
                        </Link>
                        {/* <Link to={`/sale/update/${sale._id}`}>
                          <Icons.PencilAltOutline
                            className="icon-edit"
                            size={22}
                          ></Icons.PencilAltOutline>
                        </Link> */}
                        <Icons.TrashOutline
                          className="icon-trash"
                          onClick={() => handelDeleteSale(sale._id)}
                          size={22}
                        ></Icons.TrashOutline>
                      </td>
                    </tr>
                  ))
                ) : (
                  // <tr>
                  //   <td colSpan={4}>Loading...</td>
                  // </tr>
                  <tr colSpan={9}>No Sales Found</tr>
                )}
              </tbody>
            </Table>

            {}
          </div>
        </div>
      </div>
      {/* <ExportSales
        show={show}
        handleClose={handleClose}
        sales={sales}
      ></ExportSales> */}
      {/* <ExportArticleSales
        show={showA}
        handleClose={handleAClose}
        sales={sales}
      ></ExportArticleSales> */}
    </div>
  );
};

export default Sales;
