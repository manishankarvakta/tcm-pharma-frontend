import React, { Fragment } from "react";

import Select from "react-select";
import { useSelector } from "react-redux";

const SelectCustomer = ({
  handleOnchange,
  customersList,
  selectedCustomer,
}) => {
  // const customerSelect = useSelector((state) => state.SelcetCustomer);
  // console.log(selectedCustomer);
  const styles = {
    container: (base) => ({
      ...base,
      flex: 1,
    }),
  };
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={{
          label: "Walkway Customer",
          option: "62e301c1ee6c8940f6ac1515",
        }}
        value={
          customersList[
            customersList.map((obj) => obj.option).indexOf(selectedCustomer)
          ]
        }
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        onChange={handleOnchange}
        options={customersList}
        styles={styles}
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

export default SelectCustomer;
