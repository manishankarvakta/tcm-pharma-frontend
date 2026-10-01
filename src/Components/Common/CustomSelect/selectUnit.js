import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useUnitsQuery } from "../../../services/unitApi";
import customStyles from "./CustomStyles";

const SelectUnit = ({ ut, handleOnchange }) => {
  const { data, isSuccess } = useUnitsQuery(); // Fetch the data
  const [unitOptions, setUnitOptions] = useState([]); // State for select options
  const [selectedOption, setSelectedOption] = useState(null); // State for selected option
  console.log("ut", ut, unitOptions);
  // Populate the select options when the data is fetched successfully
  useEffect(() => {
    if (isSuccess && data?.length > 0) {
      const options = data.map((unit) => ({
        option: unit._id,
        label: unit.name,
      }));
      setUnitOptions(options);

      // Set default selected option if `ut` is provided
      const defaultSelected = options.find((opt) => opt.label === ut) || null;
      setSelectedOption(defaultSelected);
    }
  }, [data, isSuccess, ut]);

  // Handle changes in the select input
  const handleChange = (selected) => {
    setSelectedOption(selected); // Update the selected option
    handleOnchange(selected ? selected.label : null); // Pass the value to the parent
  };

  return (
    <Fragment>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={selectedOption} // Ensure the value is tied to the selectedOption state
        isDisabled={false} // Dropdown is enabled
        isLoading={false} // Not loading as data is fetched
        isClearable={true} // Allow the user to clear the selection
        isSearchable={true} // Enable searching through options
        onChange={handleChange} // Handle change events
        options={unitOptions} // Options for the select dropdown
        styles={customStyles}
      />
    </Fragment>
  );
};

export default SelectUnit;
