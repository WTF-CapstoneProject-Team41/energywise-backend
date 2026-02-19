const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyAccountController = require('../controllers/energyAccount.controller');
// Create a new energy account
router.post('/', authMiddleware, energyAccountController.createEnergyAccount);

module.exports = router;