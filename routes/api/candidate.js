const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = (path, type) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/uploads/${path}`)
  },
  filename: (req, file, cb) => {
    let filename = type === 'video' ? `${req.user.id}${Date.now()}` : `${req.user.id}${Date.now()}_${file.fieldname}`;
    cb(null, `${filename}.${file.mimetype.split('/')[1]}`)
  }
});
const videoUpload = multer({ storage: storage('candidates/videos/', 'video') }).single('file');
const avatarUpload = multer({ storage: storage('candidates/images/', 'photo') }).single('file');
const docsUpload = multer({ storage: storage('candidates/documents/', 'doc') }).fields(
  [
    { name: 'CNI', maxCount: 1 }, // carte natinale d'identité
    { name: 'VIT', maxCount: 1 }, // Carte vitale ou attestation de protection santé
    { name: 'RIB', maxCount: 1 }, // Relevé d'identité bancaire
    { name: 'DIP', maxCount: 1 }, // Diplome
    { name: 'OrNa', maxCount: 1 }, // Inscription à l'ordre nationale
    { name: 'CV', maxCount: 1 }, // Curriculum Vitae
    { name: 'LM', maxCount: 1 }, // Lettre de Motivation
    { name: 'ADELI', maxCount: 1 }, // Justifiation de référencement ADELI
  ]
);

const UserController = require('../../controllers/user');
const CandidateController = require('../../controllers/candidate');

/**
 * @Route('/api/candidate/:action/video') POST;
 * Candidate upload video/ delete to his profile.
 */
router.post('/:action/video', UserController.ensureIsCandidate, videoUpload, CandidateController.postVideo);

router.post('/add/document', UserController.ensureIsCandidate, docsUpload, CandidateController.uploadDocument);

router.post('/add/photo', UserController.ensureIsCandidate, avatarUpload, CandidateController.uploadAvatar);

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