const express = require('express');
const router = express.Router();
const passport = require('../bin/passport');

const UserController = require('../controllers/user');
const IndexController = require('../controllers/index');

router.get('/', IndexController.getIndex);

router.get('/login',
  UserController.ensureIsNotAuthenticated,
  IndexController.getLogin)
  .post('/login',
    UserController.ensureIsNotAuthenticated,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login?error=login',
      failureFlash: true
    }), IndexController.postLogin);

router.get('/register',
  UserController.ensureIsNotAuthenticated,
  IndexController.getRegister)
  .post('/register',
    UserController.ensureIsNotAuthenticated,
    UserController.validate('create'),
    UserController.create);

router.get('/logout', UserController.ensureAuthenticated, IndexController.getLogout);

module.exports = router;