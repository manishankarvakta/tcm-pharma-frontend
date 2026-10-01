import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useMasterCategoryQuery } from "../../../services/categoryApi";

const SelectCategory = ({ cat, handleOnchange }) => {
  const { data, error, isLoading, isFetching, isSuccess } =
    useMasterCategoryQuery();
  let [category, setCategory] = useState([]);

  // console.log(category)
  // console.log(data)
  useEffect(() => {
    let categorys = [];
    // let categorys = [{ option: "no-category", label: "Select category" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((category) => {
          categorys = [
            ...categorys,
            {
              option: category._id,
              label: `${category.name}`,
              code: category.mcId,
            },
          ];
        });
        setCategory(categorys);
      }
    }
  }, [data, isSuccess]);

  // console.log(category);
  // console.log(category.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))
  // console.log(category.indexOf(category));
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select category"
        defaultValue={category[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        value={cat && category[category.map((obj) => obj.option).indexOf(cat)]}
        // value={category[category.indexOf(category)]}
        isSearchable={true}
        name="category"
        onChange={handleOnchange}
        options={category}
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

export default SelectCategory;
