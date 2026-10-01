import axios from "../../../services/apiClient";
import { useEffect, useState } from "react";
import Select from "react-select";
import { signInUser } from "../../Utility/Auth";
import { useDispatch } from "react-redux";
import { selectprocessedData } from "../../../features/importSlice";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectUnitImport = ({ ut, article_code, processedData, units }) => {
  const auth = signInUser();
  const { aamarId } = auth;
  const [selectedOption, setSelectedOption] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(true);

  const dispatch = useDispatch();

  // Fetch all unit list
  useEffect(() => {
    const options =
      units?.map((unit) => ({
        label: unit.name,
        value: unit._id,
      })) || [];

    setUnitOptions(options);
    setLoading(false);
  }, [units]);

  // Fetch specific unit by name or ID
  useEffect(() => {
    if (ut) {
      const result = units.find(
        (u) => u.name.toLowerCase() === ut.toLowerCase()
      );

      if (result) {
        setSelectedOption({
          label: `${result?.name}`, // Display name with the ID in the label
          value: result?._id,
        });
      } else {
        setMatched(false);
        setSelectedOption({
          label: "Select Unit",
          value: "",
        });
      }
    } else {
      setMatched(false);
      // If no unit prop is passed, set default option from item.unit
      setSelectedOption({
        label: "Select Unit",
        value: "",
      });
    }
  }, [ut]);

  // Update Selected Value
  const setBrandHandler = (name) => {
    const selected = processedData?.find(
      (pro) => pro.article_code === article_code
    );
    console.log("products", selected, name);
    const rest = processedData?.filter(
      (pro) => pro.article_code !== article_code
    );

    let products = [
      ...rest,
      {
        ...selected,
        unit: name,
      },
    ];

    // dispatch(selectName({ name, id }));
    dispatch(selectprocessedData(products));
  };

  // Handle option change
  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    setBrandHandler(selected.label);
    // handleOnchange(selected.value); // Pass the selected option to the parent
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
        options={unitOptions}
        placeholder={loading ? "Loading Units..." : "Select Unit"}
        onChange={handleSelectChange}
        isSearchable
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default SelectUnitImport;
