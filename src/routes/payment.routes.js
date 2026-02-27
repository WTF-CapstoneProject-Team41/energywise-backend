const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/verify', authMiddleware, verifyPayment);

module.exports = router;