const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/userModel");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all required fields!");
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new UnauthenticatedError("Invalid Email or Password!");
  }

  const token = user.generateToken();

  res.status(StatusCodes.OK).json({
    user: {
      userid: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    },
    token,
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    throw new BadRequestError("Please provide all the required fields!");
  }

  if (password !== cpassword) {
    throw new BadRequestError("Password and Confirm Password do not match!");
  }

  let imageurl = null;

  let profilePic = null;

  if (req.files) {
    profilePic = req.files.profilePic;
  }

  if (profilePic) {
    // Validate Image
    const fileSize = profilePic.size / 1000;
    const fileExt = profilePic.name.split(".")[1];
    if (fileSize > 500) {
      throw new BadRequestError("Image size must not exceed 500KB!");
    }

    if (!["jpg", "png"].includes(fileExt)) {
      throw new BadRequestError("Image should be either jpg or png!");
    }

    const image = await cloudinary.uploader.upload(profilePic.tempFilePath, {
      folder: "chatverse/users",
      public_id: email,
    });

    imageurl = image.url;

    fs.unlink(profilePic.tempFilePath, (err) => {
      console.log(err);
    });
  }

  let user = null;

  if (imageurl !== null) {
    user = await User.create({
      name,
      email,
      password,
      profilePic: imageurl,
    });
  } else {
    user = await User.create({
      name,
      email,
      password,
    });
  }

  const token = user.generateToken();

  res.status(StatusCodes.CREATED).json({
    user: {
      userid: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    },
    token,
  });
};

module.exports = {
  loginUser,
  registerUser,
};
