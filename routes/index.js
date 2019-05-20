const { Authentication, Express, HTTPValidation } = require('../middlewares');
const { Render, User } = require('../components');
const express = require('express');
const router = express.Router();
const passport = require('../bin/passport');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  max: 10, // start blocking after 3 requests
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
router.get('/', Render.View.Index);

/**
 * @Route('/login') GET + POST;
 * Show Login Page + Send Login Form
 */
router.get('/login',
  Authentication.ensureIsNotAuthenticated,
  Render.View.Login)
  .post('/login',
    loginLimiter,
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.IndexController.login,
    Express.passportAuthentication,
    Render.View.Redirect);

/**
 * @Route('/register') GET + POST;
 * Show Register Page + Send Register Form (for new candidates)
 */
router.get('/register',
  Authentication.ensureIsNotAuthenticated,
  Render.View.Register)
  .post('/register',
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.UserController.create,
    User.Main.create);

router.get('/validate/:key',
  Authentication.ensureIsNotAuthenticated,
  User.Main.ValidateAccount);

router.get('/new/password/:key',
  Authentication.ensureIsNotAuthenticated,
  Render.View.resetPassword)
  .post('/new/password/:key',
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.UserController.resetPassword,
    User.Main.resetPassword);

/**
 * @Route('/register/demo') GET + POST;
 * Show Register Page + Send Register Form (for new establishments)
 */
router.get('/demo/register',
  Authentication.ensureIsNotAuthenticated,
  Render.View.RegisterDemo);

/**
 * @Route('/logout') GET;
 * Logout user
 */
router.get('/logout',
  Authentication.ensureAuthenticated,
  Render.View.Logout);

/**
 * @Route('/reset/password') GET + POST;
 * Reset Password
 */
router.get('/reset/password',
  Authentication.ensureIsNotAuthenticated,
  Render.View.ResetPassword)
  .post('/reset/password',
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.UserController.ApiVerifyEmailAvailability,
    User.Main.sendResetPassword);

/**
 * @Route('/404') GET;
 * 404 Page
 */
router.get('/404', Render.View._404);

module.exports = router;
