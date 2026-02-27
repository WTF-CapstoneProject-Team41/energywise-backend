const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Energy usage recommendations and alerts
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Get energy recommendations
 *     description: Returns personalized energy usage recommendations based on current consumption patterns and remaining units.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
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
 *                     days_remaining:
 *                       type: number
 *                       format: float
 *                       example: 18.53
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: neutral
 *                           message:
 *                             type: string
 *                             example: Your energy usage is stable.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No energy data available
 */

router.get('/', authMiddleware, getRecommendations);

module.exports = router;