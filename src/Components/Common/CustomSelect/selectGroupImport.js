import axios from "../../../services/apiClient";
import { useEffect, useState } from "react";
import Select from "react-select";
import { signInUser } from "../../Utility/Auth";
import { useDispatch } from "react-redux";
import { selectprocessedData } from "../../../features/importSlice";

// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectGroupImport = ({ group, processedData, groups, article_code }) => {
  const auth = signInUser();
  const { aamarId } = auth || {}; // Ensure aamarId exists
  const dispatch = useDispatch();

  // console.log(processedData);
  const [selectedOption, setSelectedOption] = useState(null);
  const [groupOptions, setGroupOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(true);
  //

  // Fetch all groups list
  useEffect(() => {
    if (!aamarId) return; // Prevent API call if aamarId is missing

    // const fetchGroups = async () => {
    // try {
    // const result = await axios.get(`${BASE_URL}/group/list/${aamarId}`);
    let options =
      groups?.map((element) => ({
        label: element.name,
        value: element._id,
      })) || [];

    // console.log("options", options, groups);
    // Ensure the imported group (group) appears first
    if (group) {
      const matchedGroup = options.find((g) => g.label === group);
      if (matchedGroup) {
        setSelectedOption(matchedGroup);
        // options = [matchedGroup, ...options.filter((g) => g.label !== group)];
      } else {
        setSelectedOption({
          value: "",
          label: "Select Group",
        });
        setMatched(false);
      }
    }

    setGroupOptions(options); // Set options with or without roup
    // } catch (error) {
    //   console.error("Error fetching groups:", error);
    // } finally {
    //   setLoading(false);
    // }
    // };

    // fetchGroups();
  }, [groups, group]);

  // Update Selected Value
  const setGenericHandler = ({ id, name }) => {
    const selected = processedData.find(
      (pro) => pro.article_code === article_code
    );

    const rest = processedData.filter(
      (pro) => pro.article_code !== article_code
    );

    let products = [...rest, { ...selected, group: id, groupName: name }];

    // console.log("products", rest, products);

    dispatch(selectprocessedData(products));
  };

  // Handle option change
  const handleSelectChange = (selected) => {
    setGenericHandler({ id: selected.value, name: selected.label });
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
        value={selectedOption}
        options={groupOptions}
        placeholder={loading ? "Loading Groups..." : "Select Group"}
        onChange={handleSelectChange}
        isSearchable
        classNamePrefix="react-select"
        matched={!matched}
      />
    </div>
  );
};

export default SelectGroupImport;
