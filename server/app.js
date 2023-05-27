// const express = require('express');
// const app = express();
// const carsRouter = require('./routes/cars');
// const cors = require('cors');

// // defining the port 
// const port = process.env.PORT || 3001;

// // middleware.
// app.use(express.json());
// app.use(cors());


// // Register the routes as middleware
// // app.use('/api', carsRouter); 

// app.get('')

// app.listen(port, () => console.log(`Listening on port ${port}`));

const express = require("express");
const app = express();
const cors = require("cors");
const carRoutes = require('./routes/cars');
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', carRoutes);




app.listen(port, () => {
  console.log("Server is running on port 3001");
});