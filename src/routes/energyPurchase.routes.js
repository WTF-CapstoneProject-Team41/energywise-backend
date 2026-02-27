const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyPurchaseController = require('../controllers/energyPurchase.controller');
const {body} = require('express-validator');
const validate = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /api/energy-purchases:
 *   post:
 *     summary: Log energy purchase
 *     description: Logs a manual or payment-based energy purchase and automatically updates the energy balance.
 *     tags: [EnergyPurchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - units_purchased
 *               - source
 *             properties:
 *               units_purchased:
 *                 type: number
 *                 format: float
 *                 example: 120.5
 *               amount_paid:
 *                 type: number
 *                 format: float
 *                 example: 5000
 *               source:
 *                 type: string
 *                 example: MANUAL
 *               token_id:
 *                 type: string
 *                 example: PSK-123456789
 *     responses:
 *       201:
 *         description: Energy purchase logged and balance updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, [
    body('units_purchased')
      .isFloat({ gt: 0 })
      .withMessage('Units must be greater than 0'),

    body('source')
      .notEmpty()
      .withMessage('Source is required')
],validate,
  energyPurchaseController.createManualPurchase);

module.exports = router;