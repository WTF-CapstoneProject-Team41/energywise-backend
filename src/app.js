const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const energyAccountRoutes = require('./routes/energyAccount.routes');
const energyPurchaseRoutes = require('./routes/energyPurchase.routes');
const applianceRoutes = require('./routes/appliance.routes');
const energySummaryRoutes = require('./routes/energySummary.routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/energy-account', energyAccountRoutes);
app.use('/api/energy-purchases', energyPurchaseRoutes);
app.use('/api/appliances', applianceRoutes);
app.use('/api/energy-summary', energySummaryRoutes);

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// });

// app.use(limiter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'EnergyWise API Running' });
});

module.exports = app;
