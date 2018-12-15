const express = require('express');
const router = express.Router();
const passport = require('../bin/passport');

const UserController = require('../controllers/user');
const IndexController = require('../controllers/index');

/**
 * @Route('/') GET;
 * Show Index page
 */
router.get('/', IndexController.getIndex);

/**
 * @Route('/login') GET + POST;
 * Show Login Page + Send Login Form
 */
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

/**
 * @Route('/register') GET + POST;
 * Show Register Page + Send Register Form
 */
router.get('/register/:code_es?',
  UserController.ensureIsNotAuthenticated,
  IndexController.getRegister)
  .post('/register/:code_es?',
    UserController.ensureIsNotAuthenticated,
    UserController.validate('create'),
    UserController.create);

/**
 * @Route('/logout') GET;
 * Logout user
 */
router.get('/logout', UserController.ensureAuthenticated, IndexController.getLogout);

/**
 * @Route('/404') GET;
 * 404 Page
 */
router.get('/404', IndexController.get404);

module.exports = router;
