import * as Icons from "heroicons-react";
import { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DataAddSuppliers,
  supplierProducts,
} from "../../features/supplierSlice";
import SearchProduct from "../Common/CustomSelect/SearchProduct";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./Supplier.css";
import { v4 as uuidv4 } from "uuid";

import { useAddSupplierMutation } from "../../services/supplierApi";

import LoadingModal from "../Common/Modal/LoadingModal";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { apiUniqueErrHandle } from "../Utility/Utility";
import axios from "../../services/apiClient";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const CreateSupplier = () => {
  let i = 1;
  const [pData, setPData] = useState([]);
  const [AddSupplier] = useAddSupplierMutation();
  const { register, handleSubmit, reset } = useForm({});
  const [supplierCode, setSupplierCode] = useState();
  const supplierProductsRef = useRef(null);
    const lang = useSelector((state) => state.languageReducer);
  
  const auth = signInUser();
  const { aamarId } = auth;

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  const getCartData = JSON.parse(localStorage.getItem("supplier_cart"));
  // console.log(csvData);
  console.log("getCartData,", getCartData);

  let navigate = useNavigate();
  const dispatch = useDispatch();


  
  // CHECK UNIQUE
  const checkCodeInAPI = async (code) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/supplier/unique/${code}/${aamarId}`,
        {
          params: { code }
        }
      );
      console.log(response.data.exists);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking code in API:", error);
      return false; // Default to not found in case of an error
    }
  };

  const generateUniqueSixDigitCode = async () => {
    let numericCode;
    do {
      const uuid = uuidv4();
      numericCode = parseInt(uuid.split("-")[0], 16) % 1000000;
      numericCode = String(numericCode).padStart(6, "0");
    } while (await checkCodeInAPI(numericCode));

    setSupplierCode(numericCode);
    return numericCode;
  };

  useEffect(() => {
    generateUniqueSixDigitCode();
  }, []);

  useEffect(() => {
    setPData(getCartData);
    dispatch(supplierProducts(pData));
    console.log("suplier", supplierProductsRef.current);
  }, []);

  // ADD TO LIST
  const addToList = async (data) => {
    console.log(
      "Debugging data before adding to list:",
      JSON.stringify(data, null, 2)
    );

    if (data) {
      // console.log("add to list:", data);
      const getData = JSON.parse(localStorage.getItem("supplier_cart"));
      let listData = getData ? getData : [];

      let newProduct = {};
      const idExist = listData.find((pro) => pro.id === data._id);

      if (idExist) {
        notify("Product Already in List", "error");
      } else {
        newProduct = {
          id: data?._id,
          name: data?.name,
          article_code: data?.article_code,
          unit: data?.unit,
          order: listData?.length + 1,
          mrp: data?.mrp,
          brand: data?.brand?.name || "N/A",
          generic: data?.generic?.name || "N/A",
          tp: data?.tp,
          group: data?.group?.name || "N/A",
        };
        listData = [...listData, newProduct];
      }

      console.log("Updated List:", listData);
      setPData([...listData]); // Ensuring valid data format
      reset({ products: listData });

      localStorage.setItem("supplier_cart", JSON.stringify(listData));
      supplierProductsRef?.current?.focus();
    } else {
      return false;
    }
  };

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      // dispatch(DataAddSuppliers(data));
      const requestData = {
        ...data, // Spread the existing data
        aamarId, // Add aamarId
      };
      // console.log(requestData);
      dispatch(DataAddSuppliers(requestData));

      setLoader(true);
      const response = await AddSupplier(requestData);
      // console.log("aamarId", aamarId);
      if (response) {
        console.log("response", response);
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          reset({
            name: "",
            email: "",
            code: "",
            company: "",
            unit: "",
            products: "",
            address: "",
            type: "",
            phone: "",
            status: "",
          });
          // console.log(data);
          // console.log(response?.data?.message);
          localStorage.removeItem("supplier_cart");

          return navigate("/supplier");
          // refetch();
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  const handleReset = () => {
    reset({
      name: "",
      email: "",
      code: "",
      company: "",
      type: "",
      phone: "",
      status: "",
    });
  };

  const removeFromCart = (id) => {
    const getData = JSON.parse(localStorage.getItem("supplier_cart"));
    const restData = getData.filter((pro) => pro.id !== id);
    localStorage.setItem("supplier_cart", JSON.stringify(restData));
    setPData(restData);
    // console.log(restData);
  };
  console.log("pData", pData);

  // const jamil = useSelector((state) => state.supplier);
  // console.log("jamil", jamil);
  return (
    <div>
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
            <Header title={lang?.addSupplier}></Header>
            <div className="row">
              <div className="col-md-12">
                <div className="">
                  <div className=" mt-2">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                          <div className="form-group col-md-4 col-6">
                            {/* <label htmlFor="inputSupplierCompany">Supplier Company</label> */}
                            <input
                              {...register("company", { required: true })}
                              type="text"
                              className="form-control"
                              id="inputSupplierCompany"
                              placeholder="Supplier Company"
                            />
                            <small
                              id="emailHelp"
                              className="form-text text-muted"
                            >
                              We'll never share your email with anyone else.
                            </small>
                          </div>
                          <div className="form-group col-md-4 col-6  mb-3">
                            {/* <label htmlFor="inputSupplier">Supplier Name</label> */}
                            <input
                              {...register("name")}
                              type="text"
                              className="form-control"
                              id="inputSupplier"
                              placeholder="Supplier Name"
                            />
                            <small
                              id="emailHelp"
                              className="form-text text-muted"
                            >
                              We'll never share your email with anyone else.
                            </small>
                          </div>
                          <div className="form-group col-md-4 col-6  mb-3">
                            {/* <label htmlFor="inputEmail">Supplier Email</label> */}
                            <input
                              {...register("email")}
                              type="email"
                              className="form-control"
                              id="inputEmail"
                              placeholder="Supplier Email"
                            />
                            <small
                              id="emailHelp"
                              className="form-text text-muted"
                            >
                              We'll never share your email with anyone else.
                            </small>
                          </div>
                          <div className="form-group col-md-4 col-6 mb-3">
                            {/* <label htmlFor="inputMC">Supplier Phone</label> */}
                            <input
                              {...register("phone")}
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="Supplier Phone"
                            />
                          </div>
                          <div className="form-group col-md-4 col-6  mb-3">
                            {/* <label htmlFor="status">Status</label> */}
                            <input
                              {...register("code")}
                              type="text"
                              className="form-control"
                              id="code"
                              placeholder="Supplier code"
                              value={supplierCode}
                            />
                          </div>
                          <div className="form-group col-md-4 col-6  mb-3">
                            {/* <label htmlFor="status">Status</label> */}
                            <select
                              {...register("status")}
                              className="form-select"
                              id="status"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                          <div className="form-group col-12  mb-3">
                            {/* <label htmlFor="address">Address</label> */}
                            <textarea
                              {...register("address")}
                              className="form-control"
                              id="address"
                              placeholder="Address"
                            />
                          </div>
                          {/* </div> */}
                          <div className="col-12 mb-3">
                            <p className="mb-1">
                              <b>Supplier's Products</b>
                            </p>
                            <SearchProduct
                              className="searchProduct"
                              // getValue={getValue}
                              addToList={addToList}
                              supplierProductsRef={supplierProductsRef}
                              // aamarId={aamarId}
                            ></SearchProduct>
                            {/* <ProductSearch
                            addToCart={addToCart}
                            searchResult={searchResult}
                            handleProductOnChange={handleProductOnChange}
                          /> */}
                          </div>
                          {/* <div className="col-2 mb-3 mt-4">
                            <button
                              className="btn btn-dark btn-block "
                              onClick={importProduct}
                            >
                              <Icons.Plus> </Icons.Plus>
                              Import Products
                            </button>
                          </div> */}

                          <div className="col-12 mb-3">
                            <div className="card mt-3 p-2">
                              <div className="table-responsive">
                                <Table>
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Name</th>
                                      <th>Brand</th>
                                      <th>Generic</th>
                                      <th>Group</th>
                                      <th>Code</th>
                                      {/* <th>Unit</th> */}
                                      <th>TP</th>
                                      <th>MRP</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pData ? (
                                      pData
                                        .sort((a, b) =>
                                          (a.name || "").localeCompare(b.name || "")
                                        )
                                        .map((item, index) => (
                                          <tr key={item.order}>
                                            <th>{index + 1}</th>
                                            <td>{item?.name}</td>
                                            <td>
                                              {typeof item?.brand === "object"
                                                ? item.brand.name
                                                : item?.brand || "N/A"}
                                            </td>
                                            <td>
                                              {typeof item?.generic === "object"
                                                ? item.generic.name
                                                : item?.generic || "N/A"}
                                            </td>
                                            <td>
                                              {typeof item?.group === "object"
                                                ? item.group.name
                                                : item?.group || "N/A"}
                                            </td>
                                            <td>{item?.article_code}</td>
                                            {/* <td>{item?.unit}</td> */}
                                            <td>{item?.tp}</td>
                                            <td>{item?.mrp}</td>
                                            <td className="ps-3">
                                              <Icons.X
                                                size={20}
                                                onClick={() =>
                                                  removeFromCart(item.id)
                                                }
                                              />
                                            </td>
                                          </tr>
                                        ))
                                    ) : (
                                      <tr>
                                        <td colSpan={10}>
                                          <p className="text-center m-2">
                                            Please select product
                                          </p>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-dark float-end "
                        >
                          <Icons.Plus> </Icons.Plus>
                          Supplier
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
  );
};

export default CreateSupplier;
