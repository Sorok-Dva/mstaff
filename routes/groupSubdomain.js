const { Authentication } = require('../middlewares/index');
const { Subdomain, User } = require('../components');
const { HTTPValidation } = require('../middlewares/');
const express = require('express');
const router = express.Router();

router.get('/postuler', (req, res, next) => res.redirect('/join'));

router.get('/',
  Subdomain.Group.ViewIndex);

router.get('/join',
  Subdomain.Group.ViewATS);

router.get('/atsDatas/all',
  Subdomain.Establishment.GetAtsDatas);

router.get('/emailAvailable/:email',
  HTTPValidation.UserController.ApiVerifyEmailAvailability,
  User.Main.verifyEmailAvailability);

router.post('/register',
  Authentication.ensureIsNotAuthenticated,
  HTTPValidation.UserController.create,
  User.Main.create
);

router.post('/ats/add/all',
  Authentication.ensureIsNotAuthenticated,
  User.Candidate.ATSAddAll
);

module.exports = router;