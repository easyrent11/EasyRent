// function that takes a date and formats it in 'yy:mm:dd  format 
export function formatDate(dateString,flag) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
  const day = String(date.getDate()).padStart(2, '0');
  return flag ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
}