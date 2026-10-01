import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  useCustomerQuery,
  useUpdateCustomerMutation,
} from "../../services/customerApi";
import Header from "../Common/Header/Header";
import LoadingModal from "../Common/Modal/LoadingModal";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";

const UpdateCustomer = () => {
  const auth = signInUser();

  const { id } = useParams();
  let navigate = useNavigate();
  const customerUniqeId = uuidv4();
  const { data, error, isLoading, isFetching, isSuccess } = useCustomerQuery(
    `${id}`
  );

  const { register, handleSubmit, reset } = useForm({});
  const [loader, setLoader] = useState(true);
  const handleLoaderClose = () => setLoader(false);
  const BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    if (data) {
      reset({
        _id: data?._id,
        name: data?.name,
        username: data?.username,
        // password: data.password,
        membership: data?.membership,
        // address: data.address,

        holdingNo: data?.address[0]?.holdingNo,
        sector: data?.address[0]?.sector,
        street: data?.address[0]?.street,
        town: data?.address[0]?.town,
        city: data?.address[0]?.city,
        division: data?.address[0]?.division,
        country: data?.address[0]?.country,
        zipCode: data?.address[0]?.zipCode,
        phone: data?.phone,
        email: data?.email,
        type: data?.type,
        status: data?.status,
        // code: data.code,
      });
    }
  }, [data]);

  // console.log(data);

  // handel user update
  const [UpdateCustomer] = useUpdateCustomerMutation();

  const updateHandler = async (customer) => {
    console.log("customer", customer);
    let newCustomer = {};
    let email = customer?.email;
    let trimEmail = email.trim();
    if (trimEmail?.length > 0) {
      newCustomer = {
        name: customer?.name,
        password: customer?.password,
        email: customer?.email,
        phone: customer?.phone,
        username: customer?.username,
        warehouse: auth?.warehouse,
        membership: customer?.membership,
        address: {
          type: "Home",
          id: customerUniqeId,
          holdingNo: customer?.holdingNo,
          sector: customer?.sector,
          street: customer?.street,
          town: customer?.town,
          city: customer?.city,
          division: customer?.division,
          country: customer?.country,
          zipCode: customer?.zipCode,
        },
        point: customer?.point ? customer?.point : 0,
        type: customer?.type,
        status: customer?.status,
      };
      console.log("newCustomer", newCustomer);
      // setLoader(true)
    } else {
      newCustomer = {
        name: customer?.name,
        password: customer?.password,
        phone: customer?.phone,
        email: customer?.email,
        username: customer?.username,
        membership: customer?.membership,
        warehouse: auth?.warehouse,
        address: {
          type: "Home",
          id: customerUniqeId,
          holdingNo: customer?.holdingNo,
          sector: customer?.sector,
          street: customer?.street,
          town: customer?.town,
          city: customer?.city,
          division: customer?.division,
          country: customer?.country,
          zipCode: customer?.zipCode,
        },
        point: customer?.point ? customer?.point : 0,
        type: customer?.type,
        status: customer?.status,
      };
      console.log("newCustomer", newCustomer);
      // setLoader(true)
    }

    // const response = await UpdateCustomer({ _id: id, newCustomer });
    // console.log(response)
    // if (response) {
    //   console.log(response);
    //   notify("Customer Update Successful!", "success");
    //   setLoader(false)
    //   navigate("/customer");
    // }
    await UpdateCustomer({ _id: id, newCustomer }).then((res) => {
      console.log(res);
      notify("Customer Update Successful!", "success");
      setLoader(false);
      navigate("/customer");
    });
  };
  useEffect(() => {
    data ? setLoader(false) : setLoader(true);
  }, [data]);

  console.log(data);
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
            <Header title={`Update User: ${data?.name}`}></Header>
            <div className="row  mt-5 pt-3 pb-5">
              <div className="col-md-6 offset-md-3">
                <form onSubmit={handleSubmit(updateHandler)}>
                  <div className="row mb-3">
                    <div className="form-group col-12  mb-3">
                      <label htmlFor="inputCustomer"> Name</label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        className="form-control"
                        id="inputCustomer"
                        aria-describedby="emailHelp"
                        placeholder="Name"
                      />
                      <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                      </small>
                    </div>
                    <div className="form-group col-12  mb-3">
                      <label htmlFor="inputMC">Username</label>
                      <input
                        {...register("username")}
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="username"
                      />
                    </div>
                    <div className="form-group col-12  mb-3">
                      <label htmlFor="inputMC">Phone</label>
                      <input
                        {...register("phone")}
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="form-group col-12  mb-3">
                      <label htmlFor="inputMC">Email</label>
                      <input
                        {...register("email")}
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder=" email"
                      />
                    </div>
                    <div className="form-group col-12  mb-3">
                      <label htmlFor="inputMC">Member Ship</label>

                      <select
                        {...register("membership")}
                        className="form-select"
                        id="membership"
                      >
                        <option value="gold">Gold</option>
                        <option value="diamond">Diamond</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>

                    {/* <div className="form-group col-12  mb-3">
                            <label htmlFor="MCId">Address</label>
                            <textarea
                              {...register("address")}
                              className="form-control"
                              id="address"
                              placeholder="Address"
                            />
                          </div> */}
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">Holding Number</label>
                      <input
                        {...register("holdingNo")}
                        type="text"
                        className="form-control"
                        id="holdingNo"
                        placeholder="Holding Number"
                      />
                    </div>
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">street</label>
                      <input
                        {...register("street")}
                        type="text"
                        className="form-control"
                        id="street"
                        placeholder="street"
                      />
                    </div>
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">Sector</label>
                      <input
                        {...register("sector")}
                        type="text"
                        className="form-control"
                        id="sector"
                        placeholder="Sector"
                      />
                    </div>
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">Town</label>
                      <input
                        {...register("town")}
                        type="text"
                        className="form-control"
                        id="town"
                        placeholder="Town"
                      />
                    </div>
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">City</label>
                      <input
                        {...register("city")}
                        type="text"
                        className="form-control"
                        id="city"
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">Division</label>
                      <input
                        {...register("division")}
                        type="text"
                        className="form-control"
                        id="division"
                        placeholder="Division"
                      />
                    </div>
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">Zip Code</label>
                      <input
                        {...register("zipCode")}
                        type="text"
                        className="form-control"
                        id="zipCode"
                        placeholder="Zip code"
                      />
                    </div>
                    <div className="form-group col-6  mb-3">
                      <label htmlFor="MCId">Country</label>
                      <input
                        {...register("country")}
                        type="text"
                        className="form-control"
                        id="country"
                        placeholder="Country"
                      />
                    </div>
                    <div className="form-group col-12  mb-3">
                      <label htmlFor="inputMC">Type</label>
                      <select
                        {...register("type")}
                        className="form-select"
                        id="status"
                      >
                        <option value="regular" selected>
                          Regular
                        </option>
                        <option value="premium">Premium</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>
                    {/* <input
                              {...register("type")}
                              type="text"
                              className="form-control"
                              id="password"
                              placeholder="type"
                            />
                          </div> */}

                    <div className="form-group col-12  mb-3">
                      <label htmlFor="inputMC">status</label>
                      <select
                        {...register("status")}
                        className="form-control"
                        id="status"
                        placeholder="status"
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex gap-1 align-items-center justify-content-between">
                    <Link
                      to="/customer"
                      className="btn  col-md-3 btn-outline-dark   float-center"
                    >
                      <Icons.X size={20}></Icons.X> Cancel
                    </Link>
                    <button type="submit" className="btn btn-dark col-md-8 ">
                      {data?._id ? (
                        <>
                          <Icons.SaveOutline></Icons.SaveOutline>
                        </>
                      ) : (
                        <>
                          <Icons.Plus> </Icons.Plus>
                        </>
                      )}
                      Customer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCustomer;
