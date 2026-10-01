import axios from "../../../services/apiClient";
import { ar } from "date-fns/locale";
import React, { useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import Header from "../../Common/Header/Header";
import ProductSearch from "../../Common/ProductSearch/ProductSearch";
import SideBar from "../../Common/SideBar/SideBar";
import { ImBarcode } from "react-icons/im";
import "./InventorySession.css";
import { notify } from "../../Utility/Notify";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import InventoryCountTable from "../../Common/DataTable/InventoryCountTable";
import { BsArchive } from "react-icons/bs";
import InventorySessionExport from "../../Common/Modal/InventorySessionExport";
import { signInUser } from "../../Utility/Auth";
import SelectProduct from "../../Common/CustomSelect/SearchProductInventory";
import { useInventoryCountByUserQuery, useAddInventoryCountMutation } from "../../../services/inventoryCountApi";

const InventorySession = () => {

  const user = signInUser();
  const selectRef = useRef(null);
  const selectQtyInput = useRef(null);

  const [addInventoryCount] = useAddInventoryCountMutation();
  const { data, error, isSuccess, isFetching, refetch } = useInventoryCountByUserQuery(user.id);
  const initCount = {
    article_code: "",
    qty: 0,
    warehouse: "645c9297ed6d5d94af257be9",
    userId: user.id,
    status: "active"
  }
  const [article, setArticle] = useState({})
  const [invCount, setInvCount] = useState(initCount);

  useEffect(() => {
    if (error) {
      console.log(error)
    } else {
      console.log(data)
      setInventory(data)
    }
  }, [isSuccess, refetch, isFetching])

  const [inventory, setInventory] = useState([]);



  const addToList = (data) => {
    console.log("Find result:", data)
    if (selectQtyInput.current) {
      selectQtyInput.current.focus();
      console.log("select product")
    }
    let count = {
      ...invCount,
      article_code: data._id,
      warehouse: "645c9297ed6d5d94af257be9",
    }
    setArticle(data)
    setInvCount(count)
    // selectQtyInput.current.focus();
  }

  // const selectPrice = (value) => {
  //   let count = {
  //     ...invCount,
  //     priceTable: value,
  //   }
  //   setInvCount(count);
  // }
  const selectQty = (value) => {
    let count = {
      ...invCount,
      qty: value,
    }
    setInvCount(count);
  }

  const handleInventoryCount = async (e) => {
    e.preventDefault();
    const add = await addInventoryCount(invCount);
    // if(add){
    //   console.log(add)

    // }
    setArticle({})
    setInvCount(initCount)
    // if (selectRef.current) {
    // }
    refetch()
    selectRef.current.focus();
  }
  // console.log("article:", article)
  // console.log("Count",invCount)
  // console.log("CountByUser",data)

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-md-2">
          <SideBar></SideBar>
        </div>
        <div className="col-md-10">
          <Header title="Products Inventory Session"></Header>
          <div className="row">
            <div className="col-md-5 col-12 pt-4">
              <h4>Inventory Count</h4>
              <SelectProduct
                selectRef={selectRef}
                addToList={addToList}
              >
              </SelectProduct>
              {/* <ProductSearch
                addToCart={addToCart}
                searchResult={searchResult}
                handleProductOnChange={handleProductOnChange}
              /> */}

              {article?.article_code ? (

                <form
                  className="py-4 inventory-form"
                  onSubmit={(e) => handleInventoryCount(e)}
                >
                  <h5><BsArchive size={20}> </BsArchive>  Article Information</h5>
                  <label>
                    <b>Name: </b>
                    {article?.name}
                  </label>
                  {/* <br />
                  <label>
                    <b>M. Category: </b>
                    {article?.master_category?.name}
                  </label>
                  <br />
                  <label>
                    <b>Category: </b>
                    {article?.category?.name}
                  </label> */}
                  {/* <br />
                  <label>
                    <b>EAN: </b>
                    {article?.ean}
                  </label> */}
                  <br />
                  <label>
                    <b>Code: </b>
                    {article?.article_code}
                  </label>
                  <br />
                  <label className="row items-center">
                    <div className="col-1 me-3">
                      <b>Group: </b>

                    </div>

                    <div className="col-4">
                      {article.group.name}
                    </div>
                  </label>
                  <label className="row items-center">
                    <div className="col-1 me-4">
                      <b>Generic: </b>

                    </div>

                    <div className="col-4 ms-1">
                      {article.generic.name}
                    </div>
                  </label>
                  <label className="row items-center">
                    <div className="col-1 me-3">
                      <b>Brand: </b>

                    </div>

                    <div className="col-4">
                      {article.brand.name}
                    </div>
                  </label>
                  <label className="row items-center">
                    <div className="col-1">
                      <b>TP: </b>

                    </div>

                    <div className="col-4">
                      {article.tp} BDT
                    </div>
                  </label>
                  <label className="row items-center">
                    <div className="col-1 me-1">
                      <b>MRP:{" "} </b>

                    </div>

                    <div className="col-4">
                      {article.mrp} BDT
                    </div>
                  </label>
                  <br />
                  <br />
                  <InputGroup className="mb-3">
                    <InputGroup.Text >
                      <span className="px-3">Count Stock Quantity</span>
                    </InputGroup.Text>
                    <FormControl
                      id="qtyField"
                      placeholder="Count Stock"
                      aria-label="Current Stock Quantity"
                      aria-describedby="basic-addon2"
                      onChange={(e) => selectQty(e.target.value)}
                      ref={selectQtyInput}
                    />
                    <Button
                      type="submit"
                      variant="dark"
                      id="button-addon2"
                    >
                      Submit
                    </Button>
                  </InputGroup>
                </form>

              ) : (
                <div className="scanPlease mt-5 pt-3">
                  <p className="d-flex  align-items-center justify-content-center">
                    <ImBarcode size={60} className="m-3"></ImBarcode>
                    <i className="">
                      Please Scan the Article Bar Code <br />
                      Or search product name or code
                    </i>
                  </p>
                </div>
              )}
              {/* <div className="export pt-5">
                <Button className="btn btn-dark" onClick={() => setShowA(true)}>
                  Export Inventory session CSV
                </Button>
              </div> */}

            </div>
            <div className="col-md-7 col-12 pt-4">
              {/* <h4></h4> */}
              {inventory ? (
                <InventoryCountTable
                  inventory={inventory}
                ></InventoryCountTable>
              ) : (
                <div className="text-center">
                  <BsArchive size={50} />
                  <h1 className="text-center">No Products</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
      {/* <InventorySessionExport
        show={showA}
        handleClose={handleAClose}
        exportInventory={exportInventory}
      ></InventorySessionExport> */}
    </div>
  );
};

export default InventorySession;
