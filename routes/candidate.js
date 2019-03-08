const { Authentication, HTTPValidation } = require('../middlewares/index');
const CandidateController = require('../controllers/candidate');
const express = require('express');
const router = express.Router();

/**
 * @Route('/profile') GET;
 * Show user profile.
 */
router.get('/profile', Authentication.ensureIsCandidate, CandidateController.getProfile);

/**
 * @Route('/profile/edit') GET | POST;
 * Form for edit user profile.
 */
router.get('/profile/edit', Authentication.ensureIsCandidate, CandidateController.getEditProfile)
  .post('/profile/edit', Authentication.ensureIsCandidate, CandidateController.postEditProfile);

/**
 * @Route('/formations') GET;
 * Show Formations and Experiences candidate page
 */
router.get('/formations', Authentication.ensureIsCandidate, CandidateController.getFormationsAndXP);

/**
 * @Route('/knowledges') GET;
 * Show knowledges candidate page
 */
router.get('/knowledges', Authentication.ensureIsCandidate, CandidateController.getKnowledge);

/**
 * @Route('/documents') GET;
 * Show documents candidate page
 */
router.get('/documents', Authentication.ensureIsCandidate, CandidateController.getDocuments);

/**
 * @Route('/applications') GET;
 * Show applications candidate page
 */
router.get('/applications', Authentication.ensureIsCandidate, CandidateController.getWishes);

/**
 * @Route('/applications/new') GET;
 * Show new application form page
 */
router.get('/applications/new', Authentication.ensureIsCandidate, CandidateController.addApplication);

/**
 * @Route('/add/Experience') POST;
 * add Candidate Experience.
 */
router.post('/add/experience',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddExperience,
  CandidateController.postAddExperience
);

/**
 * @Route('/add/Formation') POST;
 * add Candidate Formation.
 */
router.post('/add/formation',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddFormation,
  CandidateController.postAddFormation
);

/**
 * @Route('/add/Diploma') POST;
 * add Candidate Diploma.
 */
router.post('/add/diploma',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddDiploma,
  CandidateController.postAddDiploma
);

module.exports = router;
