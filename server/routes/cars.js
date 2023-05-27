// routes/cars.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");
const sql = `
SELECT c.*, m.model_name, mf.Manufacturer_Name
FROM cars c
JOIN users u ON c.Renter_Id = u.Id
JOIN car_models m ON c.Model = m.model_code
JOIN car_manufacturer mf ON m.manufacturer_code = mf.manufacturer_code
WHERE c.Type = ? 
  AND u.City_Code = ? 
  AND c.Plates_Number NOT IN (
    SELECT o.Car_Plates_Number
    FROM orders o
    WHERE (
      o.Start_Date < ?
      OR (o.Start_Date = ? AND o.Start_Time <= ?)
    )
    AND (
      o.End_Date > ?
      OR (o.End_Date = ? AND o.End_Time >= ?)
    )
);
  
`;

router.get("/cars/searchcar", (req, res) => {
  const { city, pickupDate, returnDate, carType, startTime, endTime } =
    req.query;

  db.query(
    sql,
    [
      carType,
      city,
      pickupDate,
      pickupDate,
      startTime,
      returnDate,
      returnDate,
      endTime,
    ],
    (err, result) => {
      if (err) {
        console.log("Error fetching car list:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Got data from frontend:", result);
      res.send(result);
    }
  );
});

router.post("/cars/searchcar", (req, res) => {
  const { city, pickupDate, returnDate, carType, startTime, endTime } =
    req.body;

  db.query(
    sql,
    [
      carType,
      city,
      pickupDate,
      pickupDate,
      startTime,
      returnDate,
      returnDate,
      endTime,
    ],
    (err, result) => {
      if (err) {
        console.log("Error fetching car list:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Got data from frontend:", result);
      res.send(result);
    }
  );
});

module.exports = router;
