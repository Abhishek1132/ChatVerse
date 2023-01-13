const { StatusCodes } = require("http-status-codes");

const routeNotFound = async (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send("Route Does Not Exists!");
};

module.exports = routeNotFound;
