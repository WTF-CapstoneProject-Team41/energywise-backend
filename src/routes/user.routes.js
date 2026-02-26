const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const usersController = require('../controllers/users.controller');
const profileController = require('../controllers/profile.controller');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

/**
 * @route   PATCH /api/users/type
 * @desc    Set user type (HOUSEHOLD or SME)
 * @access  Private
 */
router.patch(
  '/type',
  authMiddleware,
  [
    body('user_type')
      .notEmpty()
      .withMessage('User type is required')
      .isIn(['HOUSEHOLD', 'SME'])
      .withMessage('User type must be HOUSEHOLD or SME')
  ],
  validate,
  usersController.setUserType
);

/**
 * @route   PATCH /api/users/profile
 * @desc    Update user profile (Home or SME details)
 * @access  Private
 */
router.patch(
  '/profile',
  authMiddleware,
  profileController.updateProfile
);

module.exports = router;