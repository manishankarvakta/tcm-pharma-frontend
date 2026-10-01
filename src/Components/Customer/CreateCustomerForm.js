import * as Icons from "heroicons-react";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import CustomergroupSelect from "./CustomergroupSelect";

function CreateCustomerForm({ onSubmit, useForm, handleSelectGroup, group, isAdding }) {
  const { register, handleSubmit, reset, setValue, getValues } = useForm();
  const [showAddressFields, setShowAddressFields] = useState(false);

  const toggleAddressFields = () => {
    setShowAddressFields((prev) => !prev);
  };

  // const onSubmitHandler = (data) => {
  //   console.log(data);
  //   // Call onSubmit if passed as prop
  //   if (onSubmit) {
  //     onSubmit(data);
  //   }

  //   reset();
  // };

  // useEffect(() => {
  //   const formData = getValues();

  //   console.log("Current form values:", formData);
  //   console.log('rest')
  // }, []);

  const onSubmitHandler = (data) => {
    console.log(data);
    // Call onSubmit if passed as prop
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const onResetHandler = () => {
    // Reset all fields, but leave 'group' untouched
    reset();

    // Manually set the 'group' field value to the current group (preserving it)
    setValue("group", group, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h6 className="mb-2">
        <Icons.UserOutline size={20} /> Basic Info
      </h6>
      <div className="form-group row mb-2">
        <label className="col-sm-3 col-form-label">Name</label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            {...register("name", { required: true })}
            placeholder="Name"
          />
        </div>
      </div>

      <div className="form-group row mb-2">
        <label className="col-sm-3 col-form-label">Phone</label>
        <div className="col-sm-9">
          <input
            {...register("phone")}
            type="phone"
            className="form-control"
            id="phone"
            placeholder="phone"
          />
        </div>
      </div>
      <div className="form-group row mb-2">
        <label className="col-sm-3 col-form-label">Email</label>
        <div className="col-sm-9">
          <input
            {...register("email")}
            type="email"
            className="form-control"
            id="email"
            placeholder="email"
          />
        </div>
      </div>
      {/* Address */}
      <div className="">
        {!showAddressFields && (
          <div className="d-flex justify-content-end align-items-center pt-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-dark d-flex align-items-center justify-content-center gap-1"
              onClick={toggleAddressFields}
            >
              <Icons.PlusCircle size={20} className="text-end" />
              {showAddressFields ? "Address" : "Add Address"}
            </button>
          </div>
        )}

        {showAddressFields && (
          <div className="row mb-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">
                <Icons.LocationMarkerOutline size={20} /> Address
              </h6>
              <button
                type="button"
                className="btn btn-sm d-flex align-items-center justify-content-center gap-1"
                onClick={toggleAddressFields}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <Icons.X size={25} />
              </button>
            </div>

            <div className="form-group col-4 mb-3">
              <label htmlFor="holdingNo">House</label>
              <input
                {...register("holdingNo")}
                type="text"
                className="form-control"
                id="holdingNo"
                placeholder="House"
              />
            </div>
            <div className="form-group col-4 mb-3">
              <label htmlFor="street">Street</label>
              <input
                {...register("street")}
                type="text"
                className="form-control"
                id="street"
                placeholder="Street"
              />
            </div>
            <div className="form-group col-4 mb-3">
              <label htmlFor="sector">Sector</label>
              <input
                {...register("sector")}
                type="text"
                className="form-control"
                id="sector"
                placeholder="Sector"
              />
            </div>
            <div className="form-group col-4 mb-3">
              <label htmlFor="town">Town</label>
              <input
                {...register("town")}
                type="text"
                className="form-control"
                id="town"
                placeholder="Town"
              />
            </div>
            <div className="form-group col-4 mb-3">
              <label htmlFor="city">City</label>
              <input
                {...register("city")}
                type="text"
                className="form-control"
                id="city"
                placeholder="City"
              />
            </div>
            <div className="form-group col-4 mb-3">
              <label htmlFor="division">Division</label>
              <input
                {...register("division")}
                type="text"
                className="form-control"
                id="division"
                placeholder="Division"
              />
            </div>
            <div className="form-group col-4 mb-3">
              <label htmlFor="zipCode">Zip Code</label>
              <input
                {...register("zipCode")}
                type="text"
                className="form-control"
                id="zipCode"
                placeholder="Zip Code"
              />
            </div>
            <div className="form-group col-8 mb-3">
              <label htmlFor="country">Country</label>
              <input
                {...register("country")}
                type="text"
                className="form-control"
                id="country"
                placeholder="Country"
              />
            </div>
          </div>
        )}
      </div>

      <h6 className="mb-2">
        <Icons.BadgeCheckOutline size={20} /> Membership
      </h6>
      <div className="row">
        <div className="form-group col-4  mb-3">
          <label htmlFor="inputMC">Member Ship</label>
          <select
            {...register("membership")}
            className="form-select"
            id="membership"
          >
            <option value="gold" selected>
              Gold
            </option>
            <option value="diamond">Diamond</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        
        <div className="form-group col-4  mb-3">
          <label htmlFor="inputMC">Type</label>
          <select {...register("type")} className="form-select" id="status">
            <option value="regular" selected>
              Regular
            </option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div className="form-group col-4  mb-3">
          <label htmlFor="inputMC">status</label>
          <select
            {...register("status")}
            className="form-select"
            id="status"
            placeholder="status"
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
      </div>

      {/* Group */}
      {/* <h6 className="mb-2 mt-4">
        <Icons.BadgeCheckOutline size={20} /> Group
      </h6> */}
      {/* <div className="row">
        <div className="form-group col-6 mb-3">
          <label htmlFor="inputMC">Name</label>

          <select {...register("group")} className="form-select" id="status">
            <option value={""}>Select Group</option>
            <option value="butex">BUTEX</option>
          </select>
        </div>
        <div className="form-group col-6  mb-3">
          <label htmlFor="inputMC">Batch</label>
          <input
            type="text"
            className="form-control"
            {...register("batch")}
            placeholder="Batch"
          />
        </div>
      </div> */}
      <div className="d-flex gap-2 justify-content-center align-itmes-center ">
        <button
          type="reset"
          onClick={onResetHandler}
          className="btn btn-outline-dark col-4 col-md-4"
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn btn-dark col-8 col-md-8"
          disabled={isAdding}
        >
          {isAdding ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <Icons.Plus />
          )}
          Add Customer
        </button>
      </div>
    </form>
  );
}

export default CreateCustomerForm;
