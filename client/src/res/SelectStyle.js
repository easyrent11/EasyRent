export const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#CC6200" : "gray", // Set border color on focus
    "&:hover": {
      borderColor: "#CC6200", // Set border color on hover
    },
    boxShadow: state.isFocused ? "0 0 0 1px #CC6200" : base.boxShadow, // Add a box shadow on focus
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#C6200" : "white",
    color: "black",
    "&:hover": {
      backgroundColor: "#CC6200",
    },
  }),
};
