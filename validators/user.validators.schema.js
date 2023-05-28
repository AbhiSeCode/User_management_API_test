const { body } = require("express-validator");

const userRegisterValidatorSchema = [
  body("name").notEmpty().withMessage("Name is required field"),
  body("email")
    .notEmpty()
    .withMessage("Email is required field")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required field")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm Password is required field")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const userLoginValidatorSchema = [
  body("email")
    .notEmpty()
    .withMessage("Email is required field")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required field"),
];

const userUpdateProfileValidatorSchema = [
  body("email")
    .optional()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body().custom((_, { req }) => {
    if (!req.body.hasOwnProperty("name") && !req.body.hasOwnProperty("email")) {
      throw new Error("Fields to update are missing");
    }
    return true;
  }),
];

module.exports = {
  userRegisterValidatorSchema,
  userLoginValidatorSchema,
  userUpdateProfileValidatorSchema,
};
