const energyAccountService = require('../services/energyAccount.service');

const createEnergyAccount = async (req, res) => {
    try {
        const result = await energyAccountService.createEnergyAccount(req.user.id, req.body);
        return res.status(201).json({
            success: true,
            message: result.message,
            data: result.account
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createEnergyAccount: createEnergyAccount
}