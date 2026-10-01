import axios from "../../../services/apiClient";
import { useEffect, useState } from "react";
import Select from "react-select";
import { signInUser } from "../../Utility/Auth";
import { selectprocessedData } from "../../../features/importSlice";
import { useDispatch } from "react-redux";

// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectGenericImport = ({
  gene,
  article_code,
  generics,
  processedData,
}) => {
  const auth = signInUser();
  const { aamarId } = auth;
  const [selectedOption, setSelectedOption] = useState(null);
  const [genericOptions, setGenericOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(true);

  const dispatch = useDispatch();

  // Fetch all generics list
  useEffect(() => {
    // const fetchGenerics = async () => {
    try {
      // const result = await axios.get(`${BASE_URL}/generic/list/${aamarId}`);
      const options =
        generics?.map((element) => ({
          label: element.name,
          value: element._id,
        })) || [];

      setGenericOptions(options);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching generics:", error);
      setLoading(false);
    }
    // };

    // fetchGenerics();
  }, [aamarId]);

  // Fetch specific generic by name or ID
  useEffect(() => {
    if (gene) {
      // console.log(gene);

      const result = generics.find(
        (item) => item.name.toLowerCase() === gene.toLowerCase()
      );
      if (result) {
        setSelectedOption({
          label: `${result.name}`, // Display name with the ID in the label
          value: result._id,
        });
      } else {
        setSelectedOption({
          label: "Select Generic",
          value: "",
        });
        setMatched(false);
      }
    } else {
      // If no gene prop is passed, set default option from item.generic
      setSelectedOption({
        label: "Select Generic",
        value: "",
      });
    }
  }, [gene]);

  // Update Selected Value
  const setGroupHandler = ({ id, name }) => {
    const selected = processedData.find(
      (pro) => pro.article_code === article_code
    );
    // console.log("products", id, name);
    const rest = processedData.filter(
      (pro) => pro.article_code !== article_code
    );

    let products = [...rest, { ...selected, generic: id, genericName: name }];

    dispatch(selectprocessedData(products));
  };

  // Handle option change
  const handleSelectChange = (selected) => {
    setGroupHandler({ id: selected.value, name: selected.label });
    setSelectedOption(selected);
    // console.log("selected",selected)
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
        options={genericOptions}
        placeholder={loading ? "Loading Generics..." : "Select Generic"}
        onChange={handleSelectChange}
        isSearchable
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default SelectGenericImport;
