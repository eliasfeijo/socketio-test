const express = require('express');
const dbConnection = require('./database/index');

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(require('./routes'));

const port = 3000;

(async () => {
  try{
    await dbConnection.authenticate();
    console.log('Connected to the database successfully');
  } catch(e) {
    console.log('Error connecting to the database:', e);
  }

  app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
  });
})();