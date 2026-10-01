/* eslint-disable react-hooks/exhaustive-deps */
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  useAddCustomerMutation,
  useCustomerCountQuery,
  useCustomerPagenationQuery,
  useCustomersExportQuery,
  useCustomersQuery,
  useDeleteCustomerMutation,
} from "../../services/customerApi";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Header from "../Common/Header/Header";
import CustomerExportModal from "../Common/Modal/CustomerExportModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { apiUniqueErrHandle } from "../Utility/Utility";
import CreateCustomerForm from "./CreateCustomerForm";
import "./Customer.css";
import AlertService from "../Utility/AlertService";

const Customer = () => {
  let navigate = useNavigate();
  const id = uuidv4();
  const [Addcustomer, { isLoading: isAdding }] = useAddCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const CustomersView = useCustomersQuery();
  const user = signInUser();
  const { aamarId } = user;
  const [group, setGroup] = useState("");
  console.log("user", user);
  const [warehouse, setWarehouse] = useState("allWh");


  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useCustomerPagenationQuery({
      page,
      size,
      warehouse,
      aamarId,
      q,
    });
  console.log(data);

  useEffect(() => {
    refetch();
  }, [warehouse]);
  // console.log(data);
  // const [Datacustomer] = useCustomerQuery(`${_id}`);
  const [onShowCustomer, setOnShowCustomer] = useState(false);
  const handleCloseCustomer = () => setOnShowCustomer(false);

  const { data: customer, isSuccess: isSuccessCustomer } =
    useCustomersExportQuery({ warehouse, aamarId });
  useEffect(() => {
    if (user?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(user?.warehouse);
    }
  }, []);

  const { register, handleSubmit, reset, setValue } = useForm({});
  let i = 1;
  // const onSubmit = async (customer) => {
  //   console.log("customer Create", customer);
  //   let newCustomer = {};

  //   newCustomer = {
  //     name: customer?.name,
  //     password: customer?.password,
  //     phone: customer?.phone,
  //     email: customer?.email,
  //     username: customer?.username,
  //     membership: customer?.membership,
  //     address: [
  //       {
  //         type: "Home",
  //         id: id,
  //         holdingNo: customer?.holdingNo,
  //         sector: customer?.sector,
  //         street: customer?.street,
  //         town: customer?.town,
  //         city: customer?.city,
  //         division: customer?.division,
  //         country: customer?.country,
  //         zipCode: customer?.zipCode,
  //       },
  //     ],
  //     point: customer?.point ? customer?.point : 0,
  //     type: customer?.type,
  //     group: customer?.group,
  //     warehouse: user?.warehouse,
  //     aamarId: user?.aamarId,
  //     status: customer?.status,
  //   };
  //   // console.log("newCustomer", newCustomer);
  //   setLoader(true);

  //   try {
  //     // console.log(data);
  //     const response = await Addcustomer(newCustomer);
  //     if (response) {
  //       // console.log(response);
  //       if (response?.error) {
  //         apiUniqueErrHandle(response);
  //       } else {
  //         reset({
  //           name: "",
  //           username: "",
  //           password: "",
  //           membership: "",
  //           address: "",
  //           holdingNo: "",
  //           sector: "",
  //           street: "",
  //           town: "",
  //           city: "",
  //           division: "",
  //           country: "",
  //           zipCode: "",
  //           phone: "",
  //           email: "",
  //           type: "",
  //           group: "",
  //           warehouse: user?.warehouse,
  //           aamarId: user?.aamarId,
  //           status: "active",
  //         });
  //         notify("Customer Create Successful!", "success");
  //         reset();

  //         // console.log(response?.data?.message);
  //         // return navigate("/customer");
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  const onSubmit = async (customer) => {
    console.log("customer", customer);
    let newCustomer = {};
    let email = customer?.email;
    let trimEmail = email.trim();
    if (trimEmail?.length > 0) {
      newCustomer = {
        name: customer?.name,
        password: customer?.password,
        email: customer?.email,
        phone: customer?.phone,
        username: customer?.username,
        warehouse: user?.warehouse,
        membership: customer?.membership,
        aamarId: user?.aamarId,

        address: {
          type: "Home",
          id: id,
          holdingNo: customer?.holdingNo,
          sector: customer?.sector,
          street: customer?.street,
          town: customer?.town,
          city: customer?.city,
          division: customer?.division,
          country: customer?.country,
          zipCode: customer?.zipCode,
        },
        point: customer?.point ? customer?.point : 0,
        type: customer?.type,
        status: customer?.status,
      };
      console.log("newCustomer", newCustomer);

    } else {
      newCustomer = {
        name: customer?.name,
        password: customer?.password,
        phone: customer?.phone,
        username: customer?.username,
        warehouse: user?.warehouse,
        membership: customer?.membership,
        aamarId: user?.aamarId,

        address: {
          type: "Home",
          id: id,
          holdingNo: customer?.holdingNo,
          sector: customer?.sector,
          street: customer?.street,
          town: customer?.town,
          city: customer?.city,
          division: customer?.division,
          country: customer?.country,
          zipCode: customer?.zipCode,
        },
        point: customer?.point ? customer?.point : 0,
        type: customer?.type,
        status: customer?.status,
      };
      console.log("newCustomer", newCustomer);

    }
    try {
      // console.log(data);
      const response = await Addcustomer(newCustomer);
      if (response) {
        console.log(response);
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          reset({
            name: "",
            username: "",
            password: "",
            // membership: "",
            // address: "",
            // holdingNo: "",
            // sector: "",
            // street: "",
            // town: "",
            // city: "",
            // division: "",
            // country: "",
            // zipCode: "",
            aamarId: user?.aamarId,

            phone: "",
            email: "",
            type: "",
            status: "active",
          });
          notify("Customer Create Successful!", "success");
          reset();
          console.log(response?.data?.message);
          return navigate("/customer");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteHandler = async (id) => {

    try {
      const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Customer?");
      if (confirmed) {
        const res = await deleteCustomer(id);
        if (res) {
          // TODO::
          // add error hendaler for delete error
          console.log(res);
        } else {
          console.log("Delete Operation Canceled by Customer!");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSelectGroup = (e) => {
    console.log("Selected Option:", e);

    // Safely handle the case when e is null
    if (e) {
      setGroup(e.value); // Update group with the selected value
      setValue("group", e.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setGroup(null); // Reset group if no option is selected
      setValue("group", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleReset = () => {
    reset({
      name: "",
      phone: "",
      address: "",
    });
  };

  // get totel product count
  const pageCountQuery = useCustomerCountQuery();
  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
  }, [pageCountQuery]);

  const handleDataLimit = (e) => {
    setSize(parseInt(e.target.value));
    setPageNo(getPageNumber);
    refetch();
  };

  // console.log(pageCount, size);
  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  };

  const handleSearch = (e) => {
    setQ(e.target.value);
    refetch();
  };

  const handlePageClick = (data) => {
    console.log(data);
    setPage(parseInt(data.selected));
    setPageNo(getPageNumber);
    refetch();
  };
  const handleCustomerExport = () => {
    setOnShowCustomer(true);
    console.log(onShowCustomer);
    console.log(customer);
  };

  const handleOnchangeWareHouse = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
    console.log("handle data:", e);
  };
  const lang = useSelector((state) => state.languageReducer);

  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.customer}></Header>
            <div className="row">
              <div className="d-md-flex  justify-content-between mt-4 align-item-center ">
                <div>
                  <form>
                    <div className=" mb-2 d-md-flex gap-2 ">
                      <div>
                        {user?.type === "admin" && (
                          <div
                            className="mt-2 mt-md-0 mb-2 mb-md-0 "
                            style={{
                              width:
                                window.innerWidth >= 1024
                                  ? 280
                                  : window.innerWidth >= 768
                                    ? 280
                                    : "100%", // Adjust width based on screen size
                            }}
                          >
                            {/* <b>Warehouse:</b> */}

                            <WareHouseDW
                              id="warehouse"
                              name="warehouse"
                              className=""
                              handleOnChange={handleOnchangeWareHouse}
                              MenuProps={{
                                container: document.body,
                                PaperProps: {},
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <select
                        className="form-select rounded"
                        onChange={(e) => handleDataLimit(e)}
                      >
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="200">200</option>
                        <option value="250">250</option>
                      </select>

                      {/* <input type="text" className="form-control" aria-label="Text input with dropdown button"> */}
                    </div>
                    <div>
                      {" "}
                      <input
                        className="form-control mb-2 rounded"
                        type="text"
                        placeholder="search"
                        onKeyUp={(e) => handleSearch(e)}
                      />
                    </div>
                  </form>
                </div>
                <div className="col-md-5 mt-md-2 mb-2">
                  <div className="float-end ">
                    {customer && customer.length > 0 ? (
                      <Button
                        className="btn  btn-dark  float-end "
                        onClick={() => handleCustomerExport()}
                      >
                        <Icons.DownloadOutline
                          className="icon-trash text-warning "
                          size={22}
                        />{" "}
                        {lang?.downloadCustomerDetails}
                      </Button>
                    ) : (
                      <button className="btn btn-dark" disabled>
                        Loading CSV...
                      </button>
                    )}
                  </div>
                  <div>
                    <Link
                      className="btn btn-dark mt-1 mt-md-0 mb-2 float-end me-2  "
                      to="/customer/importCustomer"
                    >
                      <Icons.PlusOutline size={22}></Icons.PlusOutline>{" "}
                      {lang?.importCustomer}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-7 ">
                <nav aria-label="Page navigation example">
                  <ReactPaginate
                    previousLabel={"<<"}
                    nextLabel={">>"}
                    breakLabel={"..."}
                    //dynamic page count
                    // page count total product / size
                    pageCount={Math.ceil(parseInt(pageCount) / parseInt(size))}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={6}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination pt-0 pb-2"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                  ></ReactPaginate>
                </nav>
                <div className="table-responsive-sm">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Warehouse</th>
                        {/* <th scope="col">Address</th> */}
                        <th scope="col">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {isLoading || isFetching ? (
                        Array(10)
                          .fill(0)
                          .map((_, index) => (
                            <tr key={index}>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton width={40} height={20} />
                              </td>
                            </tr>
                          ))
                      ) : data?.length > 0 ? (
                        data?.map((Customer) => (
                          <tr key={Customer._id}>
                            <th scope="row">{i++}</th>
                            <td>{Customer.name}</td>
                            <td>
                              {Customer.phone ? Customer.phone : "No Phone"}
                            </td>
                            <td>{Customer?.warehouse?.name}</td>
                            {/* <td>{Customer.address}</td> */}
                            <td>
                              <Link to={`/customer/update/${Customer._id}`}>
                                <Icons.PencilAltOutline
                                  className="icon-edit"
                                  size={20}
                                ></Icons.PencilAltOutline>
                              </Link>
                              <Icons.TrashOutline
                                className="icon-trash"
                                onClick={() => deleteHandler(Customer._id)}
                                size={20}
                              ></Icons.TrashOutline>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center"> No Customer Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Customer Creation Form */}
              <div className="col-md-5 mt-3 mt-md-0">
                <div className="card mt-2">
                  <div className="card-header">
                    <h5 className="card-title">
                      <Icons.UserAddOutline /> Create Customer
                    </h5>
                  </div>
                  <div className="card-body">
                    <CreateCustomerForm
                      onSubmit={onSubmit}
                      useForm={useForm}
                      handleSelectGroup={handleSelectGroup}
                      group={group}
                      isAdding={isAdding}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
      <CustomerExportModal
        onShow={onShowCustomer}
        handleClose={handleCloseCustomer}
        exportCustomer={customer}
      ></CustomerExportModal>
    </div>
  );
};

export default Customer;
