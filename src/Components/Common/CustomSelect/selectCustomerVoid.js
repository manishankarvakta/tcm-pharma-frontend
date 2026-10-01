import axios from "../../../services/apiClient";
import React, { Component } from "react";
import AsyncSelect from "react-select/async";
// import { useProductSearchQuery } from "../../../services/searchApi.tsx";
import { connect } from "react-redux";
import { selcetVoidCustomer } from "../../../features/voidSlice";
import { signInUser } from "../../Utility/Auth";

// import { connect } from "react-redux";
// console.log(this.props.posSaleData);

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
// const dispatch = useDispatch();

class SelectCustomerVoid extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedOption: {
        label: this.props.posSaleData.customerName,
        option: this.props.posSaleData.customerId,
      },
      normalSelectOption: null,
    };
  }

  // posSaleData = useSelector((state) => state.posReducer);
  // dispatch = useDispatch();
  // mapStateToProps = (state) => ({
  //   selectedCustomer: state.posSaleData.selectedCustomer,
  // });

  fetchData = async (inputValue, callback) => {
    // console.log(this.state);
    const user = signInUser();
    const aamarId = user?.aamarId;
    let cancelToken;
    // console.log(inputValue);

    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }

    cancelToken = axios.CancelToken.source();
    const result = await axios.get(
      `${BASE_URL}/customer/search/${aamarId}/${inputValue}`,
      {
        cancelToken: cancelToken.token,
      }
    );

    // console.log(result.data);
    let tempArray = [];

    if (result.data.length > 0) {
      // get match more than one
      result.data.forEach((element) => {
        tempArray.push({
          label: `${element.name} - [ ${element.phone} ]`,
          value: element._id,
        });
      });
    } else {
      tempArray.push({
        label: this.props.posSaleData.customerName,
        option: this.props.posSaleData.customerId,
      });
    }
    callback(tempArray);
  };

  getValue = async (data) => {
    const user = signInUser();
    const aamarId = user?.aamarId;
    let cancelToken;

    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }

    cancelToken = axios.CancelToken.source();
    const result = await axios.get(
      `${BASE_URL}/customer/select/${aamarId}/${data}`,
      {
        cancelToken: cancelToken.token,
      }
    );

    // console.log("selected:", result.data);
    const customerData = {
      customerId: result.data._id,
      point: result.data.point,
      name: result.data.name,
      phone: result.data.phone,
    };
    this.props.selcetVoidCustomer({
      customerId: result.data._id,
      point: result.data.point,
      name: result.data.name,
      phone: result.data.phone,
    });

    // this.dispatch.selcetCustomer();
    // if (this.props.addToList(result.data) === false) {
    //   this.selectRef.current.focus();
    // }
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
  // handleChange = (normalSelectOption) => {
  //   this.setState({ normalSelectOption });
  //   console.log(this.state.normalSelectOption);
  // };

  selectRef = React.createRef();

  render() {
    return (
      <AsyncSelect
        value={{
          label: this.props.posSaleData.customerName,
          option: this.props.posSaleData.customerId,
        }}
        loadOptions={this.fetchData}
        placeholder="Customer Select"
        key={this.fetchData}
        onChange={(e) => {
          this.onSearchChange(e);
        }}
        defaultOptions={{
          label: this.props.posSaleData.customerName,
          option: this.props.posSaleData.customerId,
        }}
        className="basic-single"
        classNamePrefix="select"
        // classNamePrefix="react-select"
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        innerRef={this.selectRef}
        // ref={this.props.supplierProductsRef}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selcetVoidCustomer: (payload) => dispatch(selcetVoidCustomer(payload)),
  };
};
const mapStateToProps = (state) => ({
  posSaleData: state.voidReducer, // a "state" prop is available in the component which points to redux state,
});

// const mapDispatchProps = supplierProducts(this.state.selectedOption);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(SelectCustomerVoid);
// export default SelectCustomerVoid;
