const express = require('express');
const router = express.Router();
const { getForecast } = require('../controllers/forecast.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, getForecast);

module.exports = router;