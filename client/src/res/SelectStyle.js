// functions that select a style for an element.
export const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#1a202c" : "gray", // Set border color on focus
    "&:hover": {
      borderColor: "#1a202c", // Set border color on hover
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#f2f2f2" : "white",
    color:"black",
    "&:hover": {
      backgroundColor: "#CC6200",
    },
  }),
};
