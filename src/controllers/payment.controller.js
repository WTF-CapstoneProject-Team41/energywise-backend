const axios = require('axios');
const {
  EnergyAccount,
  EnergyPurchase,
  sequelize
} = require('../models');

exports.verifyPayment = async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({
      success: false,
      message: 'Payment reference is required'
    });
  }

  const t = await sequelize.transaction();

  try {
    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const paymentData = response.data.data;

    if (!paymentData || paymentData.status !== 'success') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Convert amount (Paystack returns kobo)
    const amountPaid = paymentData.amount / 100;

    // For MVP: 1 naira = 1 unit
    const unitsPurchased = amountPaid;

    // Get user's energy account
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

    // Prevent duplicate crediting
    const existingPurchase = await EnergyPurchase.findOne({
      where: { token_id: reference },
      transaction: t
    });

    if (existingPurchase) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Payment already verified'
      });
    }

    // Create purchase (balance hook updates automatically)
    const purchase = await EnergyPurchase.create({
      energy_account_id: account.id,
      date: new Date(),
      units_purchased: unitsPurchased,
      amount_paid: amountPaid,
      source: 'PAYSTACK',
      token_id: reference
    }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: 'Payment verified and energy credited',
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