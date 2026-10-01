import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Common/Header/Header";
import SideBar from "../../Common/SideBar/SideBar";
import "../Inventory.css";
import * as Icons from "heroicons-react";
import { Button, ProgressBar, Table } from "react-bootstrap";
import axios from "../../../services/apiClient";
import { useInventoriesQuery } from "../../../services/inventoryCountApi";
import { format } from "date-fns";
import ExportInventoryCount from "../../Common/Modal/ExportInventoryCount";
// import useInventory from '../Hooks/useInventory';
// let selected = {};
const InventoryExport = () => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  let i = 0;
  const [show, setShow] = useState(false);
  const { data, isSuccess, error } = useInventoriesQuery();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  console.log(data);

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Products Inventory Export"></Header>
            <div className="row">
              <div className="col-9"></div>
              <div className="col-3 text-end">
                <Button className="btn btn-dark mt-3" onClick={handleShow}>
                  <Icons.DownloadOutline
                    className="icon-trash text-warning"
                    size={22}
                  ></Icons.DownloadOutline>{" "}
                  Export Inventory
                </Button>
              </div>
            </div>
            <Table hover className="mt-3 mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Article Code</th>
                  <th scope="col">Name</th>
                  <th scope="col">MRP</th>
                  <th scope="col">Qty</th>
                  <th scope="col">User</th>
                  <th scope="col">Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((inventory, index) => (
                    <tr key={index}>
                      {/* {console.log("-loop", inventory)} */}
                      <th scope="row">{++i}</th>
                      <td>{inventory?.article_code?.article_code}</td>
                      <td>{inventory?.article_code?.name}</td>
                      <td>{inventory?.article_code?.mrp}</td>
                      <td>{inventory?.qty}</td>
                      <td>{inventory?.userId?.name}</td>
                      <td>
                        {format(
                          new Date(inventory?.createdAt),
                          "MM-dd-yyyy hh:mm "
                        )}
                      </td>
                      <td className="text-center">
                        {/* <Link to={`/inventory/${user._id}`}> </Link> */}
                        {inventory?.status === "active" ? (
                          <Icons.CheckOutline
                            className="icon-eye text-success"
                            size={22}
                          ></Icons.CheckOutline>
                        ) : (
                          <Icons.ClockOutline
                            className="icon-trash text-warning"
                            size={22}
                          ></Icons.ClockOutline>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <>Loading Inventory Counts ....</>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <ExportInventoryCount show={show} handleClose={handleClose} data={data} />
    </div>
  );
};

export default InventoryExport;
