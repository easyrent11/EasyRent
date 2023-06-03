const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const db = require("../models/db");

//call multer and  define  the images folder.
const upload = multer({
  dest: path.join(__dirname, "../images"),
}).array("carpics", 20);

const sql = `
SELECT c.*, m.model_name, mf.Manufacturer_Name, GROUP_CONCAT(ci.image_url) AS image_urls
FROM cars c
JOIN users u ON c.Renter_Id = u.Id
JOIN car_models m ON c.Model = m.model_code
JOIN car_manufacturer mf ON m.manufacturer_code = mf.manufacturer_code
LEFT JOIN car_images ci ON c.Plates_Number = ci.Plates_Number
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
)
GROUP BY c.Plates_Number;
`;

router.post("/searchcar", (req, res) => {
  const { city, pickupDate, returnDate, carType, startTime, endTime } =
    req.body;

  console.log("Start time = ", startTime, " End time = ", endTime);
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


router.post("/uploadImages", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      console.error(err);
      return res.status(500).json({ message: "File upload error" });
    } else if (err) {
      // An unknown error occurred during file upload
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    console.log(req.files);

    // If no errors occurred, we will map the files array.
    const fileUrls = req.files.map((file) => {
      const fileExtension = file.mimetype.split("/")[1];
      // extracting the url of each image from the array.
      const newFileName = `${file.filename}.${fileExtension}`;
      const newFilePath = path.join(
        __dirname,
        `../images/${newFileName}`
      ); // Construct the new file path
      fs.renameSync(file.path, newFilePath); // Rename the file
      return `${req.protocol}://${req.get("host")}/images/${newFileName}`; // Return the URL of the renamed file example : http://localhost:3000/images/car1.jpg
    });

    return res.json({ message: "Success", files: fileUrls });
  });
});

module.exports = router;
