const { EnergyAccount } = require('../models');

exports.createEnergyAccount = async (req, res) => {
  try {
    const { meter_number, base_tariff } = req.body;

    const existingAccount = await EnergyAccount.findOne({
      where: { user_id: req.user.id }
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'Energy account already exists'
      });
    }

    const account = await EnergyAccount.create({
      user_id: req.user.id,
      meter_number,
      base_tariff: base_tariff || null
    });

    return res.status(201).json({
      success: true,
      message: 'Energy account created successfully',
      data: account
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};