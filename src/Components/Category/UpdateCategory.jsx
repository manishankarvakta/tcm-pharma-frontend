/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Icons from "heroicons-react";
import Header from "../Common/Header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import { useForm } from "react-hook-form";
import { notify } from "../Utility/Notify";
import {
  useCategoryQuery,
  useUpdateCategoryMutation,
  // useUploadCategoryPhotoMutation,
} from "../../services/categoryApi";
import SelectMC from "../Common/CustomSelect/selectMC";
import SelectCategoryGroup from "../Common/CustomSelect/selectCategoryGroup";
import productPhoto from "../../product.jpg";
import axios from "../../services/apiClient";

const UpdateCategory = () => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001";

  const { id } = useParams();
  let navigate = useNavigate();

  // console.log(`${id}`);
  const [mc, setMc] = useState({});
  const [mg, setMg] = useState({});
  const [fileName, setFileName] = useState("Upload Category Photo");
  const [file, setFile] = useState({});
  const [uploadFile, setUploadedFile] = useState({});
  // const [uploadPercentage, setUploadPercentage] = useState(0);
  // const [message, setMessage] = useState("");

  const cat = useCategoryQuery(`${id}`);

  const { register, handleSubmit, reset } = useForm({});

  useEffect(() => {
    // console.log("data",cat.data)
    if (cat?.data) {
      reset({
        _id: cat?.data?._id,
        name: cat?.data.name,
        mc: cat?.data?.mc ? cat?.data.mc : "",
        mcId: Number(cat?.data.mcId),
        group: cat?.data.group,
        description: cat?.data.description,
        code: cat?.data.code,
        status: cat?.data.status,
      });
      setMg(cat?.data.group);
      setMc(cat?.data?.mc ? cat?.data.mc : "");

      setUploadedFile({
        fileName: cat?.data?.name,
        filePath: cat?.data?.photo ? cat?.data?.photo : productPhoto,
      });
    }
  }, [cat?.isSuccess]);

  // console.log(cat.data)

  // handel user update
  const [updateCategory] = useUpdateCategoryMutation();
  // const [photoUpload] = useUploadCategoryPhotoMutation();

  const updateHandler = async (data) => {
    // console.log(data)
    let category = { ...data, _id: cat.data._id };
    // console.log('submitted', category)
    const response = await updateCategory(category);
    // console.log(data)
    if (response) {
      // console.log(response)
      notify("User Update Successful!", "success");
      navigate("/category");
    }
  };

  const handleOnchange = (e) => {
    // console.log(e.label.split(' - '))
    setMc(e.option);
    // console.log(e.option);
    let mCat = e.label.split(" - ");
    reset({
      mc: e.option,
      mcId: mCat[1],
    });
  };

  const handleOnchangeGroup = (e) => {
    // console.log(e.option);
    setMg(e.option);
    reset({
      group: e.option,
    });
  };

  const handleCategoryPhoto = async (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const handleCategoryPhotoUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    // console.log(file);
    try {
      const res = await axios.post(
        `${BASE_URL}/category/upload/${id}`,
        formData,
        {
          "Content-type": "multipart/form-data",
        }
      );

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
    } catch (err) {
      if (err.response.status === 500) {
        console.log(
          "There was an problem with the server",
          err.response.data.message
        );
      } else {
        console.log(err.response.data.message);
      }
    }
  };

  //   console.log(uploadFile);
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={`Update Category: ${cat?.data?.name}`}></Header>
            <div className="row  mt-5 pt-3">
              <div className="col-md-6 offset-md-1">
                <Form onSubmit={handleSubmit(updateHandler)}>
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
                      handleOnchange={(e) => handleOnchange(e)}
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
                          type="number"
                          placeholder="Master Category ID"
                        />
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
                    <Icons.SaveOutline size={20}></Icons.SaveOutline> Update
                    Category
                  </Button>
                </Form>
              </div>
              <div className="col-md-4">
                <Form onSubmit={(e) => handleCategoryPhotoUpload(e)}>
                  <div className="card">
                    <img
                      className="card-img-top"
                      // {data?.photo !== null ?}
                      src={
                        cat?.data?.photo
                          ? `${PHOTO_BASE_URL}${uploadFile.filePath}`
                          : productPhoto
                      }
                      alt="Card image cap"
                    />
                    <div className="card-body">
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="text-wrap w-100">
                          {cat?.data?.name}
                        </Form.Label>
                        <Form.Control
                          name="c_photo"
                          type="file"
                          onChange={(e) => handleCategoryPhoto(e)}
                        />
                      </Form.Group>
                    </div>
                    <div className="card-footer">
                      <div className="d-grid gap-2">
                        <Button type="submit" variant="dark" size="lg">
                          <Icons.UploadOutline size={20}></Icons.UploadOutline>{" "}
                          Save Photo{" "}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
