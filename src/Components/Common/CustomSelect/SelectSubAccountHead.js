import React, { Component, Fragment, useEffect, useState } from "react";
import Select from "react-select";

const SelectSubAccountHead = ({ data, isSuccess, error, handleOnchange }) => {
  let [accountHead, setAccountHead] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    if (isSuccess && data) {
      const formattedAccountHeads = data.map((item) => ({
        option: item?._id,
        label: `${item?.name} - ( ${item?.code} )`,
        code: item?.code,
      }));
      setAccountHead([
        { option: "no-accountHeads", label: "Select Sub Account Head" },
        ...formattedAccountHeads,
      ]);
    } else {
        setAccountHead([
            { option: "no-accountHeads", label: "Select Sub Account Head" },
        ]);
    }
  }, [data, isSuccess]);

  // Reset selection when options change (new Master Account Head selected)
  useEffect(() => {
    setSelectedValue(null);
  }, [data]);

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    if (handleOnchange) {
      handleOnchange(selectedOption);
    }
  };

  return (
    <Fragment>
      <Select
        className="select"
        classNamePrefix="Select AccountHead"
        placeholder="Select Sub Account Head"
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        value={selectedValue}
        isSearchable={true}
        name="accountHead_code"
        onChange={handleChange}
        options={accountHead}
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

export default SelectSubAccountHead;

