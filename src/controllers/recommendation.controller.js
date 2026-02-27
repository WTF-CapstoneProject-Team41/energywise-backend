const {
  EnergyAccount,
  EnergyBalance,
  Appliance
} = require('../models');

exports.getRecommendations = async (req, res) => {
  try {

    const account = await EnergyAccount.findOne({
      where: { user_id: req.user.id }
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Energy account not found'
      });
    }

    const appliances = await Appliance.findAll({
      where: { energy_account_id: account.id }
    });

    const balance = await EnergyBalance.findOne({
      where: { energy_account_id: account.id }
    });

    if (!balance) {
      return res.status(400).json({
        success: false,
        message: 'Energy balance not found'
      });
    }

    // Calculate daily usage
    let totalDailyKwh = 0;

    appliances.forEach(appliance => {
      const wattage = parseFloat(appliance.wattage);
      const quantity = parseFloat(appliance.quantity);
      const hours = parseFloat(appliance.hours_per_day);
      const dutyCycle = parseFloat(appliance.duty_cycle);

      totalDailyKwh +=
        (wattage * quantity * hours * dutyCycle) / 1000;
    });

    totalDailyKwh = Number(totalDailyKwh.toFixed(2));

    const baseTariff = parseFloat(account.base_tariff || 1);
    const unitsPerDay =
      baseTariff > 0
        ? Number((totalDailyKwh / baseTariff).toFixed(2))
        : 0;

    const currentUnits = parseFloat(balance.current_units);
    const daysRemaining =
      unitsPerDay > 0
        ? Number((currentUnits / unitsPerDay).toFixed(2))
        : null;

    // -----------------------------
    // RULE-BASED RECOMMENDATIONS
    // -----------------------------

    const recommendations = [];

    if (!appliances.length) {
      recommendations.push({
        type: "info",
        message: "Add appliances to get accurate consumption insights."
      });
    }

    if (daysRemaining !== null && daysRemaining <= 5) {
      recommendations.push({
        type: "warning",
        message: "Your energy may run out within 5 days. Consider purchasing more units."
      });
    }

    if (unitsPerDay > 30) {
      recommendations.push({
        type: "alert",
        message: "High daily energy usage detected. Consider reducing appliance hours."
      });
    }

    if (unitsPerDay <= 15 && unitsPerDay > 0) {
      recommendations.push({
        type: "positive",
        message: "Your energy consumption is within an efficient range."
      });
    }

    if (!recommendations.length) {
      recommendations.push({
        type: "neutral",
        message: "Your energy usage is stable."
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        daily_kwh: totalDailyKwh,
        units_per_day: unitsPerDay,
        days_remaining: daysRemaining,
        recommendations
      }
    });

  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};