import React, { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import * as Icons from "heroicons-react";
import { Link, useNavigate } from "react-router-dom";
import { useAddCategoryMutation } from "../../services/categoryApi";
import { apiUniqueErrHandle } from "../Utility/Utility";
import SelectMC from "../Common/CustomSelect/selectMC";
import SelectCategoryGroup from "../Common/CustomSelect/selectCategoryGroup";
import LoadingModal from "../Common/Modal/LoadingModal";

const AddCategory = () => {
  let navigate = useNavigate();
  const [addCategory] = useAddCategoryMutation();

  const [mc, setMc] = useState({});
  const [mcNew, setMcNew] = useState("");
  const [mg, setMg] = useState({});

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  const { register, handleSubmit, reset } = useForm({});

  const handleAddCategory = async (data: any) => {
    // setLoader(true)
    const newData = { ...data, mc: mcNew };
    // console.log("mcData", newData)
    // console.log(data)
    // console.log(mcNew)
    try {
      const response: any = await addCategory(newData);
      if (response) {
        // console.log(response)
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          reset({
            name: "",
            code: "",
            mc: "",
            mcId: "",
            photo: "",
            group: "",
            description: "",
            status: "active",
          });
          // console.log(response?.data?.message)
          return navigate("/category");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handleOnchange = (e: any) => {
    // console.log(e.label.split(' - '))
    setMc(e.option);
    setMcNew(e.option);
    // console.log(e.option)
    let mCat = e.label.split(" - ");
    reset({
      mc: e.option,
      mcId: mCat[1],
    });
  };

  const handleOnchangeGroup = (e: any) => {
    // console.log(e.option)
    setMg(e.option);
    reset({
      group: e.option,
    });
  };
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
            <Header title="Create New Category"></Header>
            <div className="row mt-4">
              <div className="col-md-6 offset-md-3">
                <Form onSubmit={handleSubmit(handleAddCategory)}>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      {...register("name", { required: true })}
                      type="text"
                      placeholder="Category Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Master Category</Form.Label>
                    {/* <Form.Control {...register("mc", { required: true })} type="text" placeholder="Enter email" /> */}
                    <SelectMC
                      mc={mc}
                      handleOnchange={(e: any) => handleOnchange(e)}
                    ></SelectMC>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Category Description</Form.Label>
                    <textarea
                      className="form-control"
                      placeholder="Write a description..."
                      {...register("description", {
                        required: true,
                        maxLength: 1000,
                      })}
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label>Group</Form.Label>
                    <SelectCategoryGroup
                      mg={mg}
                      handleOnchange={handleOnchangeGroup}
                    ></SelectCategoryGroup>
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      {...register("code")}
                      type="text"
                      name="code"
                      placeholder="code"
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formBasicType">
                        <Form.Label>Master Category ID</Form.Label>
                        <Form.Control
                          {...register("mcId", { required: true })}
                          type="text"
                          placeholder="Master Category ID"
                        />
                        {/* <Form.Select {...register("type")} >
                                                    <option value="admin">Admin</option>
                                                    <option value="owner">Owner</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="asst_manager">Asst. Manager</option>
                                                    <option value="stor_manager">Stor Manager</option>
                                                    <option value="POS">POS</option>
                                                    <option value="deliver">Delivery Man</option>
                                                </Form.Select> */}
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
                  <Link
                    to="/category"
                    className="btn btn-outline-dark me-2 float-center"
                  >
                    <Icons.X size={20}></Icons.X> Cancel
                  </Link>

                  <Button variant="dark" className="float-center" type="submit">
                    <Icons.PlusOutline size={20}></Icons.PlusOutline> Add
                    Category
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

export default AddCategory;
