import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import { notify } from "../Utility/Notify";
import {
  // useBrandsQuery,
  useBrandQuery,
  // useAddBrandMutation,
  useUpdateBrandMutation,
} from "../../services/brandApi";
// import SelectMC from "../Common/CustomSelect/selectMC";
// import SelectCategoryGroup from "../Common/CustomSelect/selectCategoryGroup";

const UpdateBrand = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const { data, error, isLoading, isFetching, isSuccess } = useBrandQuery(
    `${id}`
  );

  const { register, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (data) {
      reset({
        _id: data._id,
        name: data.name,
        code: data.code,
        details: data.details,
        status: data.status,
      });
    }
  }, [data]);

  // console.log(data);

  // handel user update
  const [updateBrand] = useUpdateBrandMutation();

  const updateHandler = async (data) => {
    if (data.password === "") {
      delete data.password;
    }
    const response = await updateBrand(data);
    // console.log(data)
    if (response) {
      // console.log(response);
      notify("User Update Successful!");
      navigate("/brand");
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
            <Header title={`Update Brand: ${data?.name}`}></Header>
            <div className="row  mt-5 pt-3">
              <div className="col-md-6 offset-md-3">
                <Form onSubmit={handleSubmit(updateHandler)}>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Brand Name</Form.Label>
                    <Form.Control
                      {...register("name", { required: true })}
                      type="text"
                      placeholder="Brand Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Brand Code</Form.Label>
                    <Form.Control
                      {...register("code", { required: true })}
                      type="text"
                      placeholder="Brand Code"
                    />
                  </Form.Group>

                  {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      {...register("company")}
                      type="text"
                      placeholder="company Name"
                    />
                  </Form.Group> */}
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Details</Form.Label>
                    <Form.Control
                      {...register("details")}
                      type="text"
                      placeholder="Details "
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select {...register("status")}>
                      <option value="active">Active</option>
                      <option value="inactive">inactive</option>
                    </Form.Select>
                  </Form.Group>

                  <Link
                    to="/brand"
                    className="btn btn-outline-dark me-2 float-center"
                  >
                    <Icons.X size={20}></Icons.X> Cancel
                  </Link>

                  <Button variant="dark" className="float-center" type="submit">
                    <Icons.UploadOutline size={20}></Icons.UploadOutline> Update
                    Brand
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

export default UpdateBrand;
