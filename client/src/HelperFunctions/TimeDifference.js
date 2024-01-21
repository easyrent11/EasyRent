// function that calculates the difference between two time inputs.
export function diff(startTime, endTime) {
    let start = startTime.split(":");
    let end = endTime.split(":");
    let startDate = new Date(0, 0, 0, start[0], start[1], 0);
    let endDate = new Date(0, 0, 0, end[0], end[1], 0);
    
    if(endDate - startDate < 0) return 0; // checking if the start time is bigger than the end time.
    const differenceInMs = endDate - startDate; // Get the absolute difference in milliseconds
    
    // Calculate hours
    const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    return hours;
}
