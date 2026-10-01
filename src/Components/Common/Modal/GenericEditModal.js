import React, { useEffect } from "react";
import {
  useGenericQuery,
  useUpdateGenericMutation,
} from "../../../services/genericApi";
import { Button, Modal } from "react-bootstrap";
import * as Icons from "heroicons-react";
import { useForm } from "react-hook-form";
import { apiUniqueErrHandle } from "../../Utility/Utility";
import { useNavigate } from "react-router-dom";
import { notify } from "../../Utility/Notify";

const GenericEditModal = ({ onShow, handleClose, generic }) => {
  // console.log(generic)
  let navigate = useNavigate();

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useGenericQuery(generic?._id);
  const [updateGeneric] = useUpdateGenericMutation();

  // console.log("data", data)
  // console.log("generic", generic)
  const { register, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (data) {
      reset({
        name: data?.name,
        code: data?.code,
        details: data?.details,
        status: data?.status,
      });
    }
  }, [data, isSuccess]);

  const onSubmit = async (data) => {
    // console.log(data)

    // console.log(data);
    try {
      const response = await updateGeneric({ _id: generic._id, ...data });
      if (response) {
        notify("Update Successful!");
        // console.log(response);
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          reset({
            name: "",
            code: "",
            details: "",
            status: "active",
          });
          handleClose();

          // console.log(response?.data?.message);
          return navigate("/generic");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      refetch();
    }
  };
  const handleReset = () => {
    reset({
      name: "",
      code: "",
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
        <Modal.Title>Update Generic </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputCustomer">Generic Name</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="form-control"
                  id="inputCustomer"
                  aria-describedby="emailHelp"
                  placeholder="generic Name"
                />
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputCustomer">Generic Code</label>
                <input
                  {...register("code", { required: true })}
                  type="text"
                  className="form-control"
                  id="inputCustomer"
                  aria-describedby="emailHelp"
                  placeholder="generic Code"
                  readOnly
                />
              </div>

              <div className="form-group col-12  mb-3">
                <label htmlFor="inputMC"> Details</label>
                <textarea
                  {...register("details")}
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="details"
                />
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="MCId">Status</label>
                <select
                  {...register("status")}
                  className="form-control"
                  id="address"
                  placeholder="Address"
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
                <Icons.PencilAltOutline> </Icons.PencilAltOutline>
              </>
              Update generic
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

export default GenericEditModal;
