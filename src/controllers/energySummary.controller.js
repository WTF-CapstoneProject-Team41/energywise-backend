const { EnergyAccount, EnergyPurchase, Appliance } = require('../models');
const { Op } = require('sequelize');

exports.getEnergySummary = async (req, res) => {
  try {

    // Find user's energy account
    const account = await EnergyAccount.findOne({
      where: { user_id: req.user.id }
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Energy account not found'
      });
    }

    // 1️⃣ Total units purchased
    const purchases = await EnergyPurchase.findAll({
      where: { energy_account_id: account.id }
    });

    const totalUnits = purchases.reduce((sum, purchase) => {
      return sum + parseFloat(purchase.units_purchased);
    }, 0);

    // 2️⃣ Daily kWh usage from appliances
    const appliances = await Appliance.findAll({
      where: { energy_account_id: account.id }
    });

    const dailyKwh = appliances.reduce((sum, appliance) => {
      const wattage = appliance.wattage;
      const quantity = appliance.quantity;
      const hours = parseFloat(appliance.hours_per_day);
      const duty = parseFloat(appliance.duty_cycle);

      const daily = (wattage * quantity * hours * duty) / 1000;
      return sum + daily;
    }, 0);

    // 3️⃣ Days remaining
    const daysRemaining = dailyKwh > 0
      ? (totalUnits / dailyKwh)
      : 0;

    return res.json({
      success: true,
      data: {
        total_units_purchased: totalUnits,
        estimated_daily_kwh: Number(dailyKwh.toFixed(2)),
        estimated_days_remaining: Number(daysRemaining.toFixed(1))
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};