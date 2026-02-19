const energyPurchaseService = require('../services/energyPurchase.service');

const createEnergyPurchase = async (req, res) => {
  try {
    const energyPurchase = await energyPurchaseService.createEnergyPurchase(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Energy purchase created successfully',
      data: energyPurchase
    });
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  });
}
};

module.exports = {
  createEnergyPurchase,
};