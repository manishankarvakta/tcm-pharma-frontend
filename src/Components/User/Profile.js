import * as Icons from "heroicons-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useUpdateUserMutation, useUserQuery } from "../../services/userApi";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { useSelector } from "react-redux";

function Profile() {
  const loggedInUser = signInUser();
  // const { aamarId } = loggedInUser;

  const [updateUser] = useUpdateUserMutation();
  const { data, isSuccess } = useUserQuery(loggedInUser.id);
  const lang = useSelector((state) => state.languageReducer);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      name: data?.name,
      email: data?.email,
      _id: data?._id,
    });
  }, [isSuccess, data]);

  const onSubmit = (data) => {
    if (data.password === data.rePassword) {
      if (data.password === "") {
        delete data.password;
        delete data.rePassword;
      } else {
        delete data.rePassword;
      }

      const response = updateUser(data);
      if (response) {
        notify("Update User Profile Successful", "success");
      } else {
        notify("User Profile Update Field", "error");
      }
    } else {
      notify("Password does not matched", "error");
    }
    console.log(data);
  };
  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar />
          </div>
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-12">
                <Header title={lang?.profileSetting} />
              </div>
              <div className="col-md-3"></div>
              <div className="col-md-6 mt-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h5 className="mb-3">
                    <Icons.UserOutline /> {lang?.basicInfo}
                  </h5>
                  <div className="form-group row mb-2">
                    <label
                      for="staticEmail"
                      className="col-sm-2 col-form-label"
                    >
                      Name
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register("name", { required: true })}
                        placeholder="Name"
                      />
                      <input
                        type="hidden"
                        className="form-control"
                        {...register("_id", { required: true })}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-2">
                    <label
                      for="staticEmail"
                      className="col-sm-2 col-form-label"
                    >
                      Email
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="email"
                        className="form-control"
                        {...register("email", { required: true })}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group row mb-2">
                    <label
                      for="staticEmail"
                      className="col-sm-2 col-form-label"
                    >
                      Type
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        readonly
                        className="form-control-plaintext"
                        id="staticEmail"
                        value={data?.type}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-2">
                    <label
                      for="staticEmail"
                      className="col-sm-2 col-form-label"
                    >
                      Phone
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        readonly
                        className="form-control-plaintext"
                        id="staticEmail"
                        value={data?.phone}
                      />
                    </div>
                  </div>
                  <h5 className="mt-4 pt-4 mb-3">
                    <Icons.ShieldCheckOutline /> {lang?.security}
                  </h5>
                  <div className="form-group row mb-2">
                    <label
                      for="staticEmail"
                      className="col-sm-2 col-form-label"
                    >
                      Username
                    </label>
                    <div className="col-sm-10 ">
                      <input
                        type="text"
                        readonly
                        className="form-control-plaintext"
                        id="staticEmail"
                        value={data?.username}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-2">
                    <label
                      for="inputPassword"
                      className="col-sm-2 col-form-label"
                    >
                      Password
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        {...register("password")}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-2">
                    <label
                      for="inputPassword"
                      className="col-sm-2 col-form-label"
                    >
                      Confirm Password
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="password"
                        className="form-control"
                        id="inputRePassword"
                        {...register("rePassword")}
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  {watch("rePassword") !== watch("password") &&
                  getValues("rePassword") ? (
                    <p>password not match</p>
                  ) : null}

                  <button type="submit" className="btn btn-dark mb-2 mt-4">
                    <Icons.CheckOutline /> Save Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default Profile;
