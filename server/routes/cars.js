const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const db = require("../models/db");
const multer = require("multer");
const carServices = require("../services/CarServices");
//call multer and  define  the images folder.
const upload = multer({
  dest: path.join(__dirname, "../images"),
}).array("carpics", 20);

// car that will get all of the cars in the website.
router.get("/getallcars", async (req, res) => {
  try {
    const carsWithImages = await carServices.getAllCarsWithImages();
    res.status(200).json(carsWithImages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving cars" });
  }
});
// route that will take a plate number and retrieve all car details.
router.get("/getcar/:PlatesNumber", async (req, res) => {
  const PlatesNumber = req.params.PlatesNumber;
  try {
    const car = await carServices.getCarWithPlatesNumber(db, PlatesNumber);
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving car" });
  }
});
// route to get a given users car via id.
router.get("/getcarwithuserid/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const car = await carServices.getCarsWithUserId(db, userId);
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving car" });
  }
});

// Route to update car details
router.put("/updatecardetails", async (req, res) => {
  // Retrieve the updated car details from the request body
  const updatedCarDetails = req.body;
  console.log("details to update in db=", updatedCarDetails);

  try {
    await carServices.updateCarDetails(db, updatedCarDetails);
    res.json({ message: "Car details and image updated successfully" });
  } catch (error) {
    console.error("Error updating car details:", error);
    res.status(500).json({ message: "Failed to update car details and image" });
  }
});

// route for deleting old images of a car.
router.post("/deleteoldimages", async (req, res) => {
  const { platesNumber } = req.body;
  try {
    const result = await carServices.deleteCarPictures(db, platesNumber);
    res.json({ message: `${result}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete previous car images." });
  }
});


// route to delete a car via plates number. 
router.put("/deletecar/:platesNumber", async (req, res) => {
  const { platesNumber } = req.params;
  try {
    // check if the car we are trying to delete exists in the orders (in use)
    const carExistsInOrders = await carServices.carExistsInOrders(db, platesNumber);
    // the car exists in the orders and cant be removed.
    if(carExistsInOrders){
      res.status(200).json({exists:true, message:"You have new pending orders on this car, deal with them before trying to delete it."});
    }
    else{
      const result = await carServices.deleteCar(db,platesNumber);
      if (result) {
        res.json({ message: "Car deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete car" });
      }
    }
    // the car doesnt exist in the orders proceed to delete it
  } catch (error) {
    res.status(500).json({ message: "Failed to delete car and images" });
  }
});

// route for updating car images in the database.
router.post("/insertimages", async (req, res) => {
  const carDetails = req.body;
  try {
    await carServices.insertCarImages(
      db,
      carDetails.PlatesNumber,
      carDetails.images
    );
    res.json({ message: "Images inserted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to insert car images." });
  }
});
// route to get all the images of a car via plates number.
router.get("/getallcarimages/:PlatesNumber", async (req, res) => {
  const PlatesNumber = req.params.PlatesNumber;
  try {
    const carImages = await carServices.fetchAllCarImages(db, PlatesNumber);
    res.status(200).json(carImages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving car" });
  }
});

// route for uploading images of a car to local folder.
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
