const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid!");
  }

  const token = authorization.split(" ")[1];

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.userid).select("-password");
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = authentication;
