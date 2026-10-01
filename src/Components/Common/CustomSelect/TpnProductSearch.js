import axios from "../../../services/apiClient";
import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

class TpnProductSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: {},
      normalSelectOption: null,
      qString: null,
      aamarId: null, // Store aamarId in state
      isLoading: true, // Loading state
    };
    this.selectRef = React.createRef();
  }

  componentDidMount() {
    const auth = signInUser();
    if (auth?.aamarId) {
      this.setState({ aamarId: auth.aamarId, isLoading: false });
    } else {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // If aamarId updates and there's a previous search query, refetch data
    if (prevState.aamarId !== this.state.aamarId && this.state.qString) {
      this.fetchData(this.state.qString, () => {});
    }
  }

  fetchData = async (inputValue, callback) => {
    this.setState({ qString: inputValue });

    if (!this.state.aamarId) {
      console.log("Waiting for aamarId...");
      return;
    }

    let cancelToken;
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }
    cancelToken = axios.CancelToken.source();

    try {
      const response = await axios.get(
        `${BASE_URL}/product/search/supplier/${this.state.aamarId}/${inputValue}`,
        { cancelToken: cancelToken.token }
      );
      console.log("Search Results:", response.data);

      let tempArray =
        response.data.length > 0
          ? response.data.map((element) => ({
              label: `${element.name} - ${element?.group?.name} - ${element.mrp} BDT`,
              value: element._id,
            }))
          : [{ label: `Please Scan the Bar Code`, value: `please select` }];

      callback(tempArray);
    } catch (error) {
      console.error("Error fetching products:", error);
      callback([{ label: "Error fetching products", value: "error" }]);
    }
  };

  getValue = async (data) => {
    let cancelToken;

    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }

    cancelToken = axios.CancelToken.source();
    try {
      const result = await axios.get(
        `${BASE_URL}/product/details/new/${data}`,
        {
          cancelToken: cancelToken.token,
        }
      );

      if (this.props.addToList(result.data) === false) {
        this.setState({ qString: null });
        this.selectRef.current.focus();
        return;
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  onSearchChange = (selectedOption) => {
    if (selectedOption) {
      this.setState({ selectedOption });
      this.getValue(selectedOption.value);
    }
  };

  handleChange = (normalSelectOption) => {
    this.setState({ normalSelectOption });
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>; // Show loading until aamarId is available
    }

    return (
      <AsyncSelect
        value={this.state.selectedOption}
        loadOptions={this.fetchData}
        placeholder="Product Search"
        onChange={(e) => this.onSearchChange(e)}
        defaultOptions
        classNamePrefix="react-select"
        innerRef={this.selectRef}
        ref={this.props.tpnProductsRef}
      />
    );
  }
}

export default TpnProductSearch;
