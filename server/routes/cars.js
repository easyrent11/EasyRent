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
    console.error("Error retrieving cars:", error);
    res.status(500).json({ error: "Error retrieving cars" });
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