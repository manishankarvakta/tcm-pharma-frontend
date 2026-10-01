import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useWarehousesQuery } from "../../../services/warehouseApi";
import { signInUser } from "../../Utility/Auth";

const WareHouseDW = ({ warehouse, handleOnChange, name, value }) => {
  const auth = signInUser();
  const { aamarId } = auth;
  const { data, error, isLoading, isFetching, isSuccess } = useWarehousesQuery({
    aamarId,
  });
  let [warehouseOption, setWarehouseOption] = useState([]);

  useEffect(() => {
    let warehouseOptions = [{ option: "no-warehouse", label: "All Warehouse" }];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((warehouse) => {
          warehouseOptions = [
            ...warehouseOptions,
            {
              option: warehouse._id,
              label: `${warehouse.name}-[${warehouse.address}]`,
            },
          ];
        });
        setWarehouseOption(warehouseOptions);
      }
    }
  }, [data]);

  // Custom styles for react-select to remove green background and set hover color
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
      // width: "280px", // Set custom width
      // maxWidth: "100%", // Ensure it doesn't exceed the available space
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
        defaultValue={warehouseOption[0]}
        value={
          warehouse &&
          warehouseOption[
            warehouseOption.map((obj) => obj.option).indexOf(warehouse)
          ]
        }
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        name={name}
        onChange={handleOnChange}
        options={warehouseOption}
        placeholder="All Warehouse"
        styles={customStyles} // Apply custom styles
      />
    </Fragment>
  );
};

export default WareHouseDW;
