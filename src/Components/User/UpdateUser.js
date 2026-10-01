import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import { notify } from "../Utility/Notify";
import { useUserQuery, useUpdateUserMutation } from "../../services/userApi";
import WareHouseDWUser from "../Common/CustomSelect/WareHouseDWUser";
import { useSelector } from "react-redux";

const UpdateUser = () => {
  const { id } = useParams();
  const lang = useSelector((state) => state.languageReducer);

  const { data, error, isLoading, isFetching, isSuccess } = useUserQuery(
    `${id}`
  );
  const [wh, setWh] = useState("")
  let navigate = useNavigate();
  // const [user, setUser] = useState({});
  const [preLoadValue, setPreLoadValue] = useState({
    _id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    status: "",
    type: "",
  });
  const { register, handleSubmit, reset } = useForm({
    defaultValues: preLoadValue,
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      reset({
        _id: data?._id,
        name: data?.name,
        username: data?.username,
        phone: data?.phone,
        email: data?.email,
        password: "",
        status: data?.status,
        type: data?.type,
      });
      setWh(data?.warehouse)
    }
  }, [data]);

  // handel user update
  const [updateUser] = useUpdateUserMutation();

  const updateHandler = async (data) => {
    console.log(data);
    const newData = { ...data, warehouse: wh }
    if (newData.password === "") {
      delete newData.password;
    }
    if (wh === "") {
      notify("Please Select a warehouse")
    } else {

      const response = await updateUser(newData);
      // console.log(data)
      if (response) {
        console.log(response);
        notify("User Update Successful!");
        navigate("/user");
      }
    }

  };

  const handleOnchangeWareHouse = (e) => {
    console.log(e)
    setWh(e.option)
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={`${lang?.updateUser}: ${data?.name}`}></Header>
            <div className="row  mt-5 pt-3">
              <div className="col-md-6 offset-md-3">
                <Form onSubmit={handleSubmit(updateHandler)}>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      {...register("name", { required: true })}
                      type="text"
                      name="name"
                      placeholder="Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      {...register("username", { required: true })}
                      type="text"
                      name="username"
                      placeholder="User Name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      {...register("email", { required: true })}
                      type="email"
                      name="email"
                      placeholder="Enter email"
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      {...register("phone")}
                      type="text"
                      name="phone"
                      placeholder="Phone"
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      {...register("password")}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Warehouse</Form.Label>
                    <WareHouseDWUser
                      // {...setValue("warehouse", `${wh}`)}
                      // id="warehouse1"
                      name="warehouse"
                      handleOnChange={handleOnchangeWareHouse}
                      warehouse={wh !== "" ? wh : 0}
                    // {...register("warehouse")}
                    />
                  </Form.Group>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formBasicType">
                        <Form.Label>User Type</Form.Label>
                        <Form.Select {...register("type")}>
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                          <option value="manager">Manager</option>
                          <option value="asst-manager">Asst. Manager</option>
                          <option value="store-manager">Stor Manager</option>
                          <option value="POS">POS</option>
                          <option value="ecom">Ecom Manager</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="deliver">Delivery Man</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select {...register("status")}>
                          <option value="active">Active</option>
                          <option value="suspend">Suspend</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>

                  <Button variant="dark" className="float-center" type="submit">
                    <Icons.PlusOutline size={20}></Icons.PlusOutline> Update
                    User
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

export default UpdateUser;
