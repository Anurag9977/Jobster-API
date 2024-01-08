const customAPIError = require("./customError");

class notFound extends customAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = notFound;
