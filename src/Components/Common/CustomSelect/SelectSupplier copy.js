import React, { Component, Fragment, useEffect, useState } from "react";
import { useSuppliersQuery } from "../../../services/supplierApi";

import Select from "react-select";

const SelectSupplier = ({ supplier_code, handleOnchange }) => {
  const { data, error, isLoading, isFetching, isSuccess } = useSuppliersQuery();
  let [supplier, setSupplier] = useState([]);
  // let [vendor, setVendor] = useState([]);
  // console.log(data)

  useEffect(() => {
    // console.log(error);
    let suppliers = [{ option: "no-suppliers", label: "Select supplier" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((supplier) => {
          suppliers = [
            ...suppliers,
            {
              option: supplier?._id,
              label: `${supplier?.code} -  ${supplier?.company} `,
              code: supplier?.code,
              phone: supplier?.phone,
            },
          ];
        });
        setSupplier(suppliers);
      }
    }
  }, [data, error]);

  // console.log(supplier);
  // const OnChangeSelect = (value) => {
  //   console.log(value);
  // };

  // useEffect(() => {
  //   let vendors = [];
  //   if (supplier.length > 0) {
  //     supplier.map((vendor) => {
  //       vendors = [
  //         ...vendors,
  //         {
  //           option: vendor._id,
  //           label: vendor.name,
  //         },
  //       ];
  //     });
  //     setVendor(vendors);
  //   }
  // }, [supplier]);
  // console.log(vendor)

  // console.log(vendor.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))

  return (
    <Fragment>
      {supplier?.length > 0 ? (
        <Select
          className="select"
          classNamePrefix="Select"
          defaultValue={supplier[0]}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          value={supplier[supplier.indexOf(supplier)]}
          isSearchable={true}
          name="supplier_code"
          onChange={handleOnchange}
          options={supplier}
        />
      ) : (
        <p>Loading...</p>
      )}

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

export default SelectSupplier;
