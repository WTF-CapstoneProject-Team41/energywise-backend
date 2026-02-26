const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyAccountController = require('../controllers/energyAccount.controller');
const {body} = require('express-validator');
const validate = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /api/energy-account:
 *   post:
 *     summary: Create energy account
 *     tags: [EnergyAccount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meter_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Energy account created
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