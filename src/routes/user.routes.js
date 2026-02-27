const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const usersController = require('../controllers/users.controller');
const profileController = require('../controllers/profile.controller');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/type:
 *   patch:
 *     summary: Set user type (HOUSEHOLD or SME)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_type
 *             properties:
 *               user_type:
 *                 type: string
 *                 enum: [HOUSEHOLD, SME]
 *     responses:
 *       200:
 *         description: User type updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
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
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update user profile details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               business_name:
 *                 type: string
 *               business_type:
 *                 type: string
 *               business_size:
 *                 type: integer
 *               household_size:
 *                 type: integer
 *               primary_power_source:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/profile',
  authMiddleware,
  profileController.updateProfile
);

module.exports = router;