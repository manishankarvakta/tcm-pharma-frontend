import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Inventory.css";
import * as Icons from "heroicons-react";
import { ProgressBar, Table } from "react-bootstrap";
import CsvImporterInventory from "../Common/CsvImporter/CsvImporterInventory";
import axios from "../../services/apiClient";
// import useInventory from '../Hooks/useInventory';
// let selected = {};
const InventoryInit = () => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  let i = 0;
  const [inventories, setInventories] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [current, setCurrent] = useState(0);

  const importInventory = async (data) => {
    console.log(data);
    const success = await axios.post(`${BASE_URL}/inventory`, data);

    if (success.data.status === true) {
      return true;
    } else {
      return false;
    }
  };

  const handleImportButton = async () => {
    console.log(csvData);
    // let i = 0;
    // // console.log(csvData?.length);
    // csvData?.map((element) => {
    //   updateStatus(element.article_code);
    //   setCurrent(++i);
    // });

    let counter = 0;
    const timer = setInterval(function () {
      setCurrent(counter);
      console.log(csvData[counter]);
      importInventory(csvData[counter]);
      counter++;
      console.log("length", counter, csvData.length);
      if (counter > csvData.length) {
        clearInterval(timer);
      }
    }, 10);
  };

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Products Inventory Init"></Header>
            <CsvImporterInventory
              setCsvData={setCsvData}
              csvData={csvData}
              title="Inventory"
              handleImportButton={handleImportButton}
            ></CsvImporterInventory>
            {/* ProgressBAr */}
            <ProgressBar
              striped
              variant="success"
              now={
                current > 0
                  ? csvData?.length > 0
                    ? Math.fround((100 / csvData?.length) * current)?.toFixed(2)
                    : 0
                  : 0
              }
              label={`${
                current > 0
                  ? csvData?.length > 0
                    ? Math.fround((100 / csvData?.length) * current)?.toFixed(2)
                    : 0
                  : 0
              }%  - ${current} of ${csvData?.length}`}
            />
            <Table hover className="mt-5">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Article Code</th>
                  <th scope="col">Name</th>
                  <th scope="col">Opening Quantity</th>
                  <th scope="col">Current Quantity</th>
                  <th scope="col">Total Quantity</th>
                  <th scope="col">Total Sold</th>
                  <th scope="col">Total Damage</th>
                  <th scope="col">Total RTV</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  csvData?.length > 0 ? (
                    csvData.map((inventory, index) => (
                      <tr key={index}>
                        {/* {console.log("-loop", inventory)} */}
                        <th scope="row">{++i}</th>
                        <td>{inventory?.article_code}</td>
                        <td>{inventory?.name}</td>
                        <td>{inventory?.currentQty}</td>
                        <td>{inventory?.openingQty}</td>
                        <td>{inventory?.totalQty}</td>
                        <td>{inventory?.soldQty}</td>
                        <td>{inventory?.damageQty}</td>
                        <td>{inventory?.rtvQty}</td>
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
                          {/* <Link to={`/user/update/${user._id}`}> */}
                          {/* <Icons.PencilAltOutline className="icon-edit" size={22} ></Icons.PencilAltOutline> */}
                          {/* </Link> */}
                          {/* <Icons.TrashOutline className="icon-trash"  size={22} ></Icons.TrashOutline> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <></>
                  )
                  //   csvData?.map((inventory) => (
                  //     <tr key={inventory?._id}>
                  //       {/* {console.log("-loop", inventory)} */}
                  //       <th scope="row">{i++}</th>
                  //       <td>{inventory?.article_code}</td>
                  //       <td>{inventory?.name}</td>
                  //       <td>0</td>
                  //       <td>0</td>
                  //       <td>0</td>
                  //       <td>0</td>
                  //       <td className="text-center">
                  //         {/* <Link to={`/inventory/${user._id}`}> </Link> */}
                  //         {inventory?.status === true ? (
                  //           <Icons.CheckOutline
                  //             className="icon-eye text-success"
                  //             size={22}
                  //           ></Icons.CheckOutline>
                  //         ) : (
                  //           <Icons.ClockOutline
                  //             className="icon-trash text-warning"
                  //             size={22}
                  //           ></Icons.ClockOutline>
                  //         )}
                  //       </td>
                  //     </tr>
                  //   ))
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryInit;
