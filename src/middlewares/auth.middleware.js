const jwt = require("jsonwebtoken");
const config = require("../config/env");
const { body } = require("express-validator");
const validate = require("./validate.middleware");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authenticateToken;
