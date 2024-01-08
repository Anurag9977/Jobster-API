require("dotenv").config();
const { unAuthorizedError } = require("../errors");
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith("Bearer ")) {
    throw new unAuthorizedError("Unauthorized");
  }
  const token = authToken.split(" ")[1];
  try {
    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    req.userDetails = userDetails;
    next();
  } catch (error) {
    throw new unAuthorizedError("Invalid Credentials");
  }
};

module.exports = authMiddleware;
