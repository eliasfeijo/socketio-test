const express = require('express');
const dbConnection = require('./database/index');

const app = express();
const port = 3000;

(async () => {
  try{
    await dbConnection.authenticate();
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