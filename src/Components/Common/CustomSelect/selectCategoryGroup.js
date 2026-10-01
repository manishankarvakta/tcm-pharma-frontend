import { Fragment } from "react";

import Select from "react-select";

const SelectCategoryGroup = ({ mg, handleOnchange }) => {
  const mcData = [
    { option: "no", label: "No Group" },
    { option: "food", label: "Food" },
    { option: "personalCare", label: "Personal Care" },
    { option: "hygiene", label: "Hygiene" },
    { option: "beauty", label: "Beauty & Health" },
    { option: "babyCare", label: "Baby Care" },
    { option: "clean", label: "Clean & Supplies" },
    { option: "home", label: "Home & Kitchen" },
    { option: "stationeries", label: "Stationeries" },
    { option: "toys", label: "Toys" },
    { option: "lifeStyle", label: "Life Style" },
  ];

  // console.log(mcData[mcData.indexOf(mg)]);

  // console.log(mcData.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))

  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={mcData[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        value={mcData[mcData.indexOf(mg)]}
        isSearchable={true}
        name="mc"
        onChange={handleOnchange}
        options={mcData}
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

export default SelectCategoryGroup;
