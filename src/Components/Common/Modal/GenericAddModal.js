import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as Icons from "heroicons-react";
import { useForm } from "react-hook-form";
import { apiUniqueErrHandle } from "../../Utility/Utility";
import { useNavigate } from "react-router-dom";
import { useAddGenericMutation, useGenericCountQuery } from "../../../services/genericApi";
import { notify } from "../../Utility/Notify";
import { signInUser } from "../../Utility/Auth";
import { v4 as uuidv4 } from "uuid";
import axios from "../../../services/apiClient";


const GenericAddModal = ({ onShow, setOnShow, handleClose }) => {
  let navigate = useNavigate();
  const auth = signInUser();
  const [genericCode, setGenericCode] = useState();
 

  const { aamarId } = auth;
  const [addGeneric] = useAddGenericMutation();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});
  // CHECK UNIQUE
  const checkCodeInAPI = async (code) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/generic/unique/${code}/${aamarId}`,
        {
          params: { code },
        }
      );
      console.log(response.data.exists);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking code in API:", error);
      return false; // Default to not found in case of an error
    }
  };

  const generateUniqueSixDigitCode = async () => {
    let numericCode;
    do {
      const uuid = uuidv4();
      numericCode = parseInt(uuid.split("-")[0], 16) % 1000000;
      numericCode = String(numericCode).padStart(6, "0");
    } while (await checkCodeInAPI(numericCode));

    setGenericCode(numericCode);
    setValue("code", numericCode);
    return numericCode;
  };

  useEffect(() => {
    if (onShow) {
      generateUniqueSixDigitCode();
    }
  }, [onShow]);

  

 

  const onSubmit = async (data) => {
    // console.log("data", data)
    // console.log(data);
    try {
      // Manual check for name uniqueness before submission
      const nameCheck = await axios.get(
        `${BASE_URL}/generic/checkName/${aamarId}/${data.name}`
      );
      if (nameCheck.data && nameCheck.data.exists) {
        notify(
          `${data.name} name already exists, please choose another name`,
          "error"
        );
        return;
      }

      const response = await addGeneric({
        ...data,
        aamarId,
      });
      if (response) {
        console.log("ResDATA", response);
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          reset({
            name: "",
            details: "",
            status: "active",
          });
          // console.log(response?.data?.message);
          notify("Generic added Successfully", "success");
          setOnShow(false);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  const handleReset = () => {
    reset({
      name: "",
      details: "",
      status: "active",
    });
  };
  return (
    <Modal
      show={onShow}
      onHide={handleClose}
      centered={true}
      size="md"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header className="d-flex justify-content-end" closeButton>
        <Modal.Title>Add Generic </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <div className="form-group col-12  mb-3">
                <label htmlFor="name">
                  Generic Name <span className="text-danger">*</span>
                </label>
                <input
                  {...register("name", { required: "Generic Name is required" })}
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="name"
                  placeholder="Generic Name"
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="genericCode"> Code</label>
                <input
                  {...register("code")}
                  type="text"
                  className="form-control"
                  id="genericCode"
                  value={genericCode}
                  readOnly
                />
              </div>

              <div className="form-group col-12  mb-3">
                <label htmlFor="details"> Details</label>
                <textarea
                  {...register("details")}
                  className="form-control"
                  id="details"
                  placeholder="details"
                />
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="status">Status</label>
                <select
                  {...register("status")}
                  className="form-control"
                  id="status"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
            </div>
            <button
              type="reset"
              onClick={handleReset}
              className="btn btn-outline-dark col-4 col-md-4"
            >
              Reset
            </button>
            <button type="submit" className="btn btn-dark col-8 col-md-8">
              <>
                <Icons.Plus> </Icons.Plus>
              </>
              Generic
            </button>
          </form>
        </div>
        {/* <PO ref={componentRef} purchase={purchaseView.data} /> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GenericAddModal;
