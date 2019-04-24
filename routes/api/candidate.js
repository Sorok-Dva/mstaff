const __ = process.cwd();
const { Authentication, HTTPValidation } = require(`${__}/middlewares/index`);
const { User, Establishment, Conference } = require(`${__}/components`);
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

router.post('/availability',
  Authentication.ensureIsCandidate,
  User.Candidate.setAvailability);

/**
 * @Route('/api/user/:action/video') POST;
 * Candidate upload video/ delete to his profile.
 */
router.post('/:action/video',
  Authentication.ensureIsCandidate,
  videoUpload,
  User.Candidate.addVideo);

router.post('/add/document',
  Authentication.ensureIsCandidate,
  docsUpload,
  User.Candidate.uploadDocument);

router.delete('/document/:id(\\d+)',
  Authentication.ensureIsCandidate,
  User.Candidate.deleteDocument);

router.post('/add/photo',
  Authentication.ensureIsCandidate,
  avatarUpload,
  User.Candidate.uploadAvatar);

router.get('/xp/:id(\\d+)',
  Authentication.ensureIsCandidate,
  User.Candidate.getXpById)
  .delete('/xp/:id(\\d+)',
    Authentication.ensureIsCandidate,
    User.Candidate.removeXP)
  .put('/xp/:id(\\d+)',
    Authentication.ensureIsCandidate,
    User.Candidate.putXP
  );

router.get('/formation/:id(\\d+)',
  Authentication.ensureIsCandidate,
  User.Candidate.getFormationById)
  .delete('/formation/:id(\\d+)',
    Authentication.ensureIsCandidate,
    User.Candidate.removeFormation)
  .put('/formation/:id(\\d+)',
    Authentication.ensureIsCandidate,
    HTTPValidation.CandidateController.putFormation,
    User.Candidate.putFormation
  );

router.get('/diploma/:id(\\d+)',
  Authentication.ensureIsCandidate,
  User.Candidate.getDiplomaById)
  .delete('/diploma/:id(\\d+)',
    Authentication.ensureIsCandidate,
    User.Candidate.removeDiploma)
  .put('/diploma/:id(\\d+)',
    Authentication.ensureIsCandidate,
    User.Candidate.putDiploma);

router.post('/type/:type/add',
  Authentication.ensureIsCandidate,
  User.Candidate.addRating);
router.post('/rate/:type/:id(\\d+)',
  Authentication.ensureIsCandidate,
  User.Candidate.starsRating);
router.delete('/type/:type/:id(\\d+)',
  Authentication.ensureIsCandidate,
  User.Candidate.deleteRating);

router.get('/wish/:id(\\d+)',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.getWish,
  User.Candidate.getWish)
  .post('/wish/add',
    Authentication.ensureIsCandidate,
    User.Candidate.addWish)
  .delete('/wish/:id(\\d+)',
    Authentication.ensureIsCandidate,
    HTTPValidation.CandidateController.removeWish,
    User.Candidate.removeWish
  )
  .put('/wish/:id(\\d+)',
    Authentication.ensureIsCandidate,
    User.Candidate.editWish
  );

router.post('/nc/:id(\\d+)/availability',
  Authentication.ensureIsCandidate,
  Establishment.Need.candidateAnswer
);

router.post('/conference/:id(\\d+)/availability',
  Authentication.ensureIsCandidate,
  Conference.Main.candidateAnswer
);

router.get('/conference/:id(\\d+)',
  Authentication.ensureIsCandidate,
  Conference.Main.viewConference_Candidate);

module.exports = router;