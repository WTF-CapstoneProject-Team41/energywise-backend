const { EnergyAccount, EnergyPurchase } = require('../models');

const createEnergyPurchase = async (userId, data) => {
    const { purchase_date, amount_paid, units_kwh, source} = data;

    if (!purchase_date || !amount_paid || !units_kwh) {
        throw new Error('Missing fields required: purchase_date, amount_paid, units_kwh');
    }

    // find the energy account for the user
    const account = await EnergyAccount.findOne({ where: { user_id: userId } });
    if (!account) {
        throw new Error('Energy account not found for user');
    }

    const logPurchase = await EnergyPurchase.create({
        energy_account_id: account.id,
        purchase_date,
        amount_paid,
        units_kwh,
        source
    });

    return {
        message: 'Energy purchase logged successfully',
        logPurchase
    }
};

module.exports = {
    createEnergyPurchase: createEnergyPurchase
};