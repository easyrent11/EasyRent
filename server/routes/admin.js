const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const db = require("../models/db");
const AdminServices = require("../services/AdminServices");
router.get("/adminpage", verifyToken, (req, res) => {
  const { isadmin } = req.user;
  if (isadmin === 1) {
    console.log("admin authorized");
    res.json({ message: "Welcome to the admin page!" });
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

router.get("/getorderstatistics",async (req, res) => {
  try {
    const ordersToday = await AdminServices.getOrdersToday(db); // Assuming db is your database connection
    const ordersThisMonth = await AdminServices.getOrdersThisMonth(db); // Assuming db is your database connection
    const ordersThisYear = await AdminServices.getOrdersThisYear(db); // Assuming db is your database connection
    res.status(200).json({today:ordersToday, thisMonth:ordersThisMonth, thisYear:ordersThisYear});
  } catch (error) {
    console.error("Error fetching order statistics", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/bestmonthlyseller",async (req,res) => {
  try{
    const bestSeller = await AdminServices.getUserWithMostAcceptedOrdersThisMonth(db);
    res.status(200).json({user:bestSeller});
  }
  catch(error){
    res.status(500).json({error:"Internal Server Error"});
  }
})

module.exports = router; 