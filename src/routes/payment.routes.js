const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment verification and processing
 */

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify Paystack payment
 *     description: Verifies a Paystack transaction reference and logs the energy purchase if successful.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *             properties:
 *               reference:
 *                 type: string
 *                 example: "PSK_REF_123456789"
 *     responses:
 *       200:
 *         description: Payment verified and energy units credited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment verified successfully
 *                 units_credited:
 *                   type: number
 *                   example: 150.5
 *                 new_balance:
 *                   type: number
 *                   example: 300.75
 *       400:
 *         description: Invalid or already verified reference
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Paystack verification failed
 */
router.post('/verify', authMiddleware, verifyPayment);

module.exports = router;