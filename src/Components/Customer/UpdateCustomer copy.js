import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import { notify } from "../Utility/Notify";
import {
  useCustomersQuery,
  useCustomerQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "../../services/customerApi";
import SelectMC from "../Common/CustomSelect/selectMC";
import SelectCategoryGroup from "../Common/CustomSelect/selectCategoryGroup";

const UpdateCustomer = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const { data, error, isLoading, isFetching, isSuccess } = useCustomerQuery(
    `${id}`
  );

  const { register, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (data) {
      reset({
        _id: data._id,
        name: data.name,
        username: data.username,
        // password: data.password,
        membership: data.membership,
        address: data.address,
        phone: data.phone,
        email: data.email,
        type: data.type,
        status: data.status,
        // code: data.code,
      });
    }
  }, [data]);

  // console.log(data);

  // handel user update
  const [UpdateCustomer] = useUpdateCustomerMutation();

  const updateHandler = async (data) => {
    console.log(data)
    // const response = await UpdateCustomer(data);
    // // console.log(data)
    // if (response) {
    //   console.log(response);
    //   notify("Customer Update Successful!", "success");
    //   navigate("/customer");
    // }
  };

  console.log(data);
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={`Update User: ${data?.name}`}></Header>
            <div className="row  mt-5 pt-3 pb-5">
              <div className="col-md-6 offset-md-3">
                <Form onSubmit={handleSubmit(updateHandler)}>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label> Name</Form.Label>
                    <Form.Control
                      {...register("name", { required: true })}
                      type="text"
                      placeholder="Customer Name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label> Username</Form.Label>
                    <Form.Control
                      {...register("username", { required: true })}
                      type="text"
                      placeholder="Customer username"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label> Membership</Form.Label>
                    {/* <Form.Control
                      {...register("membership", { required: true })}
                      type="text"
                      placeholder="Customer membership"
                    /> */}
                    <select
                      {...register("membership")}
                      className="form-select"
                      id="status"
                    >
                      <option value="gold" selected>
                        Gold
                      </option>
                      <option value="diamond">Diamond</option>
                      <option value="premium">Premium</option>
                    </select>
                  </Form.Group>
                  {/* <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label> password</Form.Label>
                    <Form.Control
                      {...register("password", { required: true })}
                      type="password"
                      placeholder="Customer password"
                    />
                  </Form.Group> */}

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label> Address</Form.Label>
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
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                      {...register("phone")}
                      type="text"
                      name="phone"
                      placeholder="phone"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      {...register("email")}
                      type="text"
                      name="email"
                      placeholder="email"
                    />
                  </Form.Group>
                  <div className="form-group col-12  mb-3">
                    <label htmlFor="inputMC">Type</label>
                    <select
                      {...register("type")}
                      className="form-select"
                      id="status"
                    >
                      <option value="regular" selected>
                        Regular
                      </option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>

                  <Form.Group className="mb-3" controlId="formBasicStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select {...register("status")}>
                      <option value="active">Active</option>
                      <option value="inactive">inactive</option>
                    </Form.Select>
                  </Form.Group>

                  <Link
                    to="/customer"
                    className="btn btn-outline-dark me-2 float-center"
                  >
                    <Icons.X size={20}></Icons.X> Cancel
                  </Link>

                  <Button variant="dark" className="float-center" type="submit">
                    <Icons.PlusOutline size={20}></Icons.PlusOutline> Update
                    Customer
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

export default UpdateCustomer;
