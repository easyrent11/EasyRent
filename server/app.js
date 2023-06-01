const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const carRoutes = require('./routes/cars');
const userRoutes = require('./routes/users');


// defining the server port.
const port = process.env.PORT || 3001;

// middleware.
app.use(cors());
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'images')))
app.use('/api', carRoutes);
app.use('/api', userRoutes);




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});