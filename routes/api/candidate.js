const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/candidates/videos/')
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}${Date.now()}.${file.mimetype.split('/')[1]}`)
  }
});
const videoUpload = multer({ storage: storage }).single('file');

const UserController = require('../../controllers/user');
const CandidateController = require('../../controllers/candidate');

/**
 * @Route('/api/candidate/add/video') POST;
 * Candidate upload video to his profile.
 */
router.post('/add/video', UserController.ensureIsCandidate, videoUpload, CandidateController.addVideo);
/**
 * @Route('/api/candidate/delete/video') POST;
 * Remove candidate video
 */
router.post('/delete/video', UserController.ensureIsCandidate, CandidateController.deleteVideo);
router.get('/xp/:id', UserController.ensureIsCandidate, CandidateController.getXpById)
  .delete('/xp/:id', UserController.ensureIsCandidate, CandidateController.removeXP);
router.get('/formation/:id', UserController.ensureIsCandidate, CandidateController.getFormationById)
  .delete('/formation/:id', UserController.ensureIsCandidate, CandidateController.removeFormation)
  .put('/formation/:id',
    UserController.ensureIsCandidate,
    CandidateController.validate('putFormation'),
    CandidateController.putFormation
  );
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