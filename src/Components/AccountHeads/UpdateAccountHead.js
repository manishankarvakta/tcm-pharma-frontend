import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import Header from "../Common/Header/Header";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as Icons from "heroicons-react";
import SelectAChead from "../Common/CustomSelect/SelectAChead";
import {
  useAccountheadQuery,
  useUpdateAccountHeadMutation,
} from "../../services/accountHeadApi";
import { notify } from "../Utility/Notify";
import LoadingModal from "../Common/Modal/LoadingModal";
import { useSelector } from "react-redux";

const UpdateAccountHead = () => {
  const { id } = useParams();
  // console.log(id)
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);
  const acHead = useAccountheadQuery(`${id}`);
    const lang = useSelector((state) => state.languageReducer);
  
  const [updateAccountHead] = useUpdateAccountHeadMutation();

  // console.log('acHead', acHead)
  const { register, handleSubmit, reset } = useForm({});
  const [mc, setMc] = useState("");

  useEffect(() => {
    // console.log("data",acHead.data)
    if (acHead?.data) {
      reset({
        _id: acHead?.data?._id,
        name: acHead?.data.name,
        maId: acHead?.data?.maId ? acHead?.data?.maId?._id : "",
        description: acHead?.data.description,
        code: acHead?.data.code,
        status: acHead?.data.status,
      });
      setMc(acHead?.data?.maId ? acHead?.data.maId?._id : "");
    }
  }, [acHead?.isSuccess]);

  const handleUpdateAccountHead = async (data) => {
    // console.log("data", data)
    // console.log(data)
    let newData = {};
    if (mc === "") {
      newData = { ...data };
      delete newData.maId;
    } else {
      newData = { ...data, maId: mc };
    }
    // console.log(newData);
    setLoader(true);
    await updateAccountHead(newData)
      .then((res) => {
        // console.log(res);
        notify("AccountHead updated Successfully", "success");
        navigate("/accountheads");
      })
      .catch((err) => {
        console.log(err);
        notify("Server Side Error", "error");
      })
      .finally(setLoader(false));
  };
  const handleOnchange = (e) => {
    // console.log(e);
    setMc(e.option);
  };
  return (
    <div>
      <LoadingModal
        title={"Please Wait"}
        onShow={loader}
        handleClose={handleLoaderClose}
      ></LoadingModal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.updateAccountHead}></Header>
            <div className="col-md-6 offset-md-3">
              <Form onSubmit={handleSubmit(handleUpdateAccountHead)}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>AccountHead Name</Form.Label>
                  <Form.Control
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="AccountHead Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Master AccountHead</Form.Label>
                  {/* <Form.Control {...register("mc", { required: true })} type="text" placeholder="Enter email" /> */}
                  <SelectAChead
                    mc={mc}
                    handleOnchange={(e) => handleOnchange(e)}
                  ></SelectAChead>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>AccountHead Description</Form.Label>
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

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    {...register("code", { required: true })}
                    type="number"
                    name="code"
                    placeholder="code"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formBasicStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Select {...register("status", { required: true })}>
                        <option value="active">Active</option>
                        <option value="suspend">Suspend</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
                <Link
                  to="/accountheads"
                  className="btn btn-outline-dark me-2 float-center"
                >
                  <Icons.X size={20}></Icons.X> Cancel
                </Link>

                <Button variant="dark" className="float-center" type="submit">
                  <Icons.PlusOutline size={20}></Icons.PlusOutline> Update
                  AccountHead
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountHead;
