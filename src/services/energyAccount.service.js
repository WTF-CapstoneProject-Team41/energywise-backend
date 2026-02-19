const { EnergyAccount } = require('../models');

const createEnergyAccount = async (userId, data) => {
    const { account_type, meter_number } = data;

    if (!account_type || !meter_number) {
        throw new Error('Account type and meter number are required');
    }

    const existingAccount = await EnergyAccount.findOne({ where: {user_id: userId } });

    if (existingAccount) {
        throw new Error('User already has an energy account');
    }

    const account = await EnergyAccount.create({
        user_id: userId,
        account_type,
        meter_number
    });

    return {
        message: 'Energy account created successfully',
        account
    };
};

module.exports = {
    createEnergyAccount: createEnergyAccount
};