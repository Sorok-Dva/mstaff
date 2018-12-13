const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const IndexController = require('../controllers/index');

router.get('/', IndexController.getIndex);
router.get('/login', UserController.ensureIsNotAuthenticated, IndexController.getLogin);
router.get('/register', UserController.ensureIsNotAuthenticated, IndexController.getRegister)
  .post('/register', UserController.ensureIsNotAuthenticated, UserController.create);

module.exports = router;
