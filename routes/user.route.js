const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/user.controller");
const {
  userRegisterValidatorSchema,
  userLoginValidatorSchema,
  userUpdateProfileValidatorSchema,
} = require("../validators/user.validators.schema");
const handleValidationErrors = require("../middlewares/validationErrorHandler.middleware");
const verifyToken = require("../middlewares/verifyToken.middleware");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints to perform user specific actions
 */

/**
 * @swagger
 *   /user/register:
 *     post:
 *       summary: Register user using name, email, password and confirm_password
 *       tags:
 *         - User
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserRegisterRequest"
 *       responses:
 *         "200":
 *           description: User registered successfully
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Response"
 *         "400":
 *           $ref: "#/components/responses/400"
 */

router.post(
  "/register",
  userRegisterValidatorSchema,
  handleValidationErrors,
  registerUser
);

/**
 * @swagger
 *   /user/login:
 *     post:
 *       summary: Login user using email and password
 *       tags:
 *         - User
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserLoginRequest"
 *       responses:
 *         "200":
 *           description: Login successful
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Response"
 *         "400":
 *           $ref: "#/components/responses/400"
 *         "401":
 *           $ref: "#/components/responses/404"
 */

router.post(
  "/login",
  userLoginValidatorSchema,
  handleValidationErrors,
  loginUser
);

/**
 * @swagger
 *   /user/profile:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Get user info
 *       tags:
 *         - User
 *       responses:
 *         "200":
 *           description: User profile info
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Response"
 *         "400":
 *           $ref: "#/components/responses/400"
 *         "404":
 *           $ref: "#/components/responses/404"
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Update user email or password or both
 *       tags:
 *         - User
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserUpdateProfileRequest"
 *       responses:
 *         "200":
 *           description: User profile updated successfully
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Response"
 *         "400":
 *           $ref: "#/components/responses/400"
 *         "404":
 *           $ref: "#/components/responses/404"
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       summary: Delete User
 *       tags:
 *         - User
 *       responses:
 *         "200":
 *           description: User deleted successfully
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Response"
 *         "400":
 *           $ref: "#/components/responses/400"
 *         "404":
 *           $ref: "#/components/responses/404"
 */

router.get("/profile/", verifyToken, getUserProfile);
router.put(
  "/profile",
  userUpdateProfileValidatorSchema,
  handleValidationErrors,
  verifyToken,
  updateUserProfile
);
router.delete("/profile", verifyToken, deleteUserProfile);

module.exports = router;
