const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");
const User = require("../models/userModel");

const searchUsers = async (req, res) => {
  const searchQuery = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(searchQuery)
    .find({ _id: { $ne: req.user._id } })
    .select("_id name email profilePic");

  res.json({ users });
};

const getUser = async (req, res) => {
  res.send("User");
};

const updateUser = async (req, res) => {
  res.send("user updated");
};

const deleteUser = async (req, res) => {
  res.send("user deleted");
};

module.exports = {
  searchUsers,
  getUser,
  updateUser,
  deleteUser,
};
