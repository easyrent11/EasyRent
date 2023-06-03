// const jwt = require("jsonwebtoken");

// module.exports = async (request, response, next) => {
//   try {
//     //   get the token from the authorization header
//     const token = await request.headers.authorization.split(" ")[1];

//     //check if the token matches the supposed origin
//     const decodedToken = await jwt.verify(token, proccess.env.ACCESS_TOKEN_SECRET);

//     // retrieve the user details of the logged in user
//     const user = await decodedToken;

//     // pass the user down to the endpoints here
//     request.user = user;

//     // pass down functionality to the endpoint
//     next();
    
//   } catch (error) {
//     response.status(401).json({
//       error: new Error("Invalid request!"),
//     });
//   }
// };

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    // Token is valid, store the decoded information in the request object
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
