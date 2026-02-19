const energyPurchaseService = require('../services/energyPurchase.service');

const createEnergyPurchase = async (req, res) => {
  try {
    const energyPurchase = await energyPurchaseService.createEnergyPurchase(req.user.id, req.body);
    res.status(201).json(energyPurchase);
} catch (error) {
  res.status(400).json({ error: error.message });
}
};

module.exports = {
  createEnergyPurchase,
};