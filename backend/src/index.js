const express = require('express');
const cors = require('cors');
const dbConnection = require('./database/index');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(cors());
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

  server.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
  });
})();