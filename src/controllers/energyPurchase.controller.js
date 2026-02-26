const { EnergyPurchase, EnergyAccount } = require('../models');

exports.createManualPurchase = async (req, res) => {
  try {
    const { units_purchased, source } = req.body;

    const account = await EnergyAccount.findOne({
      where: { user_id: req.user.id }
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Energy account not found'
      });
    }

    const purchase = await EnergyPurchase.create({
      energy_account_id: account.id,
      date: new Date(),
      units_purchased,
      amount_paid: null,
      source,
      token_id: null
    });

    return res.status(201).json({
      success: true,
      message: 'Energy purchase logged successfully',
      data: purchase
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};