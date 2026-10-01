import * as Icons from "heroicons-react";
import { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DataAddSuppliers } from "../../features/supplierSlice";
import {
  useSupplierQuery,
  useUpdateSupplierMutation,
} from "../../services/supplierApi";
import SearchProduct from "../Common/CustomSelect/SearchProduct";
import Header from "../Common/Header/Header";
import LoadingModal from "../Common/Modal/LoadingModal";
import SupplierProductModal from "../Common/Modal/SupplierProductModal";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import "./Supplier.css";

const UpdateSupplier = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  let i = 1;
    const lang = useSelector((state) => state.languageReducer);
  
  const dispatch = useDispatch();
  const { id } = useParams();
  let navigate = useNavigate();
  // const [importProducts, setImportProducts] = useState([]);
  const [pData, setPData] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm({});
  const supplierProductsRef = useRef(null);
  const { data, error, isLoading, refetch, isFetching, isSuccess } =
    useSupplierQuery(`${id}`);
  // console.log("data", data);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);
  useEffect(() => {
    refetch();
  }, [id]);

  useEffect(() => {
    if (data) {
      console.log("SUPPLIER", data);
      let products = [];
      data?.productDetails?.map((pro, index) => {
        products = [
          ...products,
          {
            ...pro,
            id: pro?.id || pro?._id,
            order: pro?.order || index + 1,
          },
        ];
      });

      reset({
        _id: data?._id,
        company: data?.company,
        name: data?.name,
        email: data?.email,
        code: data?.code,
        unit: data?.unit,
        status: data?.status,
        phone: data?.phone,
        address: data?.address,
        // products: products,
      });

      // console.log(data.products);
      // console.log(products);
      setPData(products);
      localStorage.setItem("supplier_cart", JSON.stringify(products));
    }
    setLoader(false);
  }, [isSuccess, data]);

  // console.log("updated", data);

  // useEffect(() => {
  //   const getCartData = localStorage.getItem("supplier_cart");
  //   let listData = getCartData ? getCartData : [];

  //   // console.log(pData);
  //   // dispatch(supplierProducts(pData))
  //   // console.log(supplierProductsRef.current);
  // }, [data]);

  useEffect(() => {
    localStorage.setItem("supplier_cart", JSON.stringify(pData));
    setValue("products", pData);
  }, [pData]);

  const importProduct = (e) => {
    e.preventDefault();
    handleShow();
    console.log("clicked");
  };

  // handel user update
  const [updateSupplier] = useUpdateSupplierMutation();

  const addToList = async (data) => {
    console.log(data);
    if (data) {
      console.log("add to list:", data);
      // await supplierProductsRef.current.blur();
      const getData = JSON.parse(localStorage.getItem("supplier_cart"));
      let listData = getData ? getData : [];
      console.log("old:", listData);

      let newProduct = {};
      // unique check
      const idExist = listData.find((pro) => pro.id === data._id);
      if (idExist) {
        notify("Product Already in List", "error");
        // console.log()
      } else {
        notify("Product is Added", "success");
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

      console.log("upcoming:", newProduct);
      console.log("Updated:", listData);
      setPData([...listData]);
      setValue("products", listData);

      // console.log(newProduct)
      localStorage.setItem("supplier_cart", JSON.stringify(listData));
      // supplierProductsRef.current.focus();
    } else {
      return false;
    }
  };

  const removeFromCart = (id) => {
    notify("Product removed", "error");
    const getData = JSON.parse(localStorage.getItem("supplier_cart"));
    console.log("getData", id);
    const restData = getData?.filter((pro) => pro?.id !== id);
    console.log("rest", restData);
    localStorage.setItem("supplier_cart", JSON.stringify(restData));
    setPData(restData);
    setValue("products", restData);
  };

  const updateHandler = async (data) => {
    console.log("supplier data", data);
    console.log("supplier ID:", data._id);

    if (!data._id) {
      console.error("Missing supplier ID");
      return;
    }

    const requestData = { _id: data._id, ...data }; // Ensure `_id` is included

    dispatch(DataAddSuppliers(requestData)); // If needed for state management

    try {
      const response = await updateSupplier(requestData);
      if (response) {
        console.log(response);
        notify("Supplier Update Successful!", "success");
        navigate("/supplier");
        localStorage.removeItem("supplier_cart");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <LoadingModal
          title=""
          onShow={loader}
          handleClose={handleLoaderClose}
        ></LoadingModal>
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header
              title={data?._id ? lang?.updateSupplier : lang?.addSupplier}
            ></Header>
            <div className="row">
              <div className="col-md-12">
                <div className="">
                  <div className=" mt-4">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(updateHandler)}>
                        <div className="row mb-3">
                          <div className="form-group col-4  mb-3">
                            {/* <label htmlFor="inputSupplierCompany">Supplier Company</label> */}
                            <input type="hidden" {...register("_id")} />
                            <input
                              {...register("company")}
                              type="text"
                              className="form-control"
                              id="inputSupplierCompany"
                              aria-describedby="emailHelp"
                              placeholder="Supplier Company"
                            />
                            <small
                              id="emailHelp"
                              className="form-text text-muted"
                            >
                              We'll never share your email with anyone else.
                            </small>
                          </div>
                          <div className="form-group col-4  mb-3">
                            {/* <label htmlFor="inputSupplier">Supplier Name</label> */}
                            <input
                              {...register("name")}
                              type="text"
                              className="form-control"
                              id="inputSupplier"
                              aria-describedby="emailHelp"
                              placeholder="Supplier Name"
                            />
                            <small
                              id="emailHelp"
                              className="form-text text-muted"
                            >
                              We'll never share your email with anyone else.
                            </small>
                          </div>
                          <div className="form-group col-4  mb-3">
                            {/* <label htmlFor="inputEmail">Supplier Email</label> */}
                            <input
                              {...register("email")}
                              type="email"
                              className="form-control"
                              id="inputEmail"
                              aria-describedby="emailHelp"
                              placeholder="Supplier Email"
                            />
                            <small
                              id="emailHelp"
                              className="form-text text-muted"
                            >
                              We'll never share your email with anyone else.
                            </small>
                          </div>
                          <div className="form-group col-4  mb-3">
                            {/* <label htmlFor="inputMC">Supplier Phone</label> */}
                            <input
                              {...register("phone")}
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="Supplier Phone"
                            />
                          </div>
                          <div className="form-group col-4  mb-3">
                            {/* <label htmlFor="COde">COde</label> */}
                            <input
                              {...register("code")}
                              type="text"
                              className="form-control"
                              id="code"
                              placeholder="Supplier Code"
                            />
                          </div>
                          <div className="form-group col-4  mb-3">
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
                          <div className="form-group col-12  mb-md-3">
                            {/* <label htmlFor="address">Address</label> */}
                            <textarea
                              {...register("address")}
                              className="form-control"
                              id="address"
                              placeholder="Address"
                            />
                          </div>
                        </div>
                        {/* SEARCH PRODUCT */}
                        <div className="row ">
                          <div className="col-10 mb-3">
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
                          <div className="col-md-2 mb-3 mt-md-4">
                            <button
                              className="btn btn-dark btn-block "
                              onClick={importProduct}
                            >
                              <Icons.Plus> </Icons.Plus>
                              Import Products
                            </button>
                          </div>
                        </div>
                        <div className="col-12 mb-3">
                          {/* <p className="mb-1">
                            <b>Supplier's Products</b>
                          </p>
                          <SearchProduct
                            className="searchProduct"
                            // getValue={getValue}
                            addToList={addToList}
                            supplierProductsRef={supplierProductsRef}
                          ></SearchProduct> */}
                          <div
                            className="card mt-3 p-2 "
                            style={{ maxHeight: "400px", overflowY: "scroll" }}
                          >
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
                                   [...pData]
                                     .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                                     .map((item, index) => (
                                       <tr key={item?.id || item?.article_code || index}>
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
                                    <td colSpan={6}>
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

                        <button
                          type="submit"
                          className="btn btn-dark float-end mb-2"
                        >
                          <Icons.SaveOutline></Icons.SaveOutline>
                          Update
                        </button>
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
      <SupplierProductModal
        pData={pData}
        setPData={setPData}
        show={show}
        setShow={setShow}
        handleClose={handleClose}
        // handleImportButton={handleImportButton}
      ></SupplierProductModal>
    </div>
  );
};

export default UpdateSupplier;
