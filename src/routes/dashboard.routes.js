const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyDashboardController = require('../controllers/dashboard.controller');

router.get('/', authMiddleware, energyDashboardController.getDashboard);

module.exports = router;