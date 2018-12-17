const express = require('express');
const router = express.Router();
const passport = require('../bin/passport');

const UserController = require('../controllers/user');
const IndexController = require('../controllers/index');
const EstablishmentController = require('../controllers/establishment');

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
 * Show Register Page + Send Register Form (for new candidates)
 */
router.get('/register/:esCode?',
  UserController.ensureIsNotAuthenticated,
  IndexController.getRegister)
  .post('/register/:esCode?',
    UserController.ensureIsNotAuthenticated,
    UserController.validate('create'),
    UserController.create);

/**
 * @Route('/register/demo') GET + POST;
 * Show Register Page + Send Register Form (for new establishments)
 */
router.get('/register/demo',
  UserController.ensureIsNotAuthenticated,
  IndexController.getRegisterDemo)
  .post('/register/demo',
    UserController.ensureIsNotAuthenticated,
    EstablishmentController.validate('create'),
    EstablishmentController.create);

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
