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

router.post('/:type/add', UserController.ensureIsCandidate, CandidateController.addRating);
router.post('/rate/:type/:id', UserController.ensureIsCandidate, CandidateController.starsRating);
router.delete('/:type/:id', UserController.ensureIsCandidate, CandidateController.deleteRating);

router.post('/wish/add', UserController.ensureIsCandidate, CandidateController.addWish);

module.exports = router;