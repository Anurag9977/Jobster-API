const { StatusCodes } = require("http-status-codes");
const { customAPIError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong!!! Please try again!!!",
  };

  if (err && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `The field - ${Object.keys(
      err.keyValue
    )} already exists. Please enter a new email or login using this email`;
  } else if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  } else if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `Job not found with id : ${err.value}`;
  }

  return res.status(customError.statusCode).json({
    message: customError.message,
  });
};

module.exports = errorHandlerMiddleware;
