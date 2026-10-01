import React, { Component, Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useMasterAccountheadsQuery } from "../../../services/accountHeadApi";
import { signInUser } from "../../Utility/Auth";

const SelectAccountHead = ({ handleOnchange }) => {
  const user = signInUser();
  const aamarId = user?.aamarId;
  const { data, error, isLoading, isFetching, isSuccess } =
    useMasterAccountheadsQuery({ aamarId }, { skip: !aamarId });
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
        { option: "no-accountHeads", label: "Select Account Head" },
        ...formattedAccountHeads,
      ]);
    }
  }, [data, isSuccess]);

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
        placeholder="Select Account Head"
        isDisabled={false}
        isLoading={isLoading || isFetching}
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

export default SelectAccountHead;

