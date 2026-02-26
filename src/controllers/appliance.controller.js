const { Appliance, EnergyAccount } = require('../models');

exports.createAppliance = async (req, res) => {
  try {
    const {
      appliance_type,
      wattage,
      quantity,
      hours_per_day,
      duty_cycle
    } = req.body;

    const account = await EnergyAccount.findOne({
      where: { user_id: req.user.id }
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Energy account not found'
      });
    }

    const appliance = await Appliance.create({
      energy_account_id: account.id,
      appliance_type,
      wattage,
      quantity,
      hours_per_day,
      duty_cycle: duty_cycle ?? 1.0
    });

    return res.status(201).json({
      success: true,
      message: 'Appliance added successfully',
      data: appliance
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAppliances = async (req, res) => {
  const account = await EnergyAccount.findOne({
    where: { user_id: req.user.id }
  });

  const appliances = await Appliance.findAll({
    where: { energy_account_id: account.id }
  });

  return res.json({
    success: true,
    data: appliances
  });
};