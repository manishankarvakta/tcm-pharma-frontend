import axios from "../../../services/apiClient";
import { Fragment, useEffect, useState } from "react";
import Select from "react-select";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectPriceGrn = ({
  sc,
  setVal,
  handleOnChangeCategory,
  name,
  scValue,
  customPrice,
}) => {
  let [category, setCategory] = useState([]);
  let [selectCategory, setSelectCategory] = useState([]);
  let [options, setOptions] = useState([]);
  let [defaultValue, setDefaultValue] = useState({});
  // console.log(scValue);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "30px",
      height: "30px",
      alignItems: "center",
      fontSize: "15px",
      alignContent: "space-around",
    }),
  };

  const getCategory = async (sc) => {
    let cancelToken;
    let result;

    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Cancel The Previous Request");
    }

    cancelToken = axios.CancelToken.source();

    if (sc) {
      result = await axios.get(`${BASE_URL}/price/product/${sc}`, {
        cancelToken: cancelToken.token,
      });
      if (result?.data) {
        setCategory(result.data);
      } else {
        setCategory([]);
      }
    } else {
      setCategory([]);
      // result = [{option: "0", label: "No Price"}];
    }
  };

  //   console.log(category);

  // console.log("price option", defaultValue);

  useEffect(() => {
    getCategory(sc);
    setSelectCategory(scValue);
  }, [sc, scValue]);
  // console.log(scValue)

  // const localCart = JSON.parse(localStorage.getItem("pos_cart"));

  //   console.log(category);

  useEffect(() => {
    let priceList = [];
    if (category?.length) {
      category?.map((price) => {
        priceList = [
          ...priceList,
          {
            option: price._id,
            label: price?.mrp,
          },
        ];
      });
      setOptions(priceList);
      setDefaultValue(priceList[0]);
    } else {
      setOptions({ option: "0", label: "No Price" });
      setDefaultValue(priceList[0]);
    }
  }, [category]);

  // console.log(options[0]);
  return (
    <Fragment>
      <Select
        styles={customStyles}
        className="basic-single"
        classNamePrefix="select"
        defaultValue={{ option: 0, label: `${setVal}` }}
        value={
          selectCategory ?
            options[options.map((obj) => obj.option).indexOf(selectCategory)] : { option: 0, label: `${setVal}` }
        }
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        onChange={(e) => handleOnChangeCategory(sc, e)}
        name={name}
        options={options}
      />
    </Fragment>
  );
};

export default SelectPriceGrn;
