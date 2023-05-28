const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/responseMethods.util");

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const errorResponse = errors.errors.map((el) => el.msg);
      throw {
        name: "ExpressValidationError",
        message: "Validation Errors",
        data: errorResponse,
      };
    } else {
      next();
    }
  } catch (error) {
    errorResponse({ res, error, status: 400 });
  }
}

module.exports = handleValidationErrors;
