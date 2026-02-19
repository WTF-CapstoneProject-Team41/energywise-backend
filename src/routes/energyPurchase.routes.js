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
 *     tags: [EnergyPurchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchase_date:
 *                 type: string
 *                 format: date
 *               amount_paid:
 *                 type: number
 *               units_kwh:
 *                 type: number
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Energy purchase logged
 */
router.post('/', authMiddleware, [
    body('purchase_date')
      .notEmpty()
      .withMessage('Purchase date is required'),
    body('amount_paid')
      .notEmpty()
      .withMessage('Amount paid is required')
      .isFloat({ min: 0 })
      .withMessage('Amount paid must be a positive number'),
    body('units_kwh')
    .isNumeric()
    .withMessage('Units (kWh) must be a number'),
],
    energyPurchaseController.createEnergyPurchase);

module.exports = router;