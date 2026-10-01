// import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import "./Unit.css";
import * as Icons from "heroicons-react";
import { useForm } from "react-hook-form";
// import toast, { Toaster } from "react-hot-toast";
import SideBar from "../Common/SideBar/SideBar";
// import { notify } from "../Utility/Notify";
import { Link } from "react-router-dom";
import {
  useUnitsQuery,
  useAddUnitMutation,
  useDeleteUnitMutation,
} from "../../services/unitApi";
import { useNavigate } from "react-router-dom";
import { apiUniqueErrHandle } from "../Utility/Utility";
import AlertService from "../Utility/AlertService";

const Unit = () => {
  const { register, handleSubmit, reset } = useForm({});
  const [AddUnit] = useAddUnitMutation();
  const { data } = useUnitsQuery();
  const [deleteUnit] = useDeleteUnitMutation();
  let navigate = useNavigate();
  let i = 1;
  const onSubmit = async (data) => {
    const response = await AddUnit(data);
    if (response) {
      console.log(response);
      if (response?.error) {
        apiUniqueErrHandle(response);
      } else {
        reset({
          name: "",
          symbpl: "",
          status: "",
        });
        console.log(response?.data?.message);
        return navigate("/unit");
      }
    }
  };

  const deleteHandler = async (id) => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Unit?");
    if (confirmed) {
      const res = await deleteUnit(id);
      if (res) {
        // TODO::
        // add error hendaler for delete error
        console.log(res);
      } else {
        console.log("Delete Operation Canceled by Unit!");
        return;
      }
    }
  };

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
            <Header title="Unit"></Header>
            <div className="row">
              <div className="col-md-4 ">
                <div className="sticky-md-top ">
                  <div className="card mt-2">
                    <div className="card-header">
                      <h5 className="card-title">
                        {data?._id ? "Update" : "Add"} Unit
                      </h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mb-3">
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputCustomer">Unit Name</label>
                            <input
                              {...register("name", { required: true })}
                              type="text"
                              className="form-control"
                              id="inputCustomer"
                              aria-describedby="emailHelp"
                              placeholder="Unit Name"
                            />
                            <small
                              id="emailHelp"
                              className="form-text text-muted"
                            >
                              We'll never share your email with anyone else.
                            </small>
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputMC"> symbol</label>
                            <input
                              {...register("symbol")}
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="Unit Phone"
                            />
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="MCId">status</label>
                            <select
                              {...register("status")}
                              className="form-control"
                              id="address"
                              placeholder="Address"
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
                          {data?._id ? (
                            <>
                              <Icons.SaveOutline></Icons.SaveOutline>
                            </>
                          ) : (
                            <>
                              <Icons.Plus> </Icons.Plus>
                            </>
                          )}
                          Unit
                        </button>
                      </form>
                    </div>
                  </div>
                  {/* <CsvImporter setCsvData={setCsvData} handleImportButton={handleImportButton} title="Customer"></CsvImporter> */}
                </div>
              </div>
              <div className="col-md-8">
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
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Unit Name</th>
                      <th scope="col">symbol</th>
                      <th scope="col">status</th>
                      <th scope="col">ActionBtn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? (
                      data.map((Unit) => (
                        <tr key={Unit._id}>
                          <th scope="row">{i++}</th>
                          <td>{Unit.name}</td>
                          <td>{Unit.symbol}</td>
                          <td>{Unit.status}</td>
                          <td>
                            <Link to={`/unit/update/${Unit._id}`}>
                              <Icons.PencilAltOutline
                                className="icon-edit"
                                size={20}
                              ></Icons.PencilAltOutline>
                            </Link>

                            <Icons.TrashOutline
                              className="icon-trash"
                              onClick={() => deleteHandler(Unit._id)}
                              size={20}
                            ></Icons.TrashOutline>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>1</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Toaster position="bottom-right" /> */}
    </div>
  );
};

export default Unit;
