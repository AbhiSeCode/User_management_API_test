const User = require("../models/user.model");
const generateHash = require("../utils/generateHash.util");
const { generateToken } = require("../utils/jwtMethods.util");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseMethods.util");

async function registerUser(req, res) {
  try {
    const newUser = new User({
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
    });
    newUser.password = generateHash(newUser.password);
    await newUser.save();
    successResponse({
      res,
      data: {},
      message: "User created and stored in db",
      status: 201,
    });
  } catch (error) {
    errorResponse({ res, error, status: error.status });
  }
}

async function loginUser(req, res) {
  try {
    const reqBodyObject = req.body;
    const user = await User.findOne({ email: reqBodyObject.email });
    let errorObject = {
      message: "Provided Credentials are Invalid",
      name: "Invalid Credentials",
      status: 401,
    };
    if (!user) throw errorObject;
    const payloadPasswordHash = generateHash(reqBodyObject.password);
    if (payloadPasswordHash != user.password) throw errorObject;
    const token = await generateToken(user._id);
    successResponse({
      res,
      data: { token },
      message: "Login Successful",
      status: 200,
    });
  } catch (error) {
    errorResponse({ res, error, status: error.status });
  }
}

async function getUserProfile(req, res) {
  try {
    successResponse({
      res,
      data: {
        user: { id: req.user._id, name: req.user.name, email: req.user.email },
      },
      message: "User found",
      status: 200,
    });
  } catch (error) {
    errorResponse({ res, error, status: error.status });
  }
}

async function updateUserProfile(req, res) {
  try {
    const updateSchema = ["name", "email"];
    const toUpdateValue = {};
    for (let key of updateSchema) {
      if (req.body[key]) {
        toUpdateValue[key] = req.body[key];
      }
    }
    await User.updateOne({ _id: req.user._id }, { ...toUpdateValue });
    successResponse({
      res,
      data: {},
      message: "User details updated",
      status: 200,
    });
  } catch (error) {
    errorResponse({ res, error, status: error.status });
  }
}

async function deleteUserProfile(req, res) {
  try {
    await User.deleteOne({ _id: req.user._id });
    successResponse({
      res,
      data: {
        user: { id: req.user._id, name: req.user.name, email: req.user.email },
      },
      message: "User deleted successfully",
      status: 200,
    });
  } catch (error) {
    errorResponse({ res, error, status: error.status });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
