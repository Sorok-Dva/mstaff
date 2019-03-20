const { Authentication, HTTPValidation } = require('../middlewares/index');
const { User } = require('../components');
const express = require('express');
const router = express.Router();

/**
 * @Route('/profile') GET;
 * Show user profile.
 */
router.get('/profile',
  Authentication.ensureIsCandidate,
  User.Candidate.getProfile);

/**
 * @Route('/profile/edit') GET | POST;
 * Form for edit user profile.
 */
router.get(
  '/profile/edit', Authentication.ensureIsCandidate,
  User.Candidate.ViewEditProfile
).post(
  '/profile/edit',
  Authentication.ensureIsCandidate,
  User.Candidate.EditProfile);

/**
 * @Route('/formations') GET;
 * Show Formations and Experiences user page
 */
router.get('/formations',
  Authentication.ensureIsCandidate,
  User.Candidate.getFormationsAndXP);

/**
 * @Route('/knowledges') GET;
 * Show knowledges user page
 */
router.get('/knowledges',
  Authentication.ensureIsCandidate,
  User.Candidate.getKnowledge);

/**
 * @Route('/documents') GET;
 * Show documents user page
 */
router.get('/documents',
  Authentication.ensureIsCandidate,
  User.Candidate.getDocuments);

/**
 * @Route('/applications') GET;
 * Show applications user page
 */
router.get('/applications',
  Authentication.ensureIsCandidate,
  User.Candidate.getWishes);

/**
 * @Route('/applications/new') GET;
 * Show new application form page
 */
router.get('/applications/new',
  Authentication.ensureIsCandidate,
  User.Candidate.addApplication);

/**
 * @Route('/add/Experience') POST;
 * add Candidate Experience.
 */
router.post('/add/experience',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddExperience,
  User.Candidate.AddExperience
);

/**
 * @Route('/add/Formation') POST;
 * add Candidate Formation.
 */
router.post('/add/formation',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddFormation,
  User.Candidate.AddFormation
);

/**
 * @Route('/add/Diploma') POST;
 * add Candidate Diploma.
 */
router.post('/add/diploma',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddDiploma,
  User.Candidate.AddDiploma
);

router.get('/wish/edit/:id',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.getEditWish,
  User.Candidate.getEditWish);

module.exports = router;
