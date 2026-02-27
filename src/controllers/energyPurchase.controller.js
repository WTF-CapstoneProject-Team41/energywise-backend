const {
  EnergyPurchase,
  EnergyAccount,
  EnergyBalance,
  Appliance,
  ConsumptionLog,
  sequelize
} = require('../models');

const { runEnergyPipeline } = require('../services/ai.service');

exports.createManualPurchase = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { units_purchased, source } = req.body;

    // Lock account
    const account = await EnergyAccount.findOne({
      where: { user_id: req.user.id },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!account) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Energy account not found'
      });
    }

    // Create purchase (hook updates balance)
    const purchase = await EnergyPurchase.create({
      energy_account_id: account.id,
      date: new Date(),
      units_purchased,
      amount_paid: null,
      source,
      token_id: null
    }, { transaction: t });

    await t.commit();

    // CALL AI SERVICE

    // Fetch fresh DB state
    const appliances = await Appliance.findAll({
      where: { energy_account_id: account.id }
    });

    const purchases = await EnergyPurchase.findAll({
      where: { energy_account_id: account.id }
    });

    const balance = await EnergyBalance.findOne({
      where: { energy_account_id: account.id }
    });

    const consumptionLogs = await ConsumptionLog.findAll({
      where: { energy_account_id: account.id }
    });

    const energyAccount = await EnergyAccount.findOne({
      where: { id: account.id }
    });

    const payload = {
      appliances: appliances.map(a => a.toJSON()),
      energy_purchase: purchases.map(p => p.toJSON()),
      energy_balance: [balance.toJSON()],
      consumption_log: consumptionLogs.map(c => c.toJSON()),
      energy_accounts: [energyAccount.toJSON()]
    };

    const aiResult = await runEnergyPipeline(payload);

    // PERSIST AI RESULTS

    // Clear old logs
    await ConsumptionLog.destroy({
      where: { energy_account_id: account.id }
    });

    // Insert new logs
    for (const log of aiResult.consumption_log) {
      await ConsumptionLog.create({
        energy_account_id: account.id,
        date: log.date,
        estimated_kwh_used: log.estimated_kwh_used,
        estimated_units_used: log.estimated_units_used,
        remaining_units: log.remaining_units
      });
    }

    // Update balance
    const updatedBalance = aiResult.energy_balance[0];

    await EnergyBalance.update({
      lifetime_units_consumed: updatedBalance.lifetime_units_consumed,
      current_units: updatedBalance.current_units,
      days_remaining: updatedBalance.days_remaining,
      forecast_depletion_date: updatedBalance.forecast_depletion_date,
      last_updated: updatedBalance.last_updated
    }, {
      where: { energy_account_id: account.id }
    });

    return res.status(201).json({
      success: true,
      message: 'Energy purchase logged & AI pipeline executed',
      data: purchase
    });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};