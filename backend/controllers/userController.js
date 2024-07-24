import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import expressAsyncHandler from "express-async-handler";

// @desc    Auth user/set token
// route    POST /api/users/auth
// access   Public
const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      businessLicense: user?.businessLicense,
      taxId: user?.taxId,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc    Register a user
// route    POST /api/users
// access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      businessLicense: user?.businessLicense,
      taxId: user?.taxId,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout a user
// route    POST /api/users/logout
// access   Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully." });
};

// @desc    Get user profile
// route    GET /api/users/profile
// access   Private
const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  console.log(req.user);

  if (user) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      businessLicense: user?.businessLicense,
      taxId: user?.taxId,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// @desc    Update user profile
// route    PUT /api/users/profile
// access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.businessLicense = req?.body?.businessLicense || user?.businessLicense;
    user.taxId = req?.body?.taxId || user?.taxId;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      businessLicense: updatedUser?.businessLicense,
      taxId: updatedUser?.taxId,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Upload assets for a user
// route PUT /api/users/upload-asset
// access Private

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
