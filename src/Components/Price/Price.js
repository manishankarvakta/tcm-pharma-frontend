import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import * as Icons from "heroicons-react";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import {
  usePricesQuery,
  usePriceQuery,
  useAddPriceMutation,
  useUpdatePriceMutation,
  useDeletePriceMutation,
} from "../../services/priceApi";
import { apiUniqueErrHandle } from "../Utility/Utility";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import SupplierSelectByProduct from "../Common/CustomSelect/SupplierSelectByProduct";
import SearchProduct from "../Common/CustomSelect/SearchProduct";

const Price = () => {
  const [AddPrice] = useAddPriceMutation();
  const { data, isLoading, isFetching } = usePricesQuery();
  const { register, handleSubmit, reset } = useForm({});
  const [supplier, setSupplier] = useState({});
  const [warehouse, setWarehouse] = useState({});
  const [supplierProduct, setSupplierProduct] = useState({});
  const navigate = useNavigate();
  //   const { data } = usePriceQuery();

  console.log(data);

  // FORM ONCHANGE FUNCTION
  const onSubmit = async (data) => {
    console.log(data);
    const response = await AddPrice(data);
    if (response) {
      console.log(response);
      if (response?.error) {
        apiUniqueErrHandle(response);
      } else {
        reset({
          product: "",
          supplier: "",
          warehouse: "",
          tp: "",
          mrp: "",
          status: "",
        });
        console.log(response?.data?.message);
        return navigate("/price");
      }
    }
  };

  //   FORM RESET DATA
  const handleReset = () => {
    reset({
      product: "",
      supplier: "",
      warehouse: "",
      tp: "",
      mrp: "",
      status: "",
    });
  };

  // SUPPLIER SELECT HANDLE
  const handleOnchangeSupplier = (e) => {
    // console.log(e)
    setSupplier(e.option);
    reset({
      supplier: e.option,
    });
  };

  //WAREHOUSE SELECT HANDLE
  const handleOnchangeWarehouse = (e) => {
    console.log(e);
    setWarehouse(e.option);
    reset({
      warehouse: e.option,
    });
  };

  const handleOnchangeProduct = (e) => {
    // console.log(e)
    setSupplierProduct(e.option);
    reset({
      product: e.option,
    });
  };

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <SideBar></SideBar>
            </div>
            <div className="col-md-10">
              <Header title={data?._id ? "Update Price" : "Add Price"}></Header>
              <div className="row">
                <div className="col-md-12">
                  <div className="">
                    <div className=" mt-4">
                      <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="row mb-3">
                            <div className="form-group col-4  mb-3">
                              <label htmlFor="inputSupplierCompany">
                                Product Name
                              </label>
                              <SearchProduct
                                handleOnchange={(e) => handleOnchangeProduct(e)}
                              ></SearchProduct>
                            </div>
                            <div className="form-group col-4  mb-3">
                              <label htmlFor="inputSupplier">
                                Supplier Name
                              </label>
                              <SupplierSelectByProduct
                                supplier={supplier}
                                handleOnchange={(e) =>
                                  handleOnchangeSupplier(e)
                                }
                              ></SupplierSelectByProduct>
                            </div>
                            <div className="form-group col-4  mb-3">
                              <label htmlFor="inputEmail">warehouse Name</label>
                              <WareHouseDW
                                warehouse={warehouse}
                                handleOnchange={(e) =>
                                  handleOnchangeWarehouse(e)
                                }
                              />
                            </div>
                            <div className="form-group col-4  mb-3">
                              <label htmlFor="inputMC">TP</label>
                              <input
                                {...register("tp")}
                                type="text"
                                className="form-control"
                                id="tp"
                                placeholder="Price tp"
                              />
                            </div>
                            <div className="form-group col-4  mb-3">
                              <label htmlFor="mrp">MRP</label>
                              <input
                                {...register("mrp")}
                                type="text"
                                className="form-control"
                                id="mrp"
                                placeholder="Price mrp"
                              />
                            </div>
                            <div className="form-group col-4  mb-3">
                              <label htmlFor="status">Status</label>
                              <select
                                {...register("status")}
                                className="form-select"
                                id="status"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-dark float-end "
                          >
                            {data?._id ? (
                              <>
                                <Icons.SaveOutline></Icons.SaveOutline>
                              </>
                            ) : (
                              <>
                                <Icons.Plus> </Icons.Plus>
                              </>
                            )}{" "}
                            Price
                          </button>
                          <button
                            type="reset"
                            onClick={handleReset}
                            className="mx-2 btn btn-outline-dark float-end"
                          >
                            Reset
                          </button>
                          {/* <button
                                                        type="reset"
                                                        onClick={handleCancle}
                                                        className="mx-2 btn btn-outline-dark float-end"
                                                        >
                                                        Cancle
                                                    </button> */}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export default Price;
