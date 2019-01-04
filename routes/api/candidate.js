const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user');
const CandidateController = require('../../controllers/candidate');

router.get('/xp/:id', UserController.ensureIsCandidate, CandidateController.getXpById)
  .delete('/xp/:id', UserController.ensureIsCandidate, CandidateController.removeXP);
router.get('/formation/:id', UserController.ensureIsCandidate, CandidateController.getFormationById)
  .delete('/formation/:id', UserController.ensureIsCandidate, CandidateController.removeFormation);
router.get('/diploma/:id', UserController.ensureIsCandidate, CandidateController.getDiplomaById)
  .delete('/diploma/:id', UserController.ensureIsCandidate, CandidateController.removeDiploma);
module.exports = router;