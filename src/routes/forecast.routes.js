const express = require('express');
const router = express.Router();
const { getForecast } = require('../controllers/forecast.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Forecast
 *   description: AI-powered energy consumption forecasting
 */

/**
 * @swagger
 * /api/forecast:
 *   get:
 *     summary: Get 30-day energy forecast
 *     description: Returns projected daily remaining energy units for the next 30 days based on current usage patterns.
 *     tags: [Forecast]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Forecast retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     daily_kwh:
 *                       type: number
 *                       format: float
 *                       example: 10.58
 *                     units_per_day:
 *                       type: number
 *                       format: float
 *                       example: 18.89
 *                     depletionDay:
 *                       type: integer
 *                       example: 19
 *                     forecast_30_days:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: integer
 *                             example: 1
 *                           projected_remaining_units:
 *                             type: number
 *                             format: float
 *                             example: 331.11
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No energy data available for forecasting
 */

router.get('/', authMiddleware, getForecast);

module.exports = router;