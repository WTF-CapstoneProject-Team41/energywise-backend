const authService = require('../services/auth.service');

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    return res.status(201).json({
      success: true,
      message: result.message,
      data: { token: result.token }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.json({
      success: true,
      message: result.message,
      data: { token: result.token }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  signup,
  login
};