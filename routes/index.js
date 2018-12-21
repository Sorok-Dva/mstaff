const express = require('express');
const router = express.Router();
const passport = require('../bin/passport');
const middleware = require('../middlewares');

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

/**
 * @Route('/profile') GET;
 * Show user profile.
 */
router.get('/profile', UserController.ensureAuthenticated, IndexController.getProfile);
/**
 * @Route('/profile/edit') GET;
 * Form for edit user profile.
 */
router.get('/profile/edit', UserController.ensureAuthenticated, IndexController.getEditProfile);

module.exports = router;
