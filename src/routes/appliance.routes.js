const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const applianceController = require('../controllers/appliance.controller');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
/**
 * @swagger
 * tags:
 *   name: Appliances
 *   description: Appliance management endpoints
 */

/**
 * @swagger
 * /api/appliances:
 *   post:
 *     summary: Create a new appliance
 *     tags: [Appliances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appliance_type
 *               - wattage
 *               - quantity
 *               - hours_per_day
 *             properties:
 *               appliance_type:
 *                 type: string
 *                 example: Air Conditioner
 *               wattage:
 *                 type: integer
 *                 example: 1500
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               hours_per_day:
 *                 type: number
 *                 format: float
 *                 example: 8
 *               duty_cycle:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.8
 *     responses:
 *       201:
 *         description: Appliance created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  [
    body('appliance_type').notEmpty().withMessage('Appliance type is required'),
    body('wattage').isInt({ gt: 0 }).withMessage('Wattage must be positive'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be positive'),
    body('hours_per_day').isFloat({ gt: 0 }).withMessage('Hours per day must be positive'),
    body('duty_cycle')
      .optional()
      .isFloat({ min: 0, max: 1 })
      .withMessage('Duty cycle must be between 0 and 1')
  ],
  validate,
  applianceController.createAppliance
);

/**
 * @swagger
 * /api/appliances:
 *   get:
 *     summary: Get all appliances for authenticated user
 *     tags: [Appliances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appliances
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, applianceController.getAppliances);

module.exports = router;