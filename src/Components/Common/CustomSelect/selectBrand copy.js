import React, { Fragment, useEffect, useState } from "react";
import { useBrandsQuery } from "../../../services/brandApi";

import Select from "react-select";

const SelectBrand = ({ handleOnchange, brand }) => {
  const { data, error, isLoading, isFetching, isSuccess } = useBrandsQuery();
  let [brandData, setBrandData] = useState([]);

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
        setBrandData(mcs);
      }
    }
  }, [data]);

  // console.log(brand);
  // console.log(mcData.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))
  // console.log(mcData.indexOf(mc));
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={brandData[0]}
        value={
          brand && brandData[brandData.map((obj) => obj.option).indexOf(brand)]
        }
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        onChange={(e) => handleOnchange(e)}
        // name={name}
        options={brandData}
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

export default SelectBrand;
