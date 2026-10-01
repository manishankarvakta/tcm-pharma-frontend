import React, { Component, Fragment, useEffect, useState } from "react";
import { useSupplierQuery } from "../../../services/supplierApi";

import Select from "react-select";

const SelectSupplierPurchaseUpdate = ({ supplier_code, handleOnchange }) => {
  const { data, error, isLoading, isFetching, isSuccess } = useSupplierQuery(
    `${supplier_code}`
  );
  let [supplier, setSupplier] = useState([]);
  // let [vendor, setVendor] = useState([]);
  // console.log("supplier", data)
  useEffect(() => {
    // console.log(error);
    let suppliers = [];
    if (isSuccess) {
      if (data) {
        suppliers = [
          ...suppliers,
          {
            option: data._id,
            label: `${data.company} - ( ${data.name} )`,
          },
        ];

        setSupplier(suppliers);
      }
    }
  }, [data, error]);

  // console.log(supplier)

  return (
    <Fragment>
      <Select
        // options={options}
        defaultValue={supplier[0]}
        value={supplier[0]}
        isDisabled={true}
        // onChange={handleSelectChange}
      />
      {/* <Select
        className="select"
        classNamePrefix="Select Supplier"
        defaultValue={supplier[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        value={supplier[supplier.indexOf(supplier)]}
        isSearchable={true}
        name="supplier_code"
        onChange={handleOnchange}
        options={supplier}
      /> */}

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

export default SelectSupplierPurchaseUpdate;
