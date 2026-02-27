const authService = require('../services/auth.service');
const {User} = require('../models');

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

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'phone', 'role', 'account_status', 'createdAt' ]
    });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const googleAuth = async (req, res) => {
  try {
    const result = await authService.googleAuth(req.body);

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
  login,
  me: getCurrentUser,
  googleAuth
};