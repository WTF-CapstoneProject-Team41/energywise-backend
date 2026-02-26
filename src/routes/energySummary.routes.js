const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energySummaryController = require('../controllers/energySummary.controller');

router.get('/', authMiddleware, energySummaryController.getEnergySummary);

module.exports = router;