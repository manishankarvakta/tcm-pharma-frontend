import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

import { useGroupDwQuery } from "../../services/groupApi";
import customStyles from "../Common/CustomSelect/CustomStyles";

const CustomergroupSelect = ({ handleSelectGroup, group, setValue }) => {
  const [customer, setCustomer] = useState([]);
  const { data, isSuccess } = useGroupDwQuery();

  useEffect(() => {
    const dw = [{ value: "no-Group", label: "Select Group" }];
    if (isSuccess && data.length > 0) {
      const groupOptions = data.map((user) => ({
        value: user?._id,
        label: user?.name,
      }));
      setCustomer([...dw, ...groupOptions]);
    }
  }, [data, isSuccess]);

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      setValue("group", selectedOption.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue("group", null, { shouldValidate: true, shouldDirty: true });
    }

    handleSelectGroup(selectedOption); // Call the parent callback if necessary
  };

  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        isClearable={true}
        value={customer.find((option) => option.value === group) || null}
        onChange={handleSelect} // Use handleSelect to update the group
        isSearchable={true}
        options={customer}
        styles={customStyles}
      />
    </Fragment>
  );
};

export default CustomergroupSelect;
