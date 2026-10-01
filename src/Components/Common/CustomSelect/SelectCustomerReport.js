import axios from "../../../services/apiClient";
import React, { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { selcetCustomer } from "../../../features/posSlice";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectCustomerReport = ({ onCustomerSelect }) => {
  const user = signInUser();
  const { aamarId } = user;
  const dispatch = useDispatch();
  const posSaleData = useSelector((state) => state.posReducer);

  const [selectedOption, setSelectedOption] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source()
  );
  const selectRef = useRef(null);

  useEffect(() => {
    if (posSaleData.customerId) {
      setSelectedOption({
        label: posSaleData.customerName,
        value: posSaleData.customerId,
      });
    } else {
      setSelectedOption(null);
    }
  }, [posSaleData.customerId, posSaleData.customerName]);

  const fetchData = async (inputValue) => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Canceling the previous request");
    }

    const newCancelTokenSource = axios.CancelToken.source();
    setCancelTokenSource(newCancelTokenSource);

    try {
      const searchVal = inputValue?.trim() || "all";
      const url = `${BASE_URL}/customer/search/${aamarId}/${searchVal}`;

      const result = await axios.get(url, {
        cancelToken: newCancelTokenSource.token,
      });

      if (result.data && result.data.length > 0) {
        return result.data.map((element) => ({
          label: `${element.name} - [ ${element.phone} ]`,
          value: element._id,
        }));
      } else {
        return [];
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
      const result = await axios.get(`${BASE_URL}/customer/select/${aamarId}/${id}`);
      
      const selectedCustomer = {
        customerId: result.data._id,
        point: result.data.point,
        name: result.data.name,
        phone: result.data.phone,
      };

      // Redux store update
      dispatch(selcetCustomer(selectedCustomer));

      // Pass selected customerId to parent
      if (onCustomerSelect) {
        onCustomerSelect(result.data._id);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const onSearchChange = (option) => {
    setSelectedOption(option);
    if (option) {
      getValue(option.value);
    } else {
      dispatch(selcetCustomer({ customerId: "", name: "", phone: "", point: 0 }));
      if (onCustomerSelect) {
        onCustomerSelect(null);
      }
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
      placeholder="Customer Select"
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

export default SelectCustomerReport;
