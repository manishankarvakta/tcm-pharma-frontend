import React, { Fragment, useEffect, useState } from "react";
import { useMasterCategoryQuery } from "../../../services/categoryApi";

import Select from "react-select";

const SelectMC = ({ mc, handleOnchange }) => {
  const { data, error, isLoading, isFetching, isSuccess } =
    useMasterCategoryQuery();
  let [mcData, setMcData] = useState([]);

  // console.log(mc)
  // console.log(data)
  useEffect(() => {
    let mcs = [{ option: "no-master", label: "Select Master Category" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((mc) => {
          mcs = [
            ...mcs,
            {
              option: mc._id,
              label: `${mc.name} - ${mc.mcId}`,
            },
          ];
        });
        setMcData(mcs);
      }
    }
  }, [data]);

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

export default SelectMC;
