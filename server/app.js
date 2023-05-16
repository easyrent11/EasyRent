const express = require('express');
const app = express();

// defining the port 
const port = process.env.PORT || 3001;



// middleware.
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.listen(port, () => console.log(`Listening on port ${port}`));