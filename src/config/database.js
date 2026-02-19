const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL,{
  dialect: 'mysql',
  logging: false
})
// const config = require('./env');

// const sequelize = new Sequelize(
//   config.db.name,
//   config.db.user,
//   config.db.password,
//   {
//     host: config.db.host,
//     port: config.db.port,
//     dialect: 'mysql',
//     logging: false
//   }
// );

module.exports = sequelize;
