import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import { notify } from "../Utility/Notify";
import {
  useUnitsQuery,
  useUnitQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} from "../../services/unitApi";
import SelectMC from "../Common/CustomSelect/selectMC";
import SelectCategoryGroup from "../Common/CustomSelect/selectCategoryGroup";

const UpdateWarehouse = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const { data, error, isLoading, isFetching, isSuccess } = useUnitQuery(
    `${id}`
  );

  const { register, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (data) {
      reset({
        _id: data._id,
        name: data.name,
        symbol: data.symbol,
        status: data.status,
      });
    }
  }, [data]);

  // console.log(data);

  // handel user update
  const [updateUnit] = useUpdateUnitMutation();

  const updateHandler = async (data) => {
    const response = await updateUnit(data);
    // console.log(data)
    if (response) {
      console.log(response);
      notify("User Update Successful!");
      navigate("/unit");
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={`Update Unit: ${data?.name}`}></Header>
            <div className="row  mt-5 pt-3">
              <div className="col-md-6 offset-md-3">
                <Form onSubmit={handleSubmit(updateHandler)}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Unit Name</Form.Label>
                    <Form.Control
                      className="form-control"
                      placeholder="Write a address..."
                      {...register("name", { required: true })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>symbol</Form.Label>
                    <Form.Control
                      {...register("symbol", { required: true })}
                      type="text"
                      name="symbol"
                      placeholder="Symbol"
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
                    to="/unit"
                    className="btn btn-outline-dark me-2 float-center"
                  >
                    <Icons.X size={20}></Icons.X> Cancel
                  </Link>

                  <Button variant="dark" className="float-center" type="submit">
                    <Icons.UploadOutline size={20}></Icons.UploadOutline> Update
                    Unit
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
