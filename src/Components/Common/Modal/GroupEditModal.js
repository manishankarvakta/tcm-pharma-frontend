import * as Icons from "heroicons-react";
import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useGroupQuery,
  useUpdateGroupMutation,
} from "../../../services/groupApi";
import { notify } from "../../Utility/Notify";
import { apiUniqueErrHandle } from "../../Utility/Utility";

const GroupEditModal = ({ onShow, handleClose, group }) => {
  // console.log(group)
  let navigate = useNavigate();

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useGroupQuery(group?._id);
  const [updateGroup] = useUpdateGroupMutation();

  const { register, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (data) {
      reset({
        name: data?.name,
        code: data?.code,
        details: data?.details,
        symbol: data?.symbol,
        status: data?.status,
      });
    }
  }, [data, isSuccess]);

  const onSubmit = async (data) => {
    // console.log(data)

    // console.log(data);
    try {
      const response = await updateGroup({ _id: group._id, ...data });
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
            symbol: "",
            status: "active",
          });
          //   console.log(response?.data?.message);
          handleClose();
          return navigate("/group");
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
      symbol: "",
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
        <Modal.Title>Update Group </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputCustomer">Group Name</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="form-control"
                  id="inputCustomer"
                  aria-describedby="emailHelp"
                  placeholder="Group Name"
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputMC"> Code </label>
                <input
                  {...register("code")}
                  type="text"
                  className="form-control"
                  id="code"
                  placeholder="symbol"
                />
              </div>
              <div className="form-group col-12  mb-3">
                <label htmlFor="inputMC"> Symbol</label>
                <input
                  {...register("symbol")}
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="symbol"
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
                <Icons.Plus> </Icons.Plus>
              </>
              Update Group
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

export default GroupEditModal;
