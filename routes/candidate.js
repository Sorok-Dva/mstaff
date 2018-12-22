const express = require('express');
const router = express.Router();
const middleware = require('../middlewares');

const UserController = require('../controllers/user');
const CandidateController = require('../controllers/candidate');

/**
 * @Route('/profile') GET;
 * Show user profile.
 */
router.get('/profile', UserController.ensureIsCandidate, CandidateController.getProfile);
/**
 * @Route('/profile/edit') GET;
 * Form for edit user profile.
 */
router.get('/profile/edit',
  UserController.ensureIsCandidate,
  CandidateController.getEditProfile)
  .post('/profile/edit',
    UserController.ensureIsCandidate,
    CandidateController.getEditProfile);

router.post('/profile/add/video', UserController.ensureIsCandidate, CandidateController.addVideo);

router.get('/formations', UserController.ensureIsCandidate, CandidateController.getFormationsAndXP);

module.exports = router;
