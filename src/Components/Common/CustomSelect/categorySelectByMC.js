import axios from "../../../services/apiClient";
import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
const auth = signInUser();
const aamarId = auth?.aamarId;

const CategorySelectByMC = ({ sc, handleOnChangeCategory, name, scValue }) => {
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState(scValue || "All");
  const [options, setOptions] = useState([]);

  const getCategory = async (sc) => {
    let cancelToken;
    let result;

    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }

    cancelToken = axios.CancelToken.source();
    result = await axios.get(`${BASE_URL}/group${sc ? `/mc/${sc}` : ""}`, {
      cancelToken: cancelToken.token,
    });

    setCategory(result.data);
  };

  useEffect(() => {
    getCategory(sc);
    setSelectCategory(scValue || "All");
  }, [sc, scValue]);

  useEffect(() => {
    let categories = [{ option: "All", label: "All Group Select" }];
    if (category?.length) {
      categories = [
        ...categories,
        ...category.map((vendor) => ({
          option: vendor._id,
          label: `${vendor?.name} - ${vendor.code}`,
        })),
      ];
    }
    setOptions(categories);
  }, [category]);

  const handleChange = (selectedOption) => {
    setSelectCategory(selectedOption.option);
    handleOnChangeCategory(selectedOption);
  };
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
      // width: "200px", // Set custom width
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
        value={options.find((opt) => opt.option === selectCategory)}
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        onChange={handleChange}
        name={name}
        options={options}
        styles={customStyles}
      />
    </Fragment>
  );
};

export default CategorySelectByMC;
