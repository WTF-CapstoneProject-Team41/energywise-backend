const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");

router.post(
  "/signup",
  [
    body("email").optional().isEmail().withMessage("Must be a valid email"),
    body("phone")
      .optional()
      .isString()
      .withMessage("Must be a valid phone number"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  authControllers.signup,
);

router.post(
  "/login",
  [
    body("identifier")
      .notEmpty()
      .withMessage("Email or phone number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  authControllers.login,
);

module.exports = router;
