const app = require('./src/app');
const sequelize = require('./src/config/database');
const db = require('./src/models');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(async () => {
    console.log('Sequelize connected to MySQL successfully.');
    console.log('DB Connected');
    console.log('Loaded models:', Object.keys(db));

    const users = await db.User.findAll()
    console.log('Users in DB:', users.length);

   
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(' Unable to connect to database:', error);
  });
