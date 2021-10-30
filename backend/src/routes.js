const express = require('express');

const Auth = require('./utils/Auth');

const UsersController = require('./controllers/UsersController');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Hello World');
});

// Login route
routes.post('/api/login', UsersController.login);
routes.post('/api/refreshToken', Auth.verifyJWT, UsersController.refreshToken);

// User routes
routes.post('/api/users', UsersController.create);
routes.get('/api/users', Auth.verifyJWT, UsersController.getAll);
routes.get('/api/users/:id', Auth.verifyJWT, UsersController.getById);
routes.put('/api/users/:id', Auth.verifyJWT, UsersController.update);
routes.delete('/api/users/:id', Auth.verifyJWT, UsersController.delete);

module.exports = routes;