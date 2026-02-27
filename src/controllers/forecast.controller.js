const {
  EnergyAccount,
  EnergyBalance,
  Appliance
} = require('../models');

exports.getForecast = async (req, res) => {
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

    // Calculate daily kWh
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

    // Build 30-day projection
    const forecast = [];
    let remainingUnits = parseFloat(balance.current_units);

    let depletionDay = null;

for (let i = 1; i <= 30; i++) {
  remainingUnits -= unitsPerDay;

  const projectedUnits =
    remainingUnits > 0
      ? Number(remainingUnits.toFixed(2))
      : 0;

  if (projectedUnits === 0 && depletionDay === null) {
    depletionDay = i;
  }

  forecast.push({
    day: i,
    projected_remaining_units: projectedUnits
  });
}

    return res.status(200).json({
      success: true,
      data: {
        daily_kwh: totalDailyKwh,
        units_per_day: unitsPerDay,
        depletionDay: depletionDay,
        forecast_30_days: forecast
      }
    });

  } catch (error) {
    console.error("Forecast error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};