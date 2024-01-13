const { badRequestError } = require("../errors");

const testUserMiddleware = (req, res, next) => {
  const { userID } = req.userDetails;
  if (userID === "659df9a60c7cca093ce39f2c") {
    throw new badRequestError("Not authorized for Test User");
  }
  next();
};

module.exports = testUserMiddleware;
