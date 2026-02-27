const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyDashboardController = require('../controllers/dashboard.controller');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Energy dashboard and analytics
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get energy dashboard data
 *     description: Returns energy summary, usage statistics, forecast depletion date, and consumption trends for the authenticated user.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available_energy:
 *                   type: number
 *                   example: 120.5
 *                 daily_average_kwh:
 *                   type: number
 *                   example: 8.3
 *                 units_per_day:
 *                   type: number
 *                   example: 7.8
 *                 estimated_duration_days:
 *                   type: number
 *                   example: 15
 *                 forecast_depletion_date:
 *                   type: string
 *                   format: date
 *                   example: 2026-03-15
 *                 last_purchase_date:
 *                   type: string
 *                   format: date
 *                   example: 2026-02-20
 *                 monthly_trend:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: 2026-02
 *                       monthly_kwh_used:
 *                         type: number
 *                         example: 240
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, energyDashboardController.getDashboard);

module.exports = router;