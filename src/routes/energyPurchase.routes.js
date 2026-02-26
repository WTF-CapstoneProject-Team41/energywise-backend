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
    body('units_purchased')
      .isFloat({ gt: 0 })
      .withMessage('Units must be greater than 0'),

    body('source')
      .notEmpty()
      .withMessage('Source is required')
],validate,
  energyPurchaseController.createManualPurchase);

module.exports = router;