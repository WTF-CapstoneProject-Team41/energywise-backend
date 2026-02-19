const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyPurchaseController = require('../controllers/energyPurchase.controller');

router.post('/', authMiddleware, energyPurchaseController.createEnergyPurchase);

module.exports = router;