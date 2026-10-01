const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "#0d6efd" // Background color on hover
      : state.isSelected
      ? "#fff" // Background color when selected (red)
      : "transparent", // Default background color
    color: state.isFocused
      ? "#fff" // White text color on hover
      : state.isSelected
      ? "#000" // White text color when selected
      : "#000", // Default black text color
    padding: "10px 15px", // Padding for better spacing

    transition: "background-color 0.2s ease, color 0.2s ease", // Smooth transition for background and text color
  }),
  control: (provided) => ({
    ...provided,
    minWidth: "200px",
    // Optional: Customize the input control here
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "5px", // Rounded corners for the dropdown menu
    color: "#000", // Black text color

    // High z-index to ensure it appears above other elements
    // Ensure proper stacking context
  }),
};

export default customStyles;
