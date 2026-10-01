import axios from "../../../services/apiClient";
import { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
// AVLOSEF

const SelectSupplierPo = ({ sp, supplierProductsRef, handleOnchange }) => {
  const auth = signInUser();
  const { aamarId } = auth;
  const [selectedOption, setSelectedOption] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source()
  );
  const selectRef = useRef(null);

  const fetchData = async (inputValue, callback) => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Canceling the previous request");
    }

    const newCancelTokenSource = axios.CancelToken.source();
    setCancelTokenSource(newCancelTokenSource);

    try {
      const result = await axios.get(
        `${BASE_URL}/supplier/search/${aamarId}/${inputValue}`,
        {
          cancelToken: newCancelTokenSource.token,
        }
      );

      // console.log("search Supplier", result);

      let tempArray = [];
      if (result.data.length > 0) {
        result.data.forEach((element) => {
          tempArray.push({
            label: `${element.company}`,
            option: element._id,
          });
        });
      } else {
        tempArray.push({
          label: `Please Search Supplier Company`,
          option: `please select`,
        });
      }

      // console.log("tempArray:", tempArray);
      callback(tempArray);
    } catch (error) {
      if (!axios.isCancel(error)) {
        // handle error here
      }
    }
  };

  const fetchSupplierById = async (id) => {
    try {
      const result = await axios.get(`${BASE_URL}/supplier/${id}`);
      setSelectedOption({
        label: `${result.data.company}`,
        option: result.data._id,
      });
    } catch (error) {
      // handle error here
    }
  };

  useEffect(() => {
    if (sp) {
      fetchSupplierById(sp);
    }

    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Canceling on unmount");
      }
    };
  }, [sp]);

  const onSearchChange = (option) => {
    // console.log("Selected", option.e);
    setSelectedOption(option);
    handleOnchange(option);
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
      // Set custom width
      maxWidth: "100%", // Ensure it doesn't exceed the available space
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px", // Rounded corners for the dropdown menu
    }),
  };
  return (
    <AsyncSelect
      value={selectedOption}
      loadOptions={fetchData}
      placeholder="Supplier Search"
      onChange={onSearchChange}
      defaultOptions={true}
      classNamePrefix="react-select"
      innerRef={selectRef}
      ref={supplierProductsRef}
      styles={customStyles}
    />
  );
};

export default SelectSupplierPo;
