import React, { Component, Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useCustomerPagenationQuery } from "../../../services/customerApi";
import customStyles from "./CustomStyles";

const CustomSelect = (handleOnchange) => {
  let [customer, setCustomer] = useState([]);
  const { data, error, isLoading, isFetching, isSuccess } =
    useCustomerPagenationQuery();

  // console.log(customer);

  useEffect(() => {
    let mcs = [{ option: "no-brand", label: "Select Brand" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((brand) => {
          mcs = [
            ...mcs,
            {
              option: brand.name,
              label: `${brand.name}`,
            },
          ];
        });
        setCustomer(mcs);
      }
    }
  }, [data]);

  // console.log(data);

  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={customer[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        onChange={(e) => handleOnchange(e)}
        // isRtl={isRtl}
        isSearchable={true}
        name="color"
        options={customer}
        styles={customStyles}
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

export default CustomSelect;
