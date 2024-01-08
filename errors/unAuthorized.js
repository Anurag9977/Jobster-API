const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./customError");

class unAuthorizedError extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = unAuthorizedError;
