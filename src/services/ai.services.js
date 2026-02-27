const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

async function runEnergyPipeline(payload) {
  const response = await axios.post(
    `${AI_SERVICE_URL}/run-pipeline`,
    payload
  );

  return response.data;
}

module.exports = {
  runEnergyPipeline
};