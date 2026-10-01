import React, { Component, Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useUserDwQuery } from "../../../services/userApi";

const BillerSelectNew = (handleOnchange) => {
  let [customer, setCustomer] = useState([]);
  const { data, error, isLoading, isFetching, isSuccess } = useUserDwQuery();

  // console.log(customer);

  useEffect(() => {
    let mcs = [];
    // let mcs = [{ option: "no-user", label: "Select User" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((user) => {
          mcs = [
            ...mcs,
            {
              option: user._id,
              label: `${user.name}`,
            },
          ];
        });
        setCustomer(mcs);
      }
    }
  }, [data]);

  // console.log("customer", customer);
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={customer[customer.indexOf(customer)]}
        defaultValue={customer[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isSearchable={true}
        name="biller"
        onChange={handleOnchange}
        options={customer}
      />

      <div
        style={{
          color: "hsl(0, 0%, 40%)",
          display: "inline-block",
          fontSize: 12,
          fontStyle: "italic",
          marginTop: "1em",
        }}
      ></div>
    </Fragment>
  );
};

export default BillerSelectNew;
