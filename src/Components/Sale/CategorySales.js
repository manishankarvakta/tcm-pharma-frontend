import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import AlertService from "../Utility/AlertService";
import { CSVLink, CSVDownload } from "react-csv";
import ExportSales from "../Common/Modal/ExportSales";
// import { format } from 'date-fns';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';

const CategorySales = () => {
  const dateFormate = (date) => {
    const d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var newDate = month + "/" + day + "/" + year;

    return newDate;
  };

  const [sales, setSales] = useState([]);
  const [exportCSV, setExportCSV] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}sale`)
      .then((res) => res.json())
      .then((data) => setSales(data));
  }, []);

  const handelDeleteSale = async (id) => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Product?");

    if (confirmed) {
      // send data to the server
      fetch(`${process.env.REACT_APP_API_URL}sale/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            console.log("Deleted");
            const remaining = sales.filter((product) => product._id !== id);
            setSales(remaining);
          }
        });
    }
  };
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="All Sales"></Header>
            {/* Filter */}
            <div className="card">
              <div className="card-body">
                <h6 className="cart-title">Filter</h6>
                {/* <DayPicker
                                    mode="single"
                                    selected={selectedDay}
                                    onSelect={setSelectedDay}
                                    footer={footer}
                                /> */}
              </div>
            </div>
            <button
              className="btn btn-dark float-end my-2"
              onClick={handleShow}
            >
              Sales Export CSV{" "}
            </button>

            <Table hover className="mt-4">
              <thead>
                <tr>
                  {/* <th scope="col">#</th> */}
                  <th scope="col">Invoice ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Biller</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Items No</th>
                  <th scope="col">Gross Total</th>
                  <th scope="col">Paid</th>
                  <th scope="col">Change</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {console.log(sales)} */}
                {sales ? (
                  sales.map((sale) => (
                    <tr key={sale._id}>
                      {/* <th >{i++}</th> */}
                      <th scope="row">{sale._id}</th>
                      <td>{sale.date}</td>
                      <td>{sale.biller_id}</td>
                      <td>{sale.customer_id}</td>
                      <td>{sale.total_item}</td>
                      <td>{sale.total_round}</td>
                      <td>{sale.total_received}</td>
                      <td>{sale.change_amount}</td>
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
                        <Link to={`/sale/update/${sale._id}`}>
                          <Icons.PencilAltOutline
                            className="icon-edit"
                            size={22}
                          ></Icons.PencilAltOutline>
                        </Link>
                        <Icons.TrashOutline
                          className="icon-trash"
                          onClick={() => handelDeleteSale(sale._id)}
                          size={22}
                        ></Icons.TrashOutline>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>Loading...</td>
                  </tr>
                )}
              </tbody>
            </Table>

            { }
          </div>
        </div>
      </div>
      {/* <ExportSales show={show} handleClose={handleClose} sales={sales}></ExportSales> */}
    </div>
  );
};

export default CategorySales;
