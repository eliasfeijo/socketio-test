const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();
const port = 3000;

const sequelize = new Sequelize();

(async () => {
  try{
    await sequelize.authenticate();
    console.log('Connected to the database successfully');
  } catch(e) {
    console.log('Error connecting to the database:', e);
  }
  app.get('/', (req, res) => {
    res.send('Hello World');
  });
  
  app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
  });
})();