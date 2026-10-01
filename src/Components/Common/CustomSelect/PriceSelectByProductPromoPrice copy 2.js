import axios from "../../../services/apiClient";
import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useProductDetailsQuery } from "../../../services/productApi";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const PriceSelectByProductPromoPrice = ({
  sc,
  setVal,
  handleOnChangeCategory,
  name,
  scValue,
  customPrice,
  pp,
}) => {
  let [category, setCategory] = useState([]);
  let [selectCategory, setSelectCategory] = useState([]);
  let [options, setOptions] = useState([]);
  let [defaultValue, setDefaultValue] = useState({});
  // console.log(category);
  // console.log("pp", pp)

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
        // console.log(result?.data);
      } else {
        setCategory([]);
      }
    } else {
      setCategory([]);
      // result = [{option: "0", label: "No Price"}];
    }
  };

  // console.log("price option", defaultValue);

  useEffect(() => {
    getCategory(sc);
    setSelectCategory(scValue);
  }, [sc, scValue]);
  // console.log(scValue)

  // const localCart = JSON.parse(localStorage.getItem("pos_cart"));

  // console.log(localCart, category);

  useEffect(() => {
    let categories = [];
    // console.log("category", category);
    if (category.length) {
      category.map((price) => {
        categories = [
          ...categories,
          {
            id: price._id,
            option: price.mrp,
            label: `${price?.mrp} BDT`,
          },
        ];
      });
      setOptions(categories);
      // setDefaultValue(categories[0]);
    } else {
      setOptions({ option: "0", label: "No Price" });
      // setDefaultValue(categories[0]);
    }
  }, [category]);

  // console.log(options[0]);
  return (
    <Fragment>
      <Select
        styles={customStyles}
        className="basic-single"
        classNamePrefix="select"
        defaultValue={pp}
        value={
          selectCategory &&
          options[options.map((obj) => obj.option).indexOf(selectCategory)]
        }
        // value={
        //     selectCategory &&
        //     options[options.map((obj) => obj.option).indexOf(selectCategory)]
        // }
        // value={
        //     pp !== undefined && pp
        // }
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isSearchable={true}
        onChange={(e) => handleOnChangeCategory(e)}
        name={name}
        options={options}
      />
    </Fragment>
  );
};

export default PriceSelectByProductPromoPrice;
