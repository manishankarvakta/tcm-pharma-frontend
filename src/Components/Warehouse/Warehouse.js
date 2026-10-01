import * as Icons from "heroicons-react";
import { useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  useAddWarehouseMutation,
  useDeleteWarehouseMutation,
  useWarehouseCountQuery,
  useWarehousesQuery,
} from "../../services/warehouseApi";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import AlertService from "../Utility/AlertService";
import { apiUniqueErrHandle } from "../Utility/Utility";
import { useSelector } from "react-redux";
import PackageModal from "../Common/Modal/PackageModal";

const Warehouse = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  const { register, handleSubmit, reset } = useForm({});
  const [AddWarehouse] = useAddWarehouseMutation();
  const [deleteWarehouse] = useDeleteWarehouseMutation();
  const { data } = useWarehousesQuery({ aamarId });
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const lang = useSelector((state) => state.languageReducer);

  const { data: countData } = useWarehouseCountQuery({ aamarId });
  let navigate = useNavigate();
  let i = 1;
  // console.log("countData",countData); 
  // console.log('package data',auth?.package?.warehouseLimited)
  const onSubmit = async (data) => {
    const response = await AddWarehouse(data);
    if (response) {
      console.log(response);
      if (response?.error) {
        apiUniqueErrHandle(response);
      } else {
        reset({
          name: "",
          code: "",
          address: "",

          company: "",
          phone: "",
          type: "",
          status: "",
        });
        notify("Warehouse Create Successful!", "success");

        console.log(response?.data?.message);
        return navigate("/warehouse");
      }
    }
  };

  const deleteHandler = async (id) => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Warehouse?");
    if (confirmed) {
      const res = await deleteWarehouse(id);
      if (res) {
        // TODO::
        // add error hendaler for delete error
        console.log(res);
      } else {
        console.log("Delete Operation Canceled by Warehouse!");
        return;
      }
    }
  };

  // // const [preLoadValue, setPreLoadValue] = useState({
  // //   _id: "",
  // //   name: "",
  // //   phone: "",
  // //   address: "",
  // // });
  // // let i = 1;
  // const [customers, setCustomers] = useState([]);
  // // const [customer, setCustomer] = useState([]);
  // const [pageCount, setPageCount] = useState(0);
  // const [page, setPage] = useState(0);
  // const [size, setSize] = useState(25);
  // // import data

  // // useEffect(() => {
  // //   fetch(`${process.env.REACT_APP_API_URL}warehouse?page=${page}&size=${size}`)
  // //     .then((res) => res.json())
  // //     .then((data) => setCustomers(data));
  // }, [page, size]);

  const handleReset = () => {
    reset({
      name: "",
      phone: "",
      address: "",
    });
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.warehouse}></Header>
            <div className="row">
              <div className="col-md-4 ">
                <div className="sticky-md-top ">
                  <div className="card mt-3">
                    <div className="card-header">
                      <h5 className="card-title">{lang?.createWarehouse}</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mb-3">
                          <div className="form-group col-12  mb-3">
                            <input
                              type="hidden"
                              {...register("aamarId", { value: aamarId })}
                            />
                            <label htmlFor="inputCustomer">
                              Warehouse Name
                            </label>
                            <input
                              {...register("name", { required: true })}
                              type="text"
                              className="form-control"
                              id="inputCustomer"
                              aria-describedby="emailHelp"
                              placeholder="Warehouse Name"
                            />
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputMC">Warehouse Phone</label>
                            <input
                              {...register("phone")}
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="Warehouse Phone"
                            />
                          </div>
                          {/* <div className="form-group col-12  mb-3">
                            <label htmlFor="MCId">Company</label>
                            <input
                              {...register("comapny")}
                              className="form-control"
                              id="comapny"
                              placeholder="comapny"
                              type="text"
                            />
                          </div> */}
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="MCId">Code</label>
                            <input
                              {...register("code")}
                              className="form-control"
                              id="code"
                              placeholder="code"
                              type="text"
                            />
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="address">Address</label>
                            <textarea
                              {...register("address")}
                              className="form-control"
                              id="address"
                              placeholder="Address"
                            />
                          </div>

                          <div className="form-group col-12  mb-3">
                            <label htmlFor="type">Type</label>
                            <select
                              {...register("type")}
                              className="form-select"
                            >
                              <option value="Outlet">Outlet</option>
                              <option value="Warehouse">Warehouse</option>
                            </select>
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="status">Status</label>
                            <select
                              {...register("status")}
                              className="form-select"
                              id="address"
                            >
                              <option value="active">active</option>
                              <option value="inactive">inactive</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="reset"
                          onClick={handleReset}
                          className="btn btn-outline-dark col-4 col-md-4"
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-dark col-8 col-md-8"
                        >
                          <Icons.Plus> </Icons.Plus>
                          Warehouse
                        </button>
                      </form>
                    </div>
                  </div>
                  {/* <CsvImporter setCsvData={setCsvData} handleImportButton={handleImportButton} title="Customer"></CsvImporter> */}
                </div>
              </div>
              <div className="col-md-8 pt-3">
                {/* <nav aria-label="Customer Pagination" className="">
                  <ul className="pagination pagination-md">
                    <li className="page-item">
                      <select
                        className="form-control"
                        onChange={(e) => setSize(e.target.value)}
                      >
                        <option
                          value="50"
                          selected={size === 25 ? "selected" : ""}
                        >
                          25
                        </option>
                        <option
                          value="50"
                          selected={size === 50 ? "selected" : ""}
                        >
                          50
                        </option>
                        <option
                          value="100"
                          selected={size === 75 ? "selected" : ""}
                        >
                          75
                        </option>
                        <option
                          value="150"
                          selected={size === 150 ? "selected" : ""}
                        >
                          100
                        </option>
                      </select>
                    </li>
                    {[...Array(pageCount).keys()].map((number) => (
                      <li
                        className={
                          page === number ? "page-item disabled" : "page-item"
                        }
                        key={number}
                      >
                        <button
                          onClick={() => setPage(number)}
                          className="page-link"
                          tabIndex={page === number ? "-1" : ""}
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav> */}
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Warehouse</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Type</th>
                        <th scope="col">Address</th>
                        <th scope="col">ActionBtn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data ? (
                        data.map((Warehouse) => (
                          <tr key={Warehouse._id}>
                            <th scope="row">{i++}</th>
                            <td>{Warehouse.name}</td>
                            <td>
                              {Warehouse.phone ? Warehouse.phone : "No Phone"}
                            </td>
                            <td>{Warehouse.type}</td>
                            <td>{Warehouse.address}</td>
                            <td>
                              <Link to={`/warehouse/update/${Warehouse._id}`}>
                                <Icons.PencilAltOutline
                                  className="icon-edit"
                                  size={20}
                                ></Icons.PencilAltOutline>
                              </Link>

                              <Icons.TrashOutline
                                className="icon-trash"
                                onClick={() => deleteHandler(Warehouse._id)}
                                size={20}
                              ></Icons.TrashOutline>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <p className="text-center mt-5 mb-5">
                              {" "}
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                              <br />
                              <small>Loading...</small>
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
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Warehouse;
