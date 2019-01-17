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

router.post('/rate/skill/:id', UserController.ensureIsCandidate, CandidateController.rateSkill);
router.post('/rate/equipment/:id', UserController.ensureIsCandidate, CandidateController.rateEquipment);
router.post('/rate/software/:id', UserController.ensureIsCandidate, CandidateController.rateSoftware);

router.delete('/skill/:id', UserController.ensureIsCandidate, CandidateController.deleteSkill);
router.delete('/equipment/:id', UserController.ensureIsCandidate, CandidateController.deleteEquipment);
router.delete('/software/:id', UserController.ensureIsCandidate, CandidateController.deleteSoftware);

router.post('/skills/add', UserController.ensureIsCandidate, CandidateController.addSkill);
router.post('/equipments/add', UserController.ensureIsCandidate, CandidateController.addEquipment);
router.post('/softwares/add', UserController.ensureIsCandidate, CandidateController.addSoftware);

router.post('/wish/add', UserController.ensureIsCandidate, CandidateController.addWish);

module.exports = router;