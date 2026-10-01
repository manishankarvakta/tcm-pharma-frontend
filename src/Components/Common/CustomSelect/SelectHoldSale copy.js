import React, { Component, Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useCustomerPagenationQuery } from "../../../services/customerApi";

const SelectHoldSale = ({ updateCartState }) => {
  let [holdOptions, setHoldOptions] = useState([]);

  // console.log(customer);
  const getHold = () => {
    const hold = JSON.parse(localStorage.getItem("hold_cart"));
    return hold;
  };

  useEffect(() => {
    const hold = getHold();
    let holdData = [];
    if (hold?.length > 0) {
      hold.map((hold, index) => {
        holdData = [
          ...holdData,
          {
            option: hold.order,
            label: `Hold-${index + 1}`,
          },
        ];
      });

      setHoldOptions(holdData);
    }
  }, [updateCartState]);

  const handleHoldSelect = async (e) => {
    const order = e.option;
    const hold = getHold();
    // const unHold = hold[index]
    // console.log("hold", hold)

    // if (index > -1) { // only splice array when item is found
    //   hold.splice(index, 1); // 2nd parameter means remove one item only
    //   localStorage.setItem("pos_cart", JSON.stringify([]));
    //   const holdCart = await JSON.parse(localStorage.getItem("hold_cart"));
    //   localStorage.setItem("pos_cart", JSON.stringify(unHold));
    //   localStorage.setItem("hold_cart", JSON.stringify(hold));
    //   // setHoldSale(false);
    //   updateCartState();
    //   // console.log("Reload Sale...!!", posSaleData.products);
    // }

    // const selected=hold.find()
  };
  // console.log(data);

  return (
    <Fragment>
      <Select
        menuPlacement="top"
        className="basic-single"
        classNamePrefix="select"
        defaultValue={holdOptions[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        onChange={(e) => handleHoldSelect(e)}
        // isRtl={isRtl}
        isSearchable={true}
        name="color"
        options={holdOptions}
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

export default SelectHoldSale;
