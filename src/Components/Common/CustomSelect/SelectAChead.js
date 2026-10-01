import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useMasterAccountheadsQuery } from "../../../services/accountHeadApi";
import customStyles from "./CustomStyles";
import { signInUser } from "../../Utility/Auth";

const SelectAChead = ({ mc, handleOnchange }) => {
  const auth = signInUser();
  const { aamarId } = auth;
  // const { data, error, isLoading, isFetching, isSuccess } = useAccountheadsMasterQuery();
  const { data, error, isLoading, isFetching, isSuccess } =
    useMasterAccountheadsQuery({aamarId});
  let [mcData, setMcData] = useState([]);

  // console.log(mc)
  // console.log(data)
  useEffect(() => {
    let mcs = [{ option: "no-master", label: "Select Master AccountHead" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((mc) => {
          mcs = [
            ...mcs,
            {
              option: mc._id,
              label: `${mc.name} - ${mc.code}`,
              code: mc.code,
            },
          ];
        });
        setMcData(mcs);
      }
    }
  }, [data]);

    // Handle clearing selection
    const handleClearSelection = () => {
      // When cleared, we can pass an empty value to the parent component
      handleOnchange(null);
    };

  // console.log(mcData);
  // console.log(mcData.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))
  // console.log(mcData.indexOf(mc));
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={mcData[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        // value={{"label":"test", "option":"20974827"}}
        value={mc && mcData[mcData.map((obj) => obj.option).indexOf(mc)]}
        isSearchable={true}
        name="mc"
        onChange={handleOnchange}
        onClear={handleClearSelection}
        options={mcData}
        styles={customStyles}
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

export default SelectAChead;
