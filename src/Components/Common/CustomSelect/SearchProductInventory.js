import axios from "../../../services/apiClient";
import React, { Component } from "react";
import AsyncSelect from "react-select/async";
// import { useProductSearchQuery } from "../../../services/searchApi.tsx";
// import { supplierProducts } from "../../../features/supplierSlice";
// import { connect } from "react-redux";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// const dispatch = useDispatch();

class SelectProduct extends Component {
  constructor(props, context, selectRef, dispatch) {
    super(props, context);
    this.state = {
      selectedOption: {},
      normalSelectOption: null,
    };
  }

  fetchData = async (inputValue, callback) => {
    let cancelToken;

    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }

    cancelToken = axios.CancelToken.source();
    const result = await axios.get(
      `${BASE_URL}/product/search/inventory/${inputValue}`,
      {
        cancelToken: cancelToken.token,
      }
    );
    // let cartData = [];
    // const localData = await localStorage.getItem("supplier_cart");
    // cartData = [JSON.parse(localData)];

    // console.log(result.data);
    let tempArray = [];
    if (result.data.length === 1) {
      // if get exact match
      this.props.addToList(result.data[0], this.selectRef.current);

      // const cartData = [{
      //   id: result.data[0]._id,
      //   order: cartData.length + 1,
      // },
      // ];
    } else if (result.data.length > 1) {
      // get match more than one
      result.data.forEach((element) => {
        tempArray.push({
          label: `${element.name} - [ ${element.article_code} ]`,
          value: element._id,
        });
      });
    } else {
      tempArray.push({
        label: `Please Scan the Bar Code`,
        value: `please select`,
      });
    }
    callback(tempArray);
  };

  getValue = async (data) => {
    let cancelToken;

    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }

    cancelToken = axios.CancelToken.source();
    const result = await axios.get(
      `${BASE_URL}/product/select/inventory/${data}`,
      {
        cancelToken: cancelToken.token,
      }
    );

    // console.log("selected:", result);

    if (this.props.addToList(result.data) === false) {
      this.selectRef.current.focus();
    }
  };

  onSearchChange = (selectedOption) => {
    if (selectedOption) {
      this.setState({
        selectedOption,
      });
      // console.log(selectedOption);
      this.getValue(selectedOption.value);
    }
  };
  handleChange = (normalSelectOption) => {
    this.setState({ normalSelectOption });
  };

  selectRef = React.createRef();

  render() {
    return (
      <AsyncSelect
        value={this.state.selectedOption}
        loadOptions={this.fetchData}
        placeholder="Product Search"
        key={this.fetchData}
        onChange={(e) => {
          this.onSearchChange(e);
        }}
        defaultOptions={true}
        classNamePrefix="react-select"
        innerRef={this.selectRef}
        ref={this.props.selectRef}
      />
    );
  }
}

// const mapDispatchProps = supplierProducts(this.state.selectedOption);
export default SelectProduct;
