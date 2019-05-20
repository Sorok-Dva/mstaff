const { Authentication } = require('../middlewares/index');
const { Subdomain, User } = require('../components');
const { HTTPValidation } = require('../middlewares/');
const express = require('express');
const router = express.Router();

router.get('/',
  Subdomain.Establishment.ViewIndex);

// router.get('/join',
//   Subdomain.Establishment.ViewATS);

router.get('/register',
  Authentication.ensureIsNotAuthenticated,
  Subdomain.Establishment.ViewRegister)
  .post('/register',
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.UserController.create,
    User.Main.create);

router.post('/add/experience',
  //TODO verifier user id si pas d authentification
  // Authentication.ensureIsNotAuthenticated,
  // HTTPValidation.CandidateController.postAddExperience,
  User.Candidate.AddExperiences
);

router.post('/add/diploma',
  Authentication.ensureIsNotAuthenticated,
  HTTPValidation.CandidateController.postAddDiploma,
  User.Candidate.AddDiploma
);

router.get('/emailAvailable/:email',
  HTTPValidation.UserController.ApiVerifyEmailAvailability,
  User.Main.verifyEmailAvailability);

router.get('/posts/all',
  Subdomain.Establishment.GetPosts);

router.get('/services/all',
  Subdomain.Establishment.GetServices);

router.get('/atsDatas/all',
  Subdomain.Establishment.GetAtsDatas);

module.exports = router;