const User = require("../models/user.model");
const { decodeToken } = require("../utils/jwtMethods.util");
const { errorResponse } = require("../utils/responseMethods.util");

async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      throw { name: "JWT Error", message: "Token Missing", status: 400 };
    const decodedToken = await decodeToken(token);
    req.user = await User.findById(decodedToken._id);
    if (!req.user)
      throw {
        name: "Not found",
        message: "User not found",
        status: 404,
      };
    delete req.user.password;
    next();
  } catch (error) {
    errorResponse({ res, error, status: error.status });
  }
}

module.exports = verifyToken;
