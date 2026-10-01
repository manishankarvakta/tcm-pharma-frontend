/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "../../services/apiClient";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../pharmacy-logo.png";
import {
  useAddSettingsMutation,
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "../../services/settingsApi";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { JwtReValidate, signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import PhotoUploader from "../Common/photoUpload/photoUpload";

const StoreSettings = () => {
  let photoSrc;
  const lang = useSelector((state) => state.languageReducer);

  const PHOTO_BASE_URL =
    process.env.REACT_APP_PHOTO_URL || "http://localhost:5001";
  const user = signInUser();
  const { aamarId, storeSettings } = user;
  // console.log("USER::>>", storeSettings);
  const { data: settings, isSuccess, refetch } = useSettingsQuery(aamarId); // Fetch settings
  const [updateSettings] = useUpdateSettingsMutation(); // Mutation for updating settings
  const [addSettings] = useAddSettingsMutation(); // Mutation for adding settings
  const [file, setFile] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  // const [fileName, setFileName] = useState("");
  const [storePhoto, setStorePhoto] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dispatch = useDispatch();
  const [isToggled, setIsToggled] = useState(true); // State for toggle
  // console.log("Settings DATA::>", settings);
  // console.log("PHOTO::>", storePhoto);
  // photo upload

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  // useEffect(() => {
  //   if (isSuccess && settings) {
  //     reset(settings);
  //     if (settings?.paymentMethods) {
  //       setSelectedPayments(settings?.paymentMethods);
  //     }
  //     if (settings.data?.photo) {
  //       setStorePhoto(`${PHOTO_BASE_URL}${settings?.data?.photo}`);
  //     }
  //   }
  // }, [isSuccess, settings, reset]);

  const paymentMethods = [
    { order: "bKash", name: "bKash", type: "mfs", status: false },
    { order: "nagad", name: "Nagad", type: "mfs", status: false },
    { order: "rocket", name: "Rocket", type: "mfs", status: false },
    { order: "upay", name: "Upay", type: "mfs", status: false },
    { order: "visa", name: "Visa", type: "card", status: false },
    { order: "dbbl", name: "DBBL", type: "card", status: false },
    { order: "mtb", name: "MTB", type: "card", status: false },
    { order: "amex", name: "AMEX", type: "card", status: false },
    { order: "ebl", name: "EBL", type: "card", status: false },
    { order: "brac", name: "BRAC", type: "card", status: false },
    { order: "masterCard", name: "MasterCard", type: "card", status: false },
  ];
  // console.log("selectedPayments", selectedPayments);

  // Fetch and set settings data on success
  useEffect(() => {
    if (isSuccess && settings) {
      reset(settings);
      if (settings?.paymentMethods) {
        setSelectedPayments(settings?.paymentMethods);
      }
      if (settings.data?.photo) {
        setStorePhoto(`${PHOTO_BASE_URL}${settings?.data?.photo}`);
      }
    }
  }, [isSuccess, settings, reset]);

  useEffect(() => {
    refetch();
    if (storeSettings?.binNumber || storeSettings?.vatPercentage) {
      setIsToggled(false);
    }
  }, [settings, refetch]);

  // Handle form submission
  const onSubmit = async (data, message) => {
    const payload = {
      ...data,
      aamarId: aamarId,
      paymentMethods: selectedPayments,
      storePhoto,
    };
    // console.log("Payload for submission:", data);
    const response = await addSettings(payload);
    // console.log("Response", response);
    if (response?.data) {
      await JwtReValidate();

      refetch();
      notify(message, "success");
    } else {
      notify("Failed to add settings.", "error");
    }
  };



  const togglePaymentMethod = (order) => {
    // console.log("Order", order);
    setSelectedPayments((prevSelected) => {
      // Ensure prevSelected is always an array before performing operations
      const validPrevSelected = Array.isArray(prevSelected) ? prevSelected : [];

      // Toggle logic: Add or remove payment method
      return validPrevSelected.includes(order)
        ? validPrevSelected.filter((method) => method !== order) // Remove if already selected
        : [...validPrevSelected, order]; // Add if not selected
    });
  };

  const handleToggleChange = () => {
    setIsToggled(!isToggled);
  };

  const updatePhotUrl = async (url) => {
    // const data = {};
const payload = {
      storePhoto: url,
      aamarId: aamarId,
    };
    // console.log("Payload for submission:", data);
    const response = await addSettings(payload);
    console.log("Response", response);
    if (response?.data) {
      await JwtReValidate();
      refetch();
      notify("Logo Upload Successful", "success");
    } else {
      notify("Failed to add settings.", "error");
    }
  };

  // console.log("Store Photo", settings?.storePhoto);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SideBar />
        </div>
        <div className="col-md-10">
          <Header title={lang?.storeSettings} />
          <div className="row mt-3">
            <div className="col-md-3" />
            <div className="col-md-6 mt-5 ">
              {/* Store Photo Upload */}
              
                <div className="row mb-4">
                  <h5 className="mb-3 d-flex align-content-center gap-2">
                    <Icons.HomeOutline /> {lang?.storeLogo}
                  </h5>
                  <hr />

                  <label className="col-sm-4 col-form-label">
                    {lang?.storeLogo}
                  </label>
                  <PhotoUploader 
                    uploadSuccess={updatePhotUrl}
                    aspectRatio={8/2}
                    folderName={aamarId}
                    maxFileSize={1 * 1024 * 1024} // 1MB
                    acceptedFileTypes={['image/jpg','image/jpeg','image/svg', 'image/png', 'image/webp']}
                    image={settings?.storePhoto}
                  />  
                </div>
              {/* Basic Section */}
              <form
                style={{ marginTop: "80px" }}
                onSubmit={handleSubmit((data) =>
                  onSubmit(data, "Basic Settings added successfully!")
                )}
              >
                <div className="mb-4">
                  <h5 className="mb-3 d-flex align-content-center gap-2">
                    <Icons.UserOutline /> {lang?.basicInfo}
                  </h5>
                  <hr />

                  <div className="row mb-2">
                    <label className="col-sm-4 col-form-label">
                      Store Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        {...register("storeName")}
                        placeholder="Store Name"
                      />
                    </div>
                  </div>

                  <div className="row mb-2">
                    <label className="col-sm-4 col-form-label">
                      Business Type
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        {...register("businessType")}
                        placeholder="Business Type"
                      />
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <label className="col-form-label"> License Number</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("licenseNumber")}
                        placeholder="License Number"
                      />
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">Currency</label>
                      <div className="input-group">
                        <select
                          className="form-select"
                          {...register("currency")}
                        >
                          <option value="BDT">BDT</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <label className="col-form-label">Language</label>
                      <div className="input-group">
                        <select className="form-select" {...register("lang")}>
                          <option value="bn">বাংলা</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-dark">
                      <Icons.SaveOutline className="me-2" />
                      Save Basic
                    </button>
                  </div>
                </div>
              </form>

              {/* Contact Info Section */}
              <form
                style={{ marginTop: "80px" }}
                onSubmit={handleSubmit((data) =>
                  onSubmit(data, "Contact Settings added successfully!")
                )}
              >
                <div className="mb-4">
                  <h5 className="mb-3 d-flex align-content-center gap-2 mt-5">
                    <Icons.UserOutline />
                    {lang?.contactInfo}
                  </h5>
                  <hr />
                  <div className="row mb-2">
                    <label className="col-sm-4 col-form-label">Email</label>
                    <div className="col-sm-8">
                      <input
                        type="email"
                        className="form-control"
                        {...register("email")}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-sm-4 col-form-label">Phone</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        {...register("phone")}
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-sm-4 col-form-label">Website</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        {...register("websiteUrl")}
                        placeholder="Website URL"
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className=" col-form-label">Address</label>
                    <div className="col-sm-12">
                      <input
                        type="text"
                        className="form-control"
                        {...register("address.street")}
                        placeholder="Street Address"
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-6">
                      <label className="col-form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("address.city")}
                        placeholder="City"
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="col-form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("address.state")}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div
                      className="col-sm-4
                    "
                    >
                      <label className="col-form-label">Post Office</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("address.post")}
                        placeholder="Post Code"
                      />
                    </div>
                    <div
                      className="col-sm-4
                    "
                    >
                      <label className="col-form-label">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("address.zip")}
                        placeholder="Zip Code"
                      />
                    </div>
                    <div
                      className="col-sm-4
                    "
                    >
                      <label className="col-form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("address.country")}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-dark">
                      <Icons.SaveOutline className="me-2" />
                      Save Contact
                    </button>
                  </div>
                </div>
              </form>

              {/* POS Settings Section */}
              <form
                style={{ marginTop: "80px" }}
                onSubmit={handleSubmit((data) =>
                  onSubmit(data, "POS Settings added successfully!")
                )}
              >
                <div className="mb-4">
                  <h5 className="mb-3 d-flex align-content-center gap-2 mt-5">
                    <Icons.UserOutline />
                    {lang?.posSettings}
                  </h5>
                  <hr />
                  <div className="row align-items-center">
                    {/* Invoice Prefix */}
                    <div className="col-md-8">
                      <label className="col-form-label">Invoice Prefix</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("invoiceIdPrefix", {
                          maxLength: {
                            value: 3,
                            message: "Please enter no more than 3 characters",
                          },
                        })}
                        placeholder="Invoice Prefix"
                        onChange={(e) =>
                          (e.target.value = e.target.value.toUpperCase())
                        }
                      />
                      {errors?.invoiceIdPrefix?.message && (
                        <div className="text-danger">
                          {errors.invoiceIdPrefix.message}
                        </div>
                      )}
                    </div>

                    {/* Invoice Size */}
                    <div className="col-md-4">
                      <label className="col-form-label">Invoice Size</label>
                      <div className="input-group">
                        <select
                          className="form-select"
                          {...register("defaultInvoiceSize")}
                        >
                          <option value="88">88 cm</option>
                          <option value="85">85 cm</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-2">
                    {/* <div className="col-sm-4">
                      <label className="col-form-label">Unit</label>
                      <div className="input-group">
                        <select className="form-select" {...register("unit")}>
                          <option value="EA">
                            <span role="img" aria-label="each">
                              ⚙ EA (Each)
                            </span>
                          </option>
                          <option value="Number">
                            <span role="img" aria-label="number">
                              🔢 Number
                            </span>
                          </option>
                          <option value="Float">
                            <span role="img" aria-label="float">
                              💧 Float
                            </span>
                          </option>
                        </select>
                      </div>
                    </div> */}

                    {/* <div className="col-sm-4">
                      <label className="col-form-label">POS Screen</label>
                      <div className="">
                        <div className="input-group">
                          <select
                            className="form-select"
                            {...register("posScreen")}
                          >
                            <option value="pos">🔒 Secure POS</option>
                            <option value="pos2">🔓 Unsecured POS</option>
                          </select>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-dark">
                      <Icons.SaveOutline className="me-2" />
                      Save POS
                    </button>
                  </div>
                </div>
              </form>
              {/* VAT Settings Section */}
              <form
                style={{ marginTop: "80px" }}
                onSubmit={handleSubmit((data) =>
                  onSubmit(data, "Contact Settings added successfully!")
                )}
              >
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <h5 className=" d-flex align-content-center gap-2">
                      <Icons.UserOutline />
                      {lang?.vatTaxSettings}
                    </h5>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="vatTaxToggle"
                        checked={!isToggled}
                        onChange={handleToggleChange}
                      />
                      <label
                        htmlFor="vatTaxToggle"
                        className="form-check-label"
                      >
                        {!isToggled ? "Enabled" : "Disabled"}
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-2">
                    <label className="col-sm-4 col-form-label">
                      BIN Number
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        {...register("binNumber")}
                        placeholder="BIN Number"
                        disabled={isToggled} // Disable if toggle is off
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-sm-4 col-form-label">
                      VAT Percentage
                    </label>
                    <div className="col-sm-8">
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          {...register("vatPercentage")}
                          placeholder="VAT Percentage"
                          disabled={isToggled} // Disable if toggle is off
                        />
                        <span className="input-group-text p-2">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="submit"
                      className="btn btn-dark"
                      disabled={isToggled}
                    >
                      <Icons.SaveOutline className="me-2" />
                      Save VAT
                    </button>
                  </div>
                </div>
              </form>

              {/* Payment Settings */}
              <form
                style={{
                  marginTop: "50px",
                  marginBottom: "50px",
                }}
                onSubmit={handleSubmit((data) =>
                  onSubmit(data, "Payment Settings added successfully!")
                )}
              >
                <h5 className="d-flex align-items-center gap-2">
                  <Icons.UserOutline />
                  {lang?.paymentSettings}
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
                    gap: "20px", // Spacing between items
                    justifyItems: "start", // Center items in each column
                    marginTop: "20px",
                  }}
                >
                  {paymentMethods?.map((method) => (
                    <div
                      key={method.id}
                      style={{
                        display: "flex",
                        flexDirection: "column", // Checkbox and text in one column
                        alignItems: "center", // Center align the content
                        cursor: "pointer",
                      }}
                      onClick={() => togglePaymentMethod(method?.order)}
                    >
                      {/* Checkbox Icon */}
                      <div>
                        {Array.isArray(selectedPayments) &&
                        selectedPayments.includes(method.order) ? (
                          <FaCheckSquare />
                        ) : (
                          <FaRegSquare />
                        )}

                        <span className="m-2">{method?.name}</span>
                      </div>
                      {/* Payment Name */}
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={isToggled}
                  >
                    <Icons.SaveOutline className="me-2" />
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default StoreSettings;
