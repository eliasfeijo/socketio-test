const express = require('express');

const UsersController = require('./controllers/UsersController');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Hello World');
});

// Login route
routes.post('/api/login', UsersController.login);

// User routes
routes.post('/api/users', UsersController.create);
routes.get('/api/users', UsersController.getAll);
routes.get('/api/users/:id', UsersController.getById);
routes.put('/api/users/:id', UsersController.update);
routes.delete('/api/users/:id', UsersController.delete);

module.exports = routes;