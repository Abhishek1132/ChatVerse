const { StatusCodes } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    error: err.message || "Internal Server Error! Try Again Later.",
  };

  if (err.name === "ValidationError") {
    customError.error = `Please provide valid ${Object.keys(err.errors)}!`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.error = `Invalid ID: ${err.value} !`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.error = `User with this ${Object.keys(
      err.keyValue
    )} already exists!`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({ error: customError.error });
};

module.exports = errorHandler;
