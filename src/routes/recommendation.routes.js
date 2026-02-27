const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, getRecommendations);

module.exports = router;