import axios from "../../../services/apiClient";
import React, { Component } from "react";
import AsyncSelect from "react-select/async";
// import { useProductSearchQuery } from "../../../services/searchApi.tsx";
// import { supplierProducts } from "../../../features/supplierSlice";
// import { connect } from "react-redux";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// const dispatch = useDispatch();

class SelectProduct extends Component {
  constructor(props, context, dispatch) {
    super(props, context);
    this.state = {
      selectedOption: {},
      normalSelectOption: null,
      qString: null,
    };
  }
  result = [];
  searchProduct = async (e) => {};

  fetchData = async (inputValue, callback) => {
    this.setState({ qString: inputValue });

    let cancelToken;

    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }
    cancelToken = axios.CancelToken.source();
    this.result = await axios.get(`${BASE_URL}/product/search/${inputValue}`, {
      cancelToken: cancelToken.token,
    });

    // console.log("search product", this.result.data);

    let tempArray = [];
    if (this.result.data.length === 1) {
      // if get exact match
      if (this.state.qString !== null) {
        if (this.props.addToList(this.result.data[0], this.selectRef.current)) {
          this.setState({ qString: null });
          this.selectRef.current.focus();
          return;
        }
      }

      // const cartData = [{
      //   id: result.data[0]._id,
      //   order: cartData.length + 1,
      // },
      // ];
    } else if (this.result.data.length > 1) {
      // get match more than one
      // console.log(result.data);
      this.result.data.forEach((element) => {
        tempArray.push({
          label: `${element.name} - [ ${element.article_code} ] - ${element.priceList[0]?.mrp} BDT`,
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
    const result = await axios.get(`${BASE_URL}/product/details/${data}`, {
      cancelToken: cancelToken.token,
    });

    if (this.props.addToList(result.data) === false) {
      this.setState({ qString: null });
      this.selectRef.current.focus();
      return;
    }
  };

  onSearchChange = (selectedOption) => {
    if (selectedOption) {
      this.setState({
        selectedOption,
      });
      // console.log(selectedOption);
      this.getValue(selectedOption.value);
      // console.log(selectedOption);
    }
  };
  handleChange = (normalSelectOption) => {
    this.setState({ normalSelectOption });
  };

  selectRef = React.createRef();

  render() {
    return (
      <AsyncSelect
        // ref={this.props.searchField}
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
        ref={this.props.supplierProductsRef}
      />
    );
  }
}

// const mapDispatchProps = supplierProducts(this.state.selectedOption);
export default SelectProduct;
