const {
  EnergyPurchase,
  EnergyAccount,
  sequelize
} = require('../models');

exports.createManualPurchase = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { units_purchased, source } = req.body;

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

    const purchase = await EnergyPurchase.create({
      energy_account_id: account.id,
      date: new Date(),
      units_purchased,
      amount_paid: null,
      source,
      token_id: null
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Energy purchase logged successfully',
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