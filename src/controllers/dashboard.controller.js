const {
  EnergyAccount,
  EnergyBalance,
  EnergyPurchase,
  Appliance,
  User
} = require('../models');

exports.getDashboard = async (req, res) => {
  try {

    // Get user + account
    const user = await User.findByPk(req.user.id);

    const account = await EnergyAccount.findOne({
      where: { user_id: req.user.id }
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Energy account not found'
      });
    }

    // Fetch DB data
    const appliances = await Appliance.findAll({
      where: { energy_account_id: account.id }
    });

    const purchases = await EnergyPurchase.findAll({
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

    // -----------------------------------------
    // CALCULATIONS (FROM DATA SCIENCE LOGIC)
    // -----------------------------------------

    // Daily kWh calculation
    let totalDailyKwh = 0;

    appliances.forEach(appliance => {
      const wattage = parseFloat(appliance.wattage);
      const quantity = parseFloat(appliance.quantity);
      const hours = parseFloat(appliance.hours_per_day);
      const dutyCycle = parseFloat(appliance.duty_cycle);

      const dailyKwh =
        (wattage * quantity * hours * dutyCycle) / 1000;

      totalDailyKwh += dailyKwh;
    });
    // Round daily kWh
    totalDailyKwh = Number(totalDailyKwh.toFixed(2));

    // Units per day
    const baseTariff = parseFloat(account.base_tariff || 1);
    let unitsPerDay =
      baseTariff > 0 ? totalDailyKwh / baseTariff : 0;

    unitsPerDay = Number(unitsPerDay.toFixed(2));

    // Days remaining
    const currentUnits = parseFloat(balance.current_units);
    let daysRemaining =
      unitsPerDay > 0 ? currentUnits / unitsPerDay : null;

    daysRemaining = daysRemaining ? Number(daysRemaining.toFixed(2)) : null;

    //  Forecast depletion date
    let depletionDate = null;

    if (daysRemaining && daysRemaining > 0) {
      const today = new Date();
      const forecastDate = new Date(
        today.getTime() + daysRemaining * 24 * 60 * 60 * 1000
      );
      depletionDate = forecastDate.toISOString().slice(0, 10);
    }

    // Last purchase
    let lastPurchase = null;

    if (purchases.length > 0) {
      lastPurchase = purchases.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];
    }

    // Today's consumption (estimated)
    const todaysConsumption = unitsPerDay;

    // Monthly consumption trend (basic deterministic projection)
    const monthlyTrend = {};

    const currentMonth = new Date().toISOString().slice(0, 7);
    monthlyTrend[currentMonth] =
  Number((totalDailyKwh * 30).toFixed(2));

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return res.status(200).json({
      success: true,
      data: {
        name: user.name,

        available_energy: currentUnits,

        daily_average_kwh: totalDailyKwh,

        units_per_day: unitsPerDay,

        estimated_duration_days: daysRemaining,

        forecast_depletion_date: depletionDate,

        last_purchase: lastPurchase,

        todays_consumption_units: todaysConsumption,

        consumption_trends: monthlyTrend
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};