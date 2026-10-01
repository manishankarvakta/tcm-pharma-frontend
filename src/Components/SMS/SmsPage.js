import React, { useEffect, useState } from "react";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import "./SMS.css";

import { useCustomersQuery } from "../../services/customerApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCustomers,
  selectCustomer,
  selectSMS,
  toggleSelect,
} from "../../features/smsSlice";
import { signInUser } from "../Utility/Auth";

const SmsPage = () => {
  const auth =signInUser()
  const { aamarId } = auth;
  const smsData = useSelector((state) => state.smsReducer);
  const dispatch = useDispatch();


  const lang = useSelector((state) => state.languageReducer);

  const [customers, setCustomer] = useState([]);

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useCustomersQuery(aamarId);

  useEffect(() => {
    if (data?.length > 0) {
      //   setCustomer(data.slice().sort((a, b) => b.point - a.point));
      dispatch(selectCustomers(data));
      // setCustomer(data);
      // console.log("customers:", data);
    }
  }, [isSuccess]);

  console.log(smsData.customers);



  const handleSelectCustomer = (id) => {
    dispatch(selectCustomer(id));
    console.log(id);
  };

  const handleSmsChange = (sms) => {
    dispatch(selectSMS(sms));
  };

  const handleSelectAllToggle = () => {
    dispatch(toggleSelect());
  };

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.sms}></Header>
            <div className="row mt-3">
              <div className="col-md-8">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <span className="title">{lang?.customers} </span>
                    <label htmlFor="selectAll"> Select All </label>
                    <input
                      type="checkbox"
                      id="selectAll"
                      onChange={() => handleSelectAllToggle()}
                    />
                  </div>
                  <div>
                    <p className="m-0">
                      Total: {smsData.totalCustomer}{" "}
                      <span className="text-red">|</span> Selected:{" "}
                      {smsData.selectedCustomer}
                    </p>
                  </div>
                </div>
                <div className="h-70vh">
                  <div
                    className="row h-md-100 p-2 gx-2"
                    style={{ overflow: "auto" }}
                  >
                    {isLoading || isFetching ? (
                      Array(12)
                        .fill(0)
                        .map((_, index) => (
                          <div className="col-md-3 col-6" key={index}>
                            <div className="card p-2 mb-1">
                              <Skeleton height={24} />
                              <Skeleton width={80} height={14} className="mt-1" />
                            </div>
                          </div>
                        ))
                    ) : smsData.customers?.length > 0 ? (
                      smsData.customers?.map((customer) => {
                        return (
                          <div className="col-md-3 col-6" key={customer._id}>
                            <label
                              className="card p-2 mb-1"
                              htmlFor={customer._id}
                              // onClick={() => handleSelectCustomer(customer._id)}
                            >
                              <div className="d-flex flex-row justify-content-between align-items-center">
                                <span className="d-flex flex-row justify-content-start align-items-center">
                                  <input
                                    type="checkBox"
                                    id={customer._id}
                                    checked={
                                      customer.status === true ? "checked" : ""
                                    }
                                    onChange={() =>
                                      handleSelectCustomer(customer._id)
                                    }
                                  />
                                  <h6 className="ps-2 m-0 text-red">
                                    {customer.phone}
                                  </h6>
                                </span>
                                <p className="m-0">
                                  (
                                  <small>
                                    <b>{customer.point}</b>
                                  </small>
                                  )
                                </p>
                              </div>
                              <p className="d-flex flex-row justify-content-between align-items-center m-0">
                                <small className="text-nowrap overflow-hidden">
                                  {customer.name}
                                </small>
                              </p>
                            </label>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-100 w-100 flex justify-content-center aligh-items-center">
                        <h3>No Contact found</h3>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <ul
                    className="list-group list-group-flush"
                    style={{ columnCount: 3 }}
                  >
                    <h5>Note Please</h5>
                    <li className="list-group-item">
                      Message Type: English SMS
                    </li>
                    <li className="list-group-item">
                      Message Length: 0 (160 Characters Remaining)
                    </li>
                    <li className="list-group-item">
                      Text Parts: 0, 160 Characters Per Message
                    </li>
                    <li className="list-group-item">
                      Total Characters Remaining: 1071
                    </li>
                    <li className="list-group-item">
                      Total SMS (Don't Send More Than 20000 SMS at once) = 0 SMS
                    </li>
                    <li className="list-group-item">
                      Total Cost: Text Parts X Total Numbers X 0.20 = 0 Tk
                    </li>
                    <li className="list-group-item">
                      Not Supported Characters ~ ^ &#123; &#125; &#91; &#93;
                      &#92; &#124; এই ক্যারেক্টারগুলো এসএমএস এ দিবেন না ।
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <h5>{lang?.smsWrapper}</h5>
                  <div>
                    <p className="m-0">
                      Character: {smsData.character}{" "}
                      <span className="text-red">|</span> SMS:{" "}
                      {Math.ceil(smsData.character / 160)}
                    </p>
                  </div>
                </div>
                <form>
                  <textarea
                    className="form-control"
                    rows={15}
                    placeholder="Please enter your message here"
                    onChange={(e) => handleSmsChange(e.target.value)}
                  ></textarea>
                  <button className="btn btn-dark btn-block mt-2 mb-4">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsPage;
