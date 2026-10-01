import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useBrandsNewQuery, useBrandsQuery } from "../../../services/brandApi";

const SelectBrandNew = ({ bn, handleOnchange }) => {
  const { data, error, isLoading, isFetching, isSuccess } = useBrandsQuery();
  let [brand, setBrand] = useState([]);

  // console.log(brand)
  // console.log(data)
  useEffect(() => {
    let brands = [];
    // let brands = [{ option: "no-brand", label: "Select brand" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((brand) => {
          brands = [
            ...brands,
            {
              option: brand._id,
              label: `${brand.name}`,
            },
          ];
        });
        setBrand(brands);
      }
    }
  }, [data, isSuccess]);

  // console.log(brand);
  // console.log(brand.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))
  // console.log(brand.indexOf(brand));
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select brand"
        defaultValue={brand[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        value={bn && brand[brand.map((obj) => obj.option).indexOf(bn)]}
        // value={brand[brand.indexOf(brand)]}
        isSearchable={true}
        name="brand"
        onChange={handleOnchange}
        options={brand}
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

export default SelectBrandNew;
