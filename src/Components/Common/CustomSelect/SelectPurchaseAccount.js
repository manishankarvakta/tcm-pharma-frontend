import React, { Component, Fragment, useEffect, useState } from "react";
import { usePurchasesQuery } from "../../../services/purchasApi";

import Select from "react-select";

const SelectPurchaseAccount = ({ data, isSuccess, handleVendorChange }) => {
  // let [supplier, setSupplier] = useState([]);
  let [poDw, setPoDw] = useState([]);
  // const { data, error, isLoading, isFetching, isSuccess } = usePurchasesQuery();
  // console.log(data);

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_URL}supplier`)
  //     .then((res) => res.json())
  //     .then((data) => setSupplier(data));
  // }, []);

  useEffect(() => {
    let poLists = [{ option: "no-poLists", label: "Select PoLists" }];
    if (isSuccess) {
      if (data.length > 0) {
        data?.map((po) => {
          poLists = [
            ...poLists,
            {
              option: po._id,
              label: `${po.poNo} - ${(po.total).toFixed(2)} BDT`,
              po: po
            },
          ];
        });
        setPoDw(poLists);
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
        value={poDw[poDw.indexOf(poDw)]}
        defaultValue={poDw[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        // value={
        //   poNo !== ""
        //     ? poDw.filter((sel) => sel?.option?.toString() === poNo?.toString())
        //     : { option: 0, label: "Please Select a Purchase Order" }
        // }
        isSearchable={true}
        name="poNo"
        onChange={handleVendorChange}
        options={poDw}
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

export default SelectPurchaseAccount;
