const { Authentication, Express, HTTPValidation } = require('../middlewares');
const express = require('express');
const router = express.Router();
const passport = require('../bin/passport');
const rateLimit = require('express-rate-limit');
const UserController = require('../controllers/user');
const IndexController = require('../controllers/index');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  max: 3, // start blocking after 3 requests
  handler: (req, res, next) => {
    req.flash('error_msg', 'Trop de tentatives de connexion sur ce compte. Veuillez réesayer dans 15 minutes.');
    return res.redirect('/login');
  },
  keyGenerator: function (req /*, res*/) {
    return req.body.email;
  },
});

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
  Authentication.ensureIsNotAuthenticated,
  IndexController.getLogin)
  .post('/login',
    loginLimiter,
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.IndexController.login,
    Express.passportAuthentication,
    IndexController.postLogin);

/**
 * @Route('/register') GET + POST;
 * Show Register Page + Send Register Form (for new candidates)
 */
router.get('/register/:esCode?',
  Authentication.ensureIsNotAuthenticated,
  IndexController.getRegister)
  .post('/register/:esCode?',
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.UserController.create,
    UserController.create);

router.get('/validate/:key', Authentication.ensureIsNotAuthenticated, IndexController.getValidateAccount);
router.get('/new/password/:key', Authentication.ensureIsNotAuthenticated, IndexController.resetPassword)
  .post('/new/password/:key', Authentication.ensureIsNotAuthenticated, HTTPValidation.UserController.resetPassword, UserController.resetPassword);

/**
 * @Route('/register/complete/profile') GET + POST;
 * Show Register Wizard for profile completion
 */
router.get('/register/complete/profile',
  Authentication.ensureIsNotAuthenticated,
  IndexController.getRegisterWizard);

/**
 * @Route('/register/demo') GET + POST;
 * Show Register Page + Send Register Form (for new establishments)
 */
router.get('/demo/register',
  Authentication.ensureIsNotAuthenticated,
  IndexController.getRegisterDemo);

/**
 * @Route('/logout') GET;
 * Logout user
 */
router.get('/logout', Authentication.ensureAuthenticated, IndexController.getLogout);

/**
 * @Route('/404') GET;
 * 404 Page
 */
router.get('/404', IndexController.get404);

module.exports = router;
