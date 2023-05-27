const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');
const multer = require('multer');
const carRoutes = require('./routes/cars');

// defining the uploads directory.
const upload = multer({dest:'./uploads'});

// defining the server port.
const port = process.env.PORT || 3001;

// middleware.
app.use(cors());
app.use(express.json());
app.use('/api', carRoutes);
app.use(express.static('./uploads'));



app.post('/uploadImage', upload.single("carpic"), (req,res) => {
  let fileType = req.file.mimetype.split('/')[1];
  let newFileName = req.file.filename + '.' + fileType;
  fs.rename(`./uploads/${req.file.filename}`,  `./uploads/${newFileName}`, () => res.send("Sucess"));
  
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});