const { User } = require('../models');

exports.setUserType = async (req, res) => {
  try {
    const { user_type } = req.body;

    if (!['HOUSEHOLD', 'SME'].includes(user_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.user_type = user_type;
    await user.save();

    return res.json({
      success: true,
      message: 'User type updated successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};