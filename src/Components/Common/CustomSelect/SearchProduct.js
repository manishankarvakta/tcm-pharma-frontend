import axios from "../../../services/apiClient";
import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import { signInUser } from "../../Utility/Auth";
const auth = signInUser();
const aamarId = auth?.aamarId;
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

class SelectProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: {},
      normalSelectOption: null,
    };
    this.selectRef = React.createRef();
    this.cancelTokenSource = null;
  }

  getValue = async (data) => {
    try {
      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel("Cancel the previous request");
      }
      this.cancelTokenSource = axios.CancelToken.source();

      const result = await axios.get(
        `${BASE_URL}/product/select/${aamarId}/${data}`,
        { cancelToken: this.cancelTokenSource.token }
      );

      console.log("selected from GET VALUE:", result);

      if (this.props.addToList) {
        this.props.addToList(result.data);
      }

      if (this.selectRef.current) {
        this.selectRef.current.focus();
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching product:", error);
      }
    }
  };

  fetchData = async (inputValue, callback) => {
    try {
      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel("Cancel the previous request");
      }
      this.cancelTokenSource = axios.CancelToken.source();

      const result = await axios.get(
        `${BASE_URL}/product/search/new/${aamarId}/${inputValue}`,
        { cancelToken: this.cancelTokenSource.token }
      );

      console.log(result.data);

      let tempArray = [];
      if (result.data.length === 1) {
        this.getValue(result.data[0]._id);
      } else if (result.data.length > 1) {
        tempArray = result.data.map((element) => ({
          label: `${element.name} - [ ${element.article_code} ]`,
          value: element._id,
        }));
      } else {
        tempArray.push({
          label: `Please Scan the Bar Code`,
          value: `please select`,
        });
      }

      callback(tempArray);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  onSearchChange = async (selectedOption) => {
    if (selectedOption) {
      this.setState({ selectedOption });
      await this.getValue(selectedOption.value);
    }
  };

  handleChange = (normalSelectOption) => {
    this.setState({ normalSelectOption });
  };

  render() {
    return (
      <AsyncSelect
        value={this.state.selectedOption}
        loadOptions={this.fetchData}
        placeholder="Product Search"
        key={this.fetchData}
        onChange={this.onSearchChange}
        defaultOptions={true}
        classNamePrefix="react-select"
        ref={this.selectRef}
      />
    );
  }
}

export default SelectProduct;
