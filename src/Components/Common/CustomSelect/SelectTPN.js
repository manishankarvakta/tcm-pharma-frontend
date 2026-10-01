import { Fragment, useEffect, useState } from "react";

import Select from "react-select";
import { useTpnsQuery } from "../../../services/tpnApi";
import { signInUser } from "../../Utility/Auth";

const SelectTPN = ({ handleVendorChange }) => {
  const user = signInUser();
  const { aamarId } = user;
  // let [supplier, setSupplier] = useState([]);
  let [poDw, setPoDw] = useState([]);
  const { data, error, isLoading, isFetching, isSuccess } =
    useTpnsQuery(aamarId);
  // console.log(data);

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_URL}supplier`)
  //     .then((res) => res.json())
  //     .then((data) => setSupplier(data));
  // }, []);

  useEffect(() => {
    let poLists = [{ option: "no-TPNLists", label: "Select TPNLists" }];
    if (isSuccess) {
      if (data.length > 0) {
        data?.map((po) => {
          poLists = [
            ...poLists,
            {
              option: po._id,
              label: `${po.tpnNo} - ${po.total.toFixed(2)} BDT`,
            },
          ];
        });
        setPoDw(poLists);
      }
    }
  }, [data]);
  // console.log(vendor)

  // console.log(vendor.filter((sel) => sel?.option?.toString() === supplier_code?.toString()))
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#0c77bd" // Light gray on hover
        : "transparent", // Default background color
      color: "#000", // Black text color
      padding: "10px 15px", // Padding for better spacing
      borderRadius: "5px", // Rounded corners for the option
      transition: "background-color 0.3s ease", // Smooth transition for background color
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: "5px", // Rounded corners for the input box
      // boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle box shadow for the control
      width: "100%", // Set custom width
      maxWidth: "100%", // Ensure it doesn't exceed the available space
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px", // Rounded corners for the dropdown menu
    }),
  };
  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={poDw[poDw.indexOf(poDw)]}
        defaultValue={poDw[0]}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        // value={
        //   poNo !== ""
        //     ? poDw.filter((sel) => sel?.option?.toString() === poNo?.toString())
        //     : { option: 0, label: "Please Select a Purchase Order" }
        // }
        isSearchable={true}
        name="tpnNo"
        onChange={handleVendorChange}
        options={poDw}
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

export default SelectTPN;
