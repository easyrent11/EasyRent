// Function to clear search parameters from localStorage
export const clearSearchParameters = () => {
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("startTime");
    localStorage.removeItem("endTime");
  };

