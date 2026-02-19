const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const energyAccountController = require('../controllers/energyAccount.controller');
const {body} = require('express-validator');
const validate = require('../middlewares/validate.middleware');

// Create a new energy account
router.post('/', authMiddleware, [
    body('account_type')
    .isIn(['HOME', 'BUSINESS'])
    .withMessage('Account type must be either HOME or BUSINESS'),
    body('meter_number')
      .notEmpty()
      .withMessage('Meter number is required'),
],
    validate,
    energyAccountController.createEnergyAccount);

module.exports = router;