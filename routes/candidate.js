const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const CandidateController = require('../controllers/candidate');

/**
 * @Route('/profile') GET;
 * Show user profile.
 */
router.get('/profile', UserController.ensureIsCandidate, CandidateController.getProfile);

/**
 * @Route('/profile/edit') GET | POST;
 * Form for edit user profile.
 */
router.get('/profile/edit', UserController.ensureIsCandidate, CandidateController.getEditProfile)
  .post('/profile/edit', UserController.ensureIsCandidate, CandidateController.getEditProfile);

/**
 * @Route('/formations') GET;
 * Show Formations and Experiences candidate page
 */
router.get('/formations', UserController.ensureIsCandidate, CandidateController.getFormationsAndXP);

/**
 * @Route('/knowledges') GET;
 * Show knowledges candidate page
 */
router.get('/knowledges', UserController.ensureIsCandidate, CandidateController.getKnowledge);

/**
 * @Route('/documents') GET;
 * Show documents candidate page
 */
router.get('/documents', UserController.ensureIsCandidate, CandidateController.getDocuments);

/**
 * @Route('/applications') GET;
 * Show applications candidate page
 */
router.get('/applications', UserController.ensureIsCandidate, CandidateController.getWishes);

/**
 * @Route('/applications/new') GET;
 * Show new application form page
 */
router.get('/applications/new', UserController.ensureIsCandidate, CandidateController.addApplication);

/**
 * @Route('/add/Experience') POST;
 * add Candidate Experience.
 */
router.post('/add/Experience',
  UserController.ensureIsCandidate,
  CandidateController.validate('postAddExperience'),
  CandidateController.postAddExperience
);

/**
 * @Route('/add/Formation') POST;
 * add Candidate Formation.
 */
router.post('/add/Formation',
  UserController.ensureIsCandidate,
  CandidateController.validate('postAddFormation'),
  CandidateController.postAddFormation
);

/**
 * @Route('/add/Diploma') POST;
 * add Candidate Diploma.
 */
router.post('/add/Diploma',
  UserController.ensureIsCandidate,
  CandidateController.validate('postAddDiploma'),
  CandidateController.postAddDiploma
);

module.exports = router;
