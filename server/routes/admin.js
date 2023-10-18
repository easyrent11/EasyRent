const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const db = require("../models/db");
const AdminServices = require("../services/AdminServices");

// route for the main admin page.
router.get("/adminpage", verifyToken, (req, res) => {
  const { isadmin } = req.user;
  if (isadmin === 1) {
    console.log("admin authorized");
    res.json({ message: "Welcome to the admin page!" });
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});
// route to get the order statistics
router.get("/getorderstatistics",async (req, res) => {
  try {
    const ordersToday = await AdminServices.getOrdersToday(db); 
    const ordersThisMonth = await AdminServices.getOrdersThisMonth(db); 
    const ordersThisYear = await AdminServices.getOrdersThisYear(db); 
    res.status(200).json({today:ordersToday, thisMonth:ordersThisMonth, thisYear:ordersThisYear});
  } catch (error) {
    console.error("Error fetching order statistics", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// route to get the best seller of the current month.
router.get("/bestmonthlyseller",async (req,res) => {
  try{
    const bestSeller = await AdminServices.getUserWithMostAcceptedOrdersThisMonth(db);
    res.status(200).json({user:bestSeller});
  }
  catch(error){
    res.status(500).json({error:"Internal Server Error"});
  }
})
// route to get the data for the graph about the orders.
router.get("/getgraphdata", async(req,res) => {
  try{
    const graphData = await AdminServices.getGraphData(db);
    res.status(200).json({graphData:graphData});
  }
  catch(error){
    res.status(500).json({error:"Internal Server Error"});
  }
})

// route to log user activties.
router.post('/logActivity',async (req, res) => {
  const { user_id, activity_type, details } = req.body;
  try{
    await AdminServices.insertActivity(db,user_id, activity_type, details);
    res.status(200).json({ message: 'Activity logged successfully.' });
  }
  catch(error){
    res.status(500).json({error:"Internal Server Error"});
  }
});
// route to get a users latest activites
router.get("/getlatestactivities", async(req,res) => {
  try{
    const results = await AdminServices.getLatestActivities(db);
    res.status(200).json({results});
  }
  catch(error){
    res.status(500).json({error:"Internal Server Error"});
  }
})




module.exports = router; 