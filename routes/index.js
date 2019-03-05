const express = require('express');
const router = express.Router();
const passport = require('../bin/passport');
const middleware = require('../middlewares');
const rateLimit = require('express-rate-limit');

const UserController = require('../controllers/user');
const IndexController = require('../controllers/index');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  max: 3, // start blocking after 3 requests
  handler: (req, res, next) => {
    req.flash('error_msg', 'Trop de tentatives de connexion sur ce compte. Veuillez réessayer dans 15 minutes.');
    return res.redirect('/login');
  },
  keyGenerator: (req) => {
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
  UserController.ensureIsNotAuthenticated,
  IndexController.getLogin)
  .post('/login',
    loginLimiter,
    UserController.ensureIsNotAuthenticated,
    middleware.passportAuthentication,
    IndexController.postLogin);

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

router.get('/validate/:key', UserController.ensureIsNotAuthenticated, IndexController.getValidateAccount);

/**
 * @Route('/register/complete/profile') GET + POST;
 * Show Register Wizard for profile completion
 */
router.get('/register/complete/profile',
  UserController.ensureIsNotAuthenticated,
  IndexController.getRegisterWizard);

/**
 * @Route('/register/demo') GET + POST;
 * Show Register Page + Send Register Form (for new establishments)
 */
router.get('/demo/register',
  UserController.ensureIsNotAuthenticated,
  IndexController.getRegisterDemo);

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
