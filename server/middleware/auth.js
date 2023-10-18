const jwt = require('jsonwebtoken');

// middle ware function to verify token.
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  // if the token doesnt exist we return a message and an error status code.
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  // if the token exists we verify it with the access token secret from the '.env' file.
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
