const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const authControllers = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful
 */

router.post(
  "/signup",
  [
    body("first_name").trim().notEmpty().withMessage("First name is required"),

    body("last_name").trim().notEmpty().withMessage("Last name is required"),

    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email"),

    body("phone")
      .optional()
      .isMobilePhone("any")
      .withMessage("Must be a valid phone number"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),
  ],
  validate,
  authControllers.signup,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post(
  "/login",
  [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Email or phone number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  authControllers.login,
);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Google Sign-In
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid Google token
 */
router.post("/google", authControllers.googleAuth);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, authControllers.me);

module.exports = router;
