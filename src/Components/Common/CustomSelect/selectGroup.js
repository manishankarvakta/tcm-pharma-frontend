import axios from "../../../services/apiClient";
import { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
// AVLOSEF

const SelectGeneric = ({ gp, groupRef, handleOnchange }) => {
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
        `${BASE_URL}/group/search/${aamarId}/${inputValue}`,
        {
          cancelToken: newCancelTokenSource.token,
        }
      );

      // console.log("search Group", result.data);

      let tempArray = [];
      if (result.data.length > 0) {
        result.data.forEach((element) => {
          tempArray.push({
            label: `${element.name}`,
            value: element._id,
          });
        });
      } else {
        tempArray.push({
          label: `Please Search Group Name`,
          value: `please select`,
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

  const fetchGenericById = async (id) => {
    // console.log(id);
    try {
      const result = await axios.get(`${BASE_URL}/group/${id}`);
      setSelectedOption({
        label: `${result.data.name}`,
        value: result.data._id,
      });
    } catch (error) {
      // handle error here
    }
  };

  useEffect(() => {
    if (gp) {
      fetchGenericById(gp);
    }

    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Canceling on unmount");
      }
    };
  }, [gp]);

  const onSearchChange = (option) => {
    // console.log("Selected", option.e);
    setSelectedOption(option);
    handleOnchange(option);
  };

  return (
    <AsyncSelect
      value={selectedOption}
      loadOptions={fetchData}
      placeholder="Group Search"
      onChange={onSearchChange}
      defaultOptions={true}
      classNamePrefix="react-select"
      innerRef={selectRef}
      ref={groupRef}
    />
  );
};

export default SelectGeneric;
