// Function to retrieve the count of orders that were made today
async function getOrdersToday(db) {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split("T")[0]; // converting the date to a normal date format yy:mm:dd.
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
    // formatting the current date and month to the normal date format of yy:mm:dd
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
// function that retrieves the best seller of the month
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


// function that retrieves the graph data for the admin that has all the orders , cars and users registered 
async function getGraphData(db) {
  return new Promise((resolve, reject) => {
    const ordersQuery = "SELECT * FROM orders";
    const usersQuery = "SELECT * FROM users";
    const carsQuery = "SELECT * FROM cars";

    const graphData = {};

    db.query(ordersQuery, (error, ordersResults) => {
      if (error) {
        console.error(error);
        reject("Internal server error");
        return;
      }
      // getting the orders.
      const orderCreationDates = ordersResults.map(row => row.Order_Date);
      graphData.orderCreationDates = orderCreationDates;

      db.query(usersQuery, (error, usersResults) => {
        if (error) {
          console.error(error);
          reject("Internal server error");
          return;
        }
        // getting the registered users.
        const userRegistrationDates = usersResults.map(row => row.register_date);
        graphData.userRegistrationDates = userRegistrationDates;

        db.query(carsQuery, (error, carsResults) => {
          if (error) {
            console.error(error);
            reject("Internal server error");
            return;
          }
          // getting the cars
          const carRegistrationDates = carsResults.map(row => row.upload_date);
          graphData.carRegistrationDates = carRegistrationDates;

          resolve(graphData);
        });
      });
    });
  });
}

// Function to log a user's activty
async function insertActivity(db, user_id, activity_type, details) {
  const query = `
  INSERT INTO activities (user_id, activity_type, details)
  VALUES (?, ?, ?)
`;
  return new Promise((resolve, reject) => {
    db.query(query, [user_id, activity_type, details], (error, results) => {
      if (error) {
        reject("Failed to insert activity");
      } else {
        resolve(results);
      }
    });
  });
}
// function to get the latest activties in the website.
async function getLatestActivities(db){
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM activities ORDER BY activity_time DESC LIMIT 5";
    db.query(query,(error, results) => {
      if (error) {
        console.error(error);
        reject("Internal server error");
      } else {
        console.log(resolve);
        resolve(results);
      }
    });
  });
}

module.exports = {
  getOrdersToday,
  getOrdersThisMonth,
  getOrdersThisYear,
  getUserWithMostAcceptedOrdersThisMonth,
  getGraphData,
  insertActivity,
  getLatestActivities,
};
