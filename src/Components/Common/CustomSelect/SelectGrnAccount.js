import React, { Component, Fragment, useEffect, useState } from "react";
import { useGrnsQuery } from "../../../services/grnApi";

import Select from "react-select";
import customStyles from "./CustomStyles";

const SelectGrnAccount = ({ data, isSuccess, handleVendorChange }) => {
  // let [supplier, setSupplier] = useState([]);
  let [grnDw, setGrnDw] = useState([]);
  // const { data, error, isLoading, isFetching, isSuccess } = useGrnsQuery();
  // console.log(data);

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_URL}supplier`)
  //     .then((res) => res.json())
  //     .then((data) => setSupplier(data));
  // }, []);

  useEffect(() => {
    let poLists = [{ option: "no-poLists", label: "Select Grn No" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((po) => {
          poLists = [
            ...poLists,
            {
              option: po._id,
              label: `${po.grnNo} - ${(po.total).toFixed(2)} BDT`,
              grn: po
            },
          ];
        });
        setGrnDw(poLists);
      }
    }
  }, [data]);
  // console.log(vendor)

  // console.log(vendor.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))

  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={grnDw[grnDw.indexOf(grnDw)]}
        defaultValue={grnDw[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        // value={
        //   poNo !== ""
        //     ? grnDw.filter((sel) => sel?.option?.toString() === poNo?.toString())
        //     : { option: 0, label: "Please Select a Purchase Order" }
        // }
        isSearchable={true}
        name="poNo"
        onChange={handleVendorChange}
        options={grnDw}
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

export default SelectGrnAccount;
