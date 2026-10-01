import * as Icons from "heroicons-react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAddAccountHeadMutation } from "../../services/accountHeadApi";
import SelectAChead from "../Common/CustomSelect/SelectAChead";
import Header from "../Common/Header/Header";
import LoadingModal from "../Common/Modal/LoadingModal";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import axios from "../../services/apiClient";
import { useSelector } from "react-redux";

const AddAccountHead = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const { register, handleSubmit, reset,setValue } = useForm({});
  const navigate = useNavigate();
    const lang = useSelector((state) => state.languageReducer);
  
  const [mc, setMc] = useState("");
  const [codeUnique, setCodeUnique] = useState(false); // Uniqueness check
  const [uniqueCode, setUniqueCode] = useState(""); // Uniqueness check
  const [accountCode, setAccountCode] = useState(""); // Account code input
  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  const [addACHead] = useAddAccountHeadMutation();

    // Function to check if the account code is unique
    const checkCodeInAPI = async (code) => {
      try {
        const cancelToken = axios.CancelToken.source();
        const response = await axios.get(
          `${BASE_URL}/accounthead/unique/${code}/${aamarId}`,
          {
            cancelToken: cancelToken.token
          }
        );
  
        console.log(response);
  
        if (response.data) {
          setCodeUnique(response.data.exists); // Code exists in the database
        }
      } catch (error) {
        console.error("Error checking code in API:", error);
        setCodeUnique(false); // Assume not unique on error
      }
    };

      // Check the number of SUB Account Head

  const checkCount = async (mc) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/accounthead/aamarAH/${mc}/${aamarId}`,
        {}
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking code in API:", error);
      setCodeUnique(false); // Assume not unique on error
    }
  };

  const handleCodeChange = async (e) => {
    const code = e.target.value;
    console.log("code", code);
    setUniqueCode(code); // Update the account code state

    if (code !== "") {
      console.log("code", code);
      await checkCodeInAPI(code);
    }
  };

  const handleAddAccountHead = async (data) => {
    // console.log(data)
    let newData = {};
    if (mc === "") {
      newData = { ...data,code: uniqueCode, aamarId };
    } else {
      newData = { ...data, maId: mc.option, aamarId };
    }
    setLoader(true);
    await addACHead(newData)
      .then((res) => {
        // console.log(res)
        notify("AccountHead created Successfully", "success");
        navigate("/accountheads");
      })
      .catch((err) => {
        // console.log(err);
        notify("Server Side Error", "error");
      })
      .finally(setLoader(false));
  };
  

  // Master Account Head Select
  const handleOnchange = async (e) => {
    if (e && e.option) {
      setMc(e); // Set the selected master account
      setAccountCode(e.code); // Set the base account code
      setUniqueCode(""); // Clear previous unique code
  
      try {
        // Generate the unique code based on sub-account count
        const count = await checkCount(e.option);
        const newCode = parseInt(e.code) + parseInt(count) + 1;
        const uniqueCodeString = newCode.toString();
  
        // Update `uniqueCode` state and `AccountHead Code` field in the form
        setUniqueCode(uniqueCodeString);
        setValue("code", uniqueCodeString); // Programmatically set the form value
      } catch (error) {
        console.error("Error generating unique code:", error);
      }
    } else {
      setAccountCode(""); // Reset account code
      setMc(null);
      setUniqueCode("");
      setValue("code", ""); // Clear the form field value
    }
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
            <Header title={lang?.addAccountHead}></Header>
            <div className="row mt-3">
              <div className="col-md-6 offset-md-3">
                <Form onSubmit={handleSubmit(handleAddAccountHead)}>
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

                  <Form.Group className="mb-3" controlId="formBasicCode">
                    <Form.Label>AccountHead Code</Form.Label>
                    <Form.Control
                      {...register("code", { required: true })}
                      // disabled={accountCode !== "" && true}
                      type="number"
                      value={uniqueCode} // Bind the account code value
                      placeholder="Enter AccountHead Code"
                      onChange={handleCodeChange} // Validate code dynamically
                      isInvalid={codeUnique} // Highlight if code is not unique
                    />
                    {codeUnique && (
                      <Form.Control.Feedback type="invalid">
                        This code already exists. Please use a different code.
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          {...register("status", { required: true })}
                        >
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
                    <Icons.PlusOutline size={20}></Icons.PlusOutline> Add
                    AccountHead
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

export default AddAccountHead;
