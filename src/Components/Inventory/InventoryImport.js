import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Inventory.css";
import * as Icons from "heroicons-react";
import { ProgressBar, Table } from "react-bootstrap";
import CsvImporterInventory from "../Common/CsvImporter/CsvImporterInventory";
import axios from "../../services/apiClient";
import {
  useAddInventoryMutation,
  useAddInventoryPriceMutation,
  useInventoryByArticleQuery,
  useUpdateInventoryMutation,
} from "../../services/inventoryApi";
import { notify } from "../Utility/Notify";
// import useInventory from '../Hooks/useInventory';
// let selected = {};
const InventoryImport = () => {
  // const [useAddInventoryPrice] = useAddInventoryPriceMutation();
  const [updateInventory] = useUpdateInventoryMutation();
  const [addInventory] = useAddInventoryMutation();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // const {data, error,isSuccess} = useInventoryByArticleQuery()
  let i = 0;
  const [inventories, setInventories] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
    let invData = [];
    csvData?.length > 0 &&
      csvData?.map((inv) => {
        invData = [
          ...invData,
          {
            name: inv?.name,
            warehouse: inv?.warehouse,
            article_code: inv?.article_code,
            qty: inv?.qty,
          },
        ];
      });

    setInventories(invData);
  }, [csvData]);

  // console.log(csvData);
  const importInventory = async (data) => {
    const { article_code, qty, name, warehouse } = data;
    let inventory = {};
    const success = await axios.get(
      `${BASE_URL}/inventory/article_code/${article_code}`
    );

    // inventory = { ...success?.data };
    console.log(success);
    console.log("data", data);

    if (success.data) {
      inventory = {
        ...success.data,
        currentQty: Number(success?.data?.currentQty) + Number(qty),
        openingQty: Number(success?.data?.openingQty),
        totalQty: Number(success?.data?.totalQty) + Number(qty),
        soldQty: Number(success?.data?.soldQty),
        damageQty: Number(success?.data?.damageQty),
        rtvQty: Number(success?.data?.rtvQty),
        tpnQty: Number(success?.data?.soldQty),
      };
      console.log(inventory)
      const update = await updateInventory(inventory);
      console.log("updateInventory", update)

    } else {
      inventory = {
        article_code: String(article_code),
        name: name,
        warehouse: "645c9297ed6d5d94af257be9",
        currentQty: Number(qty),
        openingQty: Number(qty),
        totalQty: Number(qty),
        soldQty: 0,
        damageQty: 0,
        rtvQty: 0,
        tpnQty: 0,
        status: "active",
      };

      const update = await addInventory(inventory);
      console.log("addInventory", update);
    }


    // if (success?.data?.length > 0) {
    //   // CHECK IF PRICE TABLE EXIST
    //   const checked = success?.data?.filter((p) => p.id === priceId);
    //   const rest = success?.data?.filter((p) => p.id !== priceId);
    //   console.log("selected", checked[0]);
    //   // console.log("rest", rest);
    //   if (checked?.length > 0) {
    //     console.log(checked, "exist", qty, Number(checked[0]?.currentQty));
    //     inventory = {
    //       ...success?.data,

    //       currentQty: Number(success?.data?.currentQty) + Number(qty),
    //       openingQty: Number(success?.data?.openingQty),
    //       totalQty: Number(success?.data?.totalQty) + Number(qty),
    //       soldQty: Number(success?.data?.soldQty),
    //     };
    //     // const update = await updateInventory(inventory);
    //     // console.log("updateInventory", update);
    //   } else {
    //     console.log("create Inventory price");
    //     inventory = {
    //       ...success?.data,
    //       currentQty: Number(success?.data?.currentQty) + Number(qty),
    //       openingQty: Number(success?.data?.openingQty) + Number(qty),
    //       totalQty: Number(success?.data?.totalQty) + Number(qty),
    //       soldQty: Number(success?.data?.soldQty),
    //     };
    //     // console.log("create price", inventory);
    //   }

    //   const update = await updateInventory(inventory);
    //   console.log("updateInventory", update);
    //   console.log(inventory);

    //   // console.log(typeof success.data.openingQty);
    //   // console.log(typeof Number(qty));
    // } else {
    //   // INVENTORY IS NOT EXIST
    //   // WRKING/
    //   // CREATE NEW INVENTORY
    //   inventory = {
    //     ...success?.data,
    //     currentQty: Number(qty),
    //     openingQty: Number(qty),
    //     totalQty: Number(qty),
    //     soldQty: 0,
    //     status: "active",
    //   };
    //   const update = await updateInventory(inventory);
    //   console.log("updateInventory", update);

    //   // console.log(inventory);
    // }

    // console.log(update);
  };

  // HANDLE IMPORT BUTTON
  const handleImportButton = async () => {
    let counter = 0;
    // console.log(inventories?.length);
    const timer = setInterval(function () {
      importInventory(inventories[counter]);
      // console.log(inventories[counter]?.article_code);
      ++counter;
      console.log("length", counter, inventories?.length);
      setCurrent(counter);

      if (counter >= inventories?.length) {
        clearInterval(timer);
      }
    }, 150);
  };

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Products Inventory Import"></Header>
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
              label={`${current > 0
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
                  <th scope="col">Qty</th>
                  <th scope="col">User</th>
                  <th scope="col">Date</th>
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
                        <td>{inventory?.qty}</td>
                        <td>{inventory?.user}</td>
                        <td>{inventory?.date}</td>
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
                    <></>
                  )
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryImport;
