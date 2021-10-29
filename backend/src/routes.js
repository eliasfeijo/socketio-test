const express = require('express');

const UsersController = require('./controllers/UsersController');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Hello World');
});

routes.post('/api/users', UsersController.create);
routes.get('/api/users', UsersController.getAll);

module.exports = routes;