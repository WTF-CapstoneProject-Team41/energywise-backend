const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyAccountController = require('../controllers/energyAccount.controller');
const {body} = require('express-validator');
const validate = require('../middlewares/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: EnergyAccount
 *   description: Energy account management
 */

/**
 * @swagger
 * /api/energy-account:
 *   post:
 *     summary: Create energy account
 *     description: Creates an energy account for the authenticated user.
 *     tags: [EnergyAccount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - meter_number
 *             properties:
 *               meter_number:
 *                 type: string
 *                 example: "12345678901"
 *               base_tariff:
 *                 type: number
 *                 format: float
 *                 example: 0.75
 *     responses:
 *       201:
 *         description: Energy account created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

// Create a new energy account
router.post(
  '/',
  authMiddleware,
  [
    body('meter_number')
      .notEmpty()
      .withMessage('Meter number is required'),
  ],
  validate,
  energyAccountController.createEnergyAccount
);

module.exports = router;