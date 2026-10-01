import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import { notify } from "../Utility/Notify";
import {
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useWarehousesQuery,
  useWarehouseQuery,
  useAddWarehouseMutation,
} from "../../services/warehouseApi";
import SelectMC from "../Common/CustomSelect/selectMC";
import SelectCategoryGroup from "../Common/CustomSelect/selectCategoryGroup";
import { useSelector } from "react-redux";

const UpdateWarehouse = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const { data, error, isLoading, isFetching, isSuccess } = useWarehouseQuery(
    `${id}`
  );
    const lang = useSelector((state) => state.languageReducer);
  

  const { register, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (data) {
      reset({
        _id: data._id,
        name: data.name,
        address: data.address,
        company: data.company,
        phone: data.phone,
        type: data.type,
        code: data.code,
        status: data.status,
      });
    }
  }, [data]);

  console.log(data);

  // handel user update
  const [updateWarehous] = useUpdateWarehouseMutation();

  const updateHandler = async (data) => {
    const response = await updateWarehous(data);
    // console.log(data)
    if (response) {
      console.log(response);
      notify("User Update Successful!");
      navigate("/warehouse");
    }
  };

  // const handleOnchange = (e) => {
  //   console.log(e.label.split(' - '))
  //   setMc(e.option);
  //   console.log(e.option);
  //   let mCat = e.label.split(" - ");
  //   reset({
  //     mc: e.option,
  //     mcId: mCat[1],
  //   });
  // };

  // const handleOnchangeGroup = (e) => {
  //   // console.log(e)
  //   setMg(e.option);
  //   reset({
  //     group: e.option,
  //   });
  // };
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={`${lang?.updateWarehouse}: ${data?.name}`}></Header>
            <div className="row  mt-5 pt-3">
              <div className="col-md-6 offset-md-3">
                <Form onSubmit={handleSubmit(updateHandler)}>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>
                      {data?.type === "Warehouse" ? "Warehouse" : "Outlet"} Name
                    </Form.Label>
                    <Form.Control
                      {...register("name", { required: true })}
                      type="text"
                      placeholder="warehouse Name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>
                      {data?.type === "Warehouse" ? "Warehouse" : "Outlet"}{" "}
                      Address
                    </Form.Label>
                    <textarea
                      className="form-control"
                      placeholder="Write a address..."
                      {...register("address", {
                        required: true,
                        maxLength: 1000,
                      })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Company</Form.Label>
                    <Form.Control
                      {...register("company")}
                      type="text"
                      name="company"
                      placeholder="Company"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      {...register("code")}
                      type="text"
                      name="code"
                      placeholder="code"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>
                      {data?.type === "Warehouse" ? "Warehouse" : "Outlet"}{" "}
                      Phone number
                    </Form.Label>
                    <Form.Control
                      {...register("phone")}
                      type="text"
                      name="phone"
                      placeholder="phone"
                    />
                  </Form.Group>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select {...register("status")}>
                          <option value="active">Active</option>
                          <option value="inactive">inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <Link
                    to="/warehouse"
                    className="btn btn-outline-dark me-2 float-center"
                  >
                    <Icons.X size={20}></Icons.X> Cancel
                  </Link>

                  <Button variant="dark" className="float-center" type="submit">
                    <Icons.UploadOutline size={20}></Icons.UploadOutline> Update
                    Warehouse
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateWarehouse;
