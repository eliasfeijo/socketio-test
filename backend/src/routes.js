const express = require('express');

const UsersController = require('./controllers/UsersController');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Hello World');
});

routes.post('/api/users', UsersController.create);

module.exports = routes;