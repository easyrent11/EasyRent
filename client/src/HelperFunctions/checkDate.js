import { diff } from "./TimeDifference";
import { formatDate } from "./FormatDate";
// function to check if search dates are valid returns true if invalid or false if valid.
export const checkDate = (dateObj1,dateObj2) => {
    const dateOne = dateObj1.date;
    const timeOne = dateObj1.time;
    const dateTwo = dateObj2.date;
    const timeTwo =  dateObj2.time;
    return formatDate(dateOne) > formatDate(dateTwo) || (formatDate(dateOne) === formatDate(dateTwo) && diff(timeOne,timeTwo) < 1);
}