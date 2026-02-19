const energyAccountService = require('../services/energyAccount.service');

const createEnergyAccount = async (req, res) => {
    try {
        const result = await energyAccountService.createEnergyAccount(req.user.id, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createEnergyAccount: createEnergyAccount
}