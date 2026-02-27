const {
  EnergyAccount,
  EnergyBalance,
  EnergyPurchase,
  Appliance
} = require('../models');

const { runEnergyPipeline } = require('../services/ai.service');

exports.getDashboard = async (req, res) => {
  try {

    // Get account
    const account = await EnergyAccount.findOne({
      where: { user_id: req.user.id }
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Energy account not found'
      });
    }

    // Fetch DB state
    const appliances = await Appliance.findAll({
      where: { energy_account_id: account.id }
    });

    const purchases = await EnergyPurchase.findAll({
      where: { energy_account_id: account.id }
    });

    const balance = await EnergyBalance.findOne({
      where: { energy_account_id: account.id }
    });

    // Build payload for AI
    const payload = {
      appliances: appliances.map(a => ({
        account_id: a.energy_account_id,
        wattage: a.wattage,
        quantity: a.quantity,
        hours_per_day: parseFloat(a.hours_per_day),
        duty_cycle: parseFloat(a.duty_cycle)
      })),
      energy_purchase: purchases.map(p => ({
        account_id: p.energy_account_id,
        units_purchased: parseFloat(p.units_purchased),
        date: p.date
      })),
      energy_balance: [{
        account_id: balance.energy_account_id,
        lifetime_units_purchased: parseFloat(balance.lifetime_units_purchased),
        lifetime_units_consumed: parseFloat(balance.lifetime_units_consumed || 0),
        current_units: parseFloat(balance.current_units)
      }],
      consumption_log: [],
      energy_accounts: [{
        account_id: account.id,
        base_tariff: parseFloat(account.base_tariff || 1)
      }]
    };

    // Call AI service
    const aiResult = await runEnergyPipeline(payload);

    const updatedBalance = aiResult.energy_balance[0];
    const logs = aiResult.consumption_log;

    // Compute dashboard metrics

    const availableEnergy = updatedBalance.current_units;
    const estimatedDuration = updatedBalance.days_remaining;
    const depletionDate = updatedBalance.forecast_depletion_date;

    // Daily average (last 30 days from AI logs)
    const last30 = logs.slice(-30);
    const dailyAverage =
      last30.length > 0
        ? last30.reduce((sum, l) => sum + parseFloat(l.estimated_kwh_used), 0) / last30.length
        : 0;

    // Last purchase
    const lastPurchase =
      purchases.length > 0
        ? purchases.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        : null;

    // Today's consumption
    const today = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(l => l.date.startsWith(today));

    // Consumption trends (monthly total from logs)
    const monthlyTrend = {};
    logs.forEach(log => {
      const month = log.date.slice(0, 7);
      monthlyTrend[month] =
        (monthlyTrend[month] || 0) + parseFloat(log.estimated_kwh_used);
    });

    return res.status(200).json({
      success: true,
      data: {
        name: req.user.name,
        available_energy: availableEnergy,
        estimated_duration_days: estimatedDuration,
        forecast_depletion_date: depletionDate,
        daily_average_kwh: dailyAverage,
        last_purchase: lastPurchase,
        todays_consumption_kwh: todayLog ? todayLog.estimated_kwh_used : 0,
        consumption_trends: monthlyTrend
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};