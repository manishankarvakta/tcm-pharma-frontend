import axios from "../../../services/apiClient";
import { Fragment, useEffect, useState } from "react";
import Select from "react-select";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectTpTpn = ({
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

  // console.log(selectCategory)
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
    // console.log(sc);
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

  useEffect(() => {
    getCategory(sc);
    setSelectCategory(scValue);
  }, [sc, scValue]);

  useEffect(() => {
    let priceList = [];
    if (category?.length) {
      category?.map((price) => {
        priceList = [
          ...priceList,
          {
            option: price._id,
            label: `${price?.tp}`,
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

  return (
    <div className="d-flex">
      <Fragment>
        <Select
          styles={customStyles}
          className="basic-single"
          classNamePrefix="select"
          defaultValue={{ option: 0, label: `${setVal}` }}
          value={
            selectCategory &&
            options[options.map((obj) => obj.option).indexOf(selectCategory)]
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
      {category?.length > 0 ? (
        <span>{category.length} Prices</span>
      ) : (
        <span>No Price</span>
      )}
    </div>
  );
};

export default SelectTpTpn;
