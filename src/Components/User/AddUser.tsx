import * as Icons from "heroicons-react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAddUserMutation, useUserCountQuery } from "../../services/userApi";
import WareHouseDWUser from "../Common/CustomSelect/WareHouseDWUser";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { apiUniqueErrHandle } from "../Utility/Utility";
import PackageModal from "../Common/Modal/PackageModal";

const AddUser = () => {
    const auth = signInUser();
    //@ts-ignore
    const { aamarId } = auth;
  let navigate = useNavigate();
  const [addUser] = useAddUserMutation();
  const [wh, setWh] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  // console.log("aamarId: ", auth);

  const { data:userData} = useUserCountQuery({aamarId});
  const { register, handleSubmit, reset } = useForm({});
  const handleAddUser = async (data: any) => {
    // console.log(data);
    //@ts-ignore
    const newData = { ...data, warehouse: wh, aamarId };
    // console.log("newData", newData);
    // notify(`${data}`, "error")
    if (wh === "") {
      notify("Please Select a Warehouse", "error");
    } else {
      const response: any = await addUser(newData);

      if (response) {
        console.log(response);
        if (response.error) {
          // console.log(apiUniqueErrHandle(response))
          apiUniqueErrHandle(response);
          //  === false ?
          // notify(`Create Customer as ${response.error.data.error.keyValue.email}`, "error")
          // : console.log(response)
          //  notify(`Add User Failed!", " ${response.error.data.error.keyValue} " is not unique`, "error"):notify(`Add User ${data.name} as ${data.type} Successful!`, "error");

          console.log(response);
        } else {
          reset({
            name: "",
            email: "",
            username: "",
            phone: "",
            password: "",
            aamarId: "",
            status: "active",
            type: "POS",
          });
          // notify(`${response.data.message}`, "success")
          console.log(response.data.message);
          return navigate("/user");
        }
      }
    }
   
  };
  const handleOnchangeWareHouse = (e: any) => {
    console.log(e);
    setWh(e.option);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title="Create New User"></Header>
            <div className="row mt-4">
              <div className="col-md-6 offset-md-3">
                <div className="sticky-top">
                  <Form onSubmit={handleSubmit(handleAddUser)}>
                    <Form.Group className="mb-3" controlId="Name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        {...register("name", { required: true })}
                        type="text"
                        name="name"
                        placeholder="Name"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="UserName">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        {...register("username", { required: true })}
                        type="text"
                        name="username"
                        placeholder="User Name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="Email">
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
                            <option value="asst_manager">Asst. Manager</option>
                            <option value="store_manager">Stor Manager</option>
                            <option value="POS">POS</option>
                            <option value="ecom">Ecom Manager</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="deliver">Delivery Man</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicStatus"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Select {...register("status")}>
                            <option value="active">Active</option>
                            <option value="suspend">Suspend</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </div>
                    <Link
                      to="/user"
                      className="btn btn-outline-dark me-2 float-center"
                    >
                      <Icons.X size={20}></Icons.X> Cancel
                    </Link>

                    <Button
                      variant="dark"
                      className="float-center"
                      type="submit"
                    >
                      <Icons.PlusOutline size={20}></Icons.PlusOutline> Add User
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AddUser;
