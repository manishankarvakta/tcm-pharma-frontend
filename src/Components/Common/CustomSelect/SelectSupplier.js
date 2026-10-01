import axios from "../../../services/apiClient";
import { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
// AVLOSEF

const SelectSupplier = ({ sp, supplierProductsRef, handleOnchange }) => {
  const user = signInUser();
  const { aamarId } = user;
  const [selectedOption, setSelectedOption] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source()
  );
  const selectRef = useRef(null);

  const fetchData = async (inputValue) => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Canceling the previous request");
    }

    const newCancelTokenSource = axios.CancelToken.source();
    setCancelTokenSource(newCancelTokenSource);

    try {
      const result = await axios.get(
        `${BASE_URL}/supplier/0/20/${aamarId}?q=${inputValue}`,
        {
          cancelToken: newCancelTokenSource.token,
        }
      );

      console.log("search Supplier", result.data);

      if (result.data && Array.isArray(result.data)) {
        return result.data.map((element) => ({
          label: `${element.company}`,
          value: element._id,
          option: element._id,
        }));
      } else {
        return [
          {
            label: `Supplier not found`,
            value: `please select`,
            option: `please select`,
          },
        ];
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("fetchData error:", error);
      }
      return [];
    }
  };

  const fetchSupplierById = async (id) => {
    try {
      const result = await axios.get(`${BASE_URL}/supplier/po/${aamarId}/${id}`);
      if (result?.data && result.data.company) {
        setSelectedOption({
          label: `${result.data.company}`,
          value: result.data._id,
          option: result.data._id,
        });
      }
    } catch (error) {
      // handle error here
    }
  };

  useEffect(() => {
    if (sp) {
      if (selectedOption?.option !== sp && selectedOption?.value !== sp) {
        fetchSupplierById(sp);
      }
    } else {
      setSelectedOption(null);
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
      width: "100%", // Set custom width
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
      isClearable={true}
    />
  );
};

export default SelectSupplier;
