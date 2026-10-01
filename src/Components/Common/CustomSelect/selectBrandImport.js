import axios from "../../../services/apiClient";
import { useEffect, useState } from "react";
import Select from "react-select";
import { signInUser } from "../../Utility/Auth";
import { selectName, selectprocessedData } from "../../../features/importSlice";
import { useDispatch } from "react-redux";

// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectBrandImport = ({ bn, brands, article_code, processedData }) => {
  const auth = signInUser();
  const { aamarId } = auth;
  const [selectedOption, setSelectedOption] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    // const fetchBrands = async () => {
    try {
      // const result = await axios.get(`${BASE_URL}/brand/list/${aamarId}`);
      const options =
        brands?.map((element) => ({
          label: element.name,
          value: element._id,
        })) || [];

      setBrandOptions(options);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setLoading(false);
    }
    // };

    // fetchBrands();
  }, [brands]);

  // console.log(brands);

  useEffect(() => {
    if (bn) {
      // const fetchBrandById = async () => {
      const result = brands?.find(
        (item) => item?.name.toLowerCase() === bn.toLowerCase()
      );
      // console.log(result);

      if (!result) {
        setMatched(false);
        setSelectedOption({
          label: "Select Brand",
          value: "",
        });
      } else {
        setSelectedOption({
          label: `${result?.name}`,
          value: result?._id,
        });
      }

      // };
      // fetchBrandById();
    } else {
      setMatched(false);
      setSelectedOption({
        label: "Select Brand",
        value: "",
      });
    }
  }, [bn]);

  // Update Selected Value
  const setBrandHandler = ({ id, name }) => {
    const selected = processedData?.find(
      (pro) => pro.article_code === article_code
    );
    // console.log("products", selected, name);
    const rest = processedData?.filter(
      (pro) => pro.article_code !== article_code
    );

    let products = [
      ...rest,
      {
        ...selected,
        name: `${name} ${selected.size}`,
        brand: id,
        brandName: name,
      },
    ];

    // dispatch(selectName({ name, id }));
    dispatch(selectprocessedData(products));
  };

  const handleSelectChange = (selected) => {
    setBrandHandler({ id: selected.value, name: selected.label });
    setSelectedOption(selected);
  };

  const customStyles = {
    singleValue: (provided, state) => ({
      ...provided,
      color: state.selectProps.matched ? "red" : "black", // Apply color based on 'matched'
    }),
    // Change the border color of the select box
    control: (provided, state) => ({
      ...provided,
      borderColor: state.selectProps.matched ? "red" : "gray", // Conditional border color
      boxShadow: state.isFocused ? "0 0 0 1px red" : "none",
      // "&:hover": {
      //   borderColor: state.selectProps.matched ? "red" : "gray",
      // },
    }),

    // Change the placeholder text color
    placeholder: (provided, state) => ({
      ...provided,
      color: state.selectProps.matched ? "red" : "gray", // Conditional placeholder color
    }),
  };

  return (
    <div>
      <Select
        styles={customStyles}
        matched={!matched}
        value={selectedOption}
        options={brandOptions}
        placeholder={loading ? "Loading Brands..." : "Select Brand"}
        onChange={handleSelectChange}
        isSearchable
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default SelectBrandImport;
