import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useWarehousesQuery } from "../../../services/warehouseApi";
import { signInUser } from "../../Utility/Auth";

const WareHouseDWUser = ({ warehouse, handleOnChange, name }) => {
  const auth = signInUser();
  const { aamarId } = auth;
  const { data, error, isLoading, isFetching, isSuccess } = useWarehousesQuery({
    aamarId,
  });
  let [warehouseOption, setWarehouseOption] = useState([]);
   const customStyles = {
     option: (provided, state) => ({
       ...provided,
       backgroundColor: state.isFocused
         ? "#0d6efd" // Background color on hover
         : state.isSelected
         ? "#fff" // Background color when selected (red)
         : "transparent", // Default background color
       color: state.isFocused
         ? "#fff" // White text color on hover
         : state.isSelected
         ? "#000" // White text color when selected
         : "#000", // Default black text color
       padding: "10px 15px", // Padding for better spacing

       transition: "background-color 0.2s ease, color 0.2s ease", // Smooth transition for background and text color
     }),
     control: (provided) => ({
       ...provided,

       // Optional: Customize the input control here
     }),
     menu: (provided) => ({
       ...provided,
       borderRadius: "5px", // Rounded corners for the dropdown menu
       color: "#000", // Black text color

       // High z-index to ensure it appears above other elements
       // Ensure proper stacking context
     }),
   };

  // console.log(warehouse)
  useEffect(() => {
    let warehouseOptions = [
      { option: "no-warehouse", label: "Select Warehouse" },
    ];
    if (isSuccess) {
      if (data.length > 0) {
        data.map((warehouse) => {
          warehouseOptions = [
            ...warehouseOptions,
            {
              option: warehouse._id,
              label: `${warehouse.name} - [ ${warehouse.address} ]`,
            },
          ];
        });
        setWarehouseOption(warehouseOptions);
      }
    }
  }, [data]);

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
        styles={customStyles}
      />
    </Fragment>
  );
};

export default WareHouseDWUser;
