// Function to retrieve the count of orders that were made today
async function getOrdersToday(db) {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split("T")[0];
    const query =
      "SELECT COUNT(*) AS orderCount FROM orders WHERE DATE(Order_Date) = ?";

    db.query(query, [today], (error, results) => {
      if (error) {
        console.error(error);
        reject("Internal server error");
      } else {
        resolve(results[0].orderCount);
      }
    });
  });
}

// Function to retrieve the count of orders that were made this month
async function getOrdersThisMonth(db) {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];
    const query =
      "SELECT COUNT(*) AS orderCount FROM orders WHERE DATE(Order_Date) >= ?";

    db.query(query, [firstDayOfMonth], (error, results) => {
      if (error) {
        console.error(error);
        reject("Internal server error");
      } else {
        resolve(results[0].orderCount);
      }
    });
  });
}

// Function to retrieve the count of orders that were made this year
async function getOrdersThisYear(db) {
  return new Promise((resolve, reject) => {
    const currentYear = new Date().getFullYear();
    console.log(currentYear);
    const query =
      "SELECT COUNT(*) AS orderCount FROM orders WHERE YEAR(Order_Date) = ?";

    db.query(query, [currentYear], (error, results) => {
      if (error) {
        console.error(error);
        reject("Internal server error");
      } else {
        console.log(results);
        resolve(results[0].orderCount);
      }
    });
  });
}

function getUserWithMostAcceptedOrdersThisMonth(db) {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const query = `
    SELECT u.*, COUNT(o.Order_Id) AS acceptedOrderCount
    FROM users u
    JOIN orders o ON u.Id = o.Renter_Id
    WHERE o.Status = 'accepted'
    AND o.Start_Date >= ? AND o.Start_Date <= ?
    GROUP BY u.Id
    ORDER BY acceptedOrderCount DESC
    LIMIT 1;
`;

    db.query(query, [firstDayOfMonth, lastDayOfMonth], (error, results) => {
      if (error) {
        console.error(error);
        reject("Internal server error");
      } else {
        resolve(results[0]);
      }
    });
  });
}

module.exports = {
  getOrdersToday,
  getOrdersThisMonth,
  getOrdersThisYear,
  getUserWithMostAcceptedOrdersThisMonth,
};
