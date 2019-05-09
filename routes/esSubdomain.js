const { Authentication } = require('../middlewares/index');
const { Establishment, User } = require('../components');
const { HTTPValidation } = require('../middlewares/');
const express = require('express');
const router = express.Router();

router.get('/',
  Establishment.Website.ViewIndex);

router.get('/register',
  Authentication.ensureIsNotAuthenticated,
  Establishment.Website.ViewRegister)
  .post('/register',
    Authentication.ensureIsNotAuthenticated,
    HTTPValidation.UserController.create,
    User.Main.create);

router.post('/add/diploma',
  Authentication.ensureIsNotAuthenticated,
  HTTPValidation.CandidateController.postAddDiploma,
  User.Candidate.AddDiploma
);

router.post('/add/experience',
  //TODO verifier user id si pas d authentification
  // Authentication.ensureIsNotAuthenticated,
  HTTPValidation.CandidateController.postAddExperience,
  User.Candidate.AddExperience
);



router.get('/emailAvailable/:email',
  HTTPValidation.UserController.ApiVerifyEmailAvailability,
  User.Main.verifyEmailAvailability);

router.get('/posts/all',
  Establishment.Website.GetPosts);

router.get('/services/all',
  Establishment.Website.GetServices);

router.get('/atsDatas/all',
  Establishment.Website.GetAtsDatas);


module.exports = router;