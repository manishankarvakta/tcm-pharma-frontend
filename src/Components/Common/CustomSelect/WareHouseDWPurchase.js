import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useWarehousesQuery } from "../../../services/warehouseApi";
import { signInUser } from "../../Utility/Auth";

const WareHouseDWPurchase = ({ wh, handleOnChange, name }) => {
  const auth = signInUser();
  const { aamarId, warehouse: defaultWarehouseId } = auth;

  const { data, isSuccess } = useWarehousesQuery({ aamarId });
  const [warehouseOption, setWarehouseOption] = useState([]);
  const [defaultOption, setDefaultOption] = useState(null);

  useEffect(() => {
    if (isSuccess && data) {
      const options = [
        { option: "allWh", label: "All Warehouse" },
        ...data.map((warehouse) => ({
          option: warehouse._id,
          label: `${warehouse.name} - [ ${warehouse.address} ]`,
        })),
      ];

      setWarehouseOption(options);

      // Set default warehouse based on the authenticated user's warehouse
      const defaultWarehouse = options.find(
        (option) => option.option === defaultWarehouseId
      );
      setDefaultOption(defaultWarehouse || options[0]);
    }
  }, [data, isSuccess, defaultWarehouseId]);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#0c77bd" : "transparent",
      color: "#000",
      padding: "10px 15px",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: "5px",
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px",
    }),
  };

  return (
    <Fragment>
      {warehouseOption.length > 0 ? (
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={defaultOption}
          value={warehouseOption.find((opt) => opt.option === wh)}
          isDisabled={false}
          isClearable={false}
          isSearchable={true}
          name={name}
          onChange={handleOnChange}
          options={warehouseOption}
          styles={customStyles}
        />
      ) : (
        <p>Loading...</p>
      )}
    </Fragment>
  );
};

export default WareHouseDWPurchase;
