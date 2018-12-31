const express = require('express');
const UserController = require('../controllers/users');

const routes = express.Router();

routes.post('/signup', UserController.registerUser);

routes.post('/login', UserController.loginUser);

module.exports = routes;
