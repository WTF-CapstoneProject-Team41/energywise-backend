const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const applianceController = require('../controllers/appliance.controller');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

router.post(
  '/',
  authMiddleware,
  [
    body('appliance_type').notEmpty().withMessage('Appliance type is required'),
    body('wattage').isInt({ gt: 0 }).withMessage('Wattage must be positive'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be positive'),
    body('hours_per_day').isFloat({ gt: 0 }).withMessage('Hours per day must be positive'),
    body('duty_cycle')
      .optional()
      .isFloat({ min: 0, max: 1 })
      .withMessage('Duty cycle must be between 0 and 1')
  ],
  validate,
  applianceController.createAppliance
);

router.get('/', authMiddleware, applianceController.getAppliances);

module.exports = router;