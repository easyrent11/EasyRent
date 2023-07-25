const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const db = require("../models/db");
const multer = require("multer");
const carServices  = require('../services/CarServices');
//call multer and  define  the images folder.
const upload = multer({
  dest: path.join(__dirname, "../images"),
}).array("carpics", 20);



router.post("/checkcarexists", (req, res) => {
  const { platesNumber } = req.body;
  const query = "SELECT * FROM cars WHERE Plates_Number = ?";
  db.query(query, [platesNumber], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (results.length > 0) {
        res.status(200).json({ exists: true }); // Car exists
      } else {
        res.status(200).json({ exists: false }); // Car doesn't exist
      }
    }
  });
});

router.get("/getallcars", async (req, res) => {
  try {
    const carsWithImages = await carServices.getAllCarsWithImages();
    res.status(200).json(carsWithImages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving cars" });
  }
});

router.get("/getcar/:PlatesNumber",async(req,res) => {
  const PlatesNumber = req.params.PlatesNumber;
  try{
    const car = await carServices.getCarWithPlatesNumber(db, PlatesNumber);
    res.status(200).json(car);
  }catch (error) {
    res.status(500).json({ error: "Error retrieving car" });
  }
});
router.get("/getcarwithuserid/:userId",async(req,res) => {
  const userId = req.params.userId;
  try{
    const car = await carServices.getCarsWithUserId(db, userId);
    res.status(200).json(car);
  }catch (error) {
    res.status(500).json({ error: "Error retrieving car" });
  }
});

// Route to update car details
router.put("/updatecardetails", async (req, res) => {
  // Retrieve the updated car details from the request body
  const updatedCarDetails = req.body;
  console.log("Updated Details =",updatedCarDetails);

  try {
    await carServices.updateCarDetails(db, updatedCarDetails);
    res.json({ message: "Car details and image updated successfully" });
  } catch (error) {
    console.error("Error updating car details:", error);
    res.status(500).json({ message: "Failed to update car details and image" });
  }
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
      const newFilePath = path.join(__dirname, `../images/${newFileName}`); // Construct the new file path
      fs.renameSync(file.path, newFilePath); // Rename the file
      return `${req.protocol}://${req.get("host")}/images/${newFileName}`;
    });

    return res.json({ message: "Success", files: fileUrls });
  });
});

module.exports = router;