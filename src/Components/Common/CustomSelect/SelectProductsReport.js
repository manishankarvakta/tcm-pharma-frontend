import axios from "../../../services/apiClient";
import React, { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectProductsReport = ({ onProductSelect, addToList }) => {
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
      const searchVal = inputValue?.trim() || "all";
      const url = `${BASE_URL}/product/search/new/${aamarId}/${searchVal}`;

      const result = await axios.get(url, {
        cancelToken: newCancelTokenSource.token,
      });

      if (result.data && result.data.length > 0) {
        return result.data.map((element) => ({
          label: `${element.name} - [ ${element.article_code} ]`,
          value: element._id,
        }));
      } else {
        return [{
          label: "Product not found",
          value: "no-product",
        }];
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("fetchData error:", error);
      }
      return [];
    }
  };

  const getValue = async (id) => {
    try {
      const result = await axios.get(`${BASE_URL}/product/select/${aamarId}/${id}`);
      const product = Array.isArray(result.data) ? result.data[0] : result.data;

      if (product) {
        if (addToList) {
          addToList(product);
        }
        if (onProductSelect) {
          onProductSelect({
            id: product._id,
            article_code: product.article_code,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const onSearchChange = (option) => {
    setSelectedOption(option);
    if (option && option.value !== "no-product") {
      getValue(option.value);
    }
  };

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
      maxWidth: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px",
    }),
  };

  return (
    <AsyncSelect
      value={selectedOption}
      loadOptions={fetchData}
      placeholder="Product Search"
      onChange={onSearchChange}
      defaultOptions={true}
      classNamePrefix="react-select"
      innerRef={selectRef}
      styles={customStyles}
      isClearable={true}
      isSearchable={true}
    />
  );
};

export default SelectProductsReport;
