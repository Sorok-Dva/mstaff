const { Authentication, HTTPValidation } = require('../../middlewares/index');
const CandidateController = require('../../controllers/candidate');
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


/**
 * @Route('/api/user/:action/video') POST;
 * Candidate upload video/ delete to his profile.
 */
router.post('/:action/video', Authentication.ensureIsCandidate, videoUpload, CandidateController.postVideo);

router.post('/add/document', Authentication.ensureIsCandidate, docsUpload, CandidateController.uploadDocument);

router.post('/add/photo', Authentication.ensureIsCandidate, avatarUpload, CandidateController.uploadAvatar);

router.get('/xp/:id', Authentication.ensureIsCandidate, CandidateController.getXpById)
  .delete('/xp/:id', Authentication.ensureIsCandidate, CandidateController.removeXP);

router.get('/formation/:id', Authentication.ensureIsCandidate, CandidateController.getFormationById)
  .delete('/formation/:id', Authentication.ensureIsCandidate, CandidateController.removeFormation)
  .put('/formation/:id',
    Authentication.ensureIsCandidate,
    HTTPValidation.CandidateController.putFormation,
    CandidateController.putFormation
  );

router.get('/diploma/:id', Authentication.ensureIsCandidate, CandidateController.getDiplomaById)
  .delete('/diploma/:id', Authentication.ensureIsCandidate, CandidateController.removeDiploma);

router.post('/type/:type/add', Authentication.ensureIsCandidate, CandidateController.addRating);
router.post('/rate/:type/:id', Authentication.ensureIsCandidate, CandidateController.starsRating);
router.delete('/type/:type/:id', Authentication.ensureIsCandidate, CandidateController.deleteRating);

router.get('/wish/:id',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.getWish,
  CandidateController.getWish)
  .post('/wish/add', Authentication.ensureIsCandidate, CandidateController.addWish)
  .delete('/wish/:id',
    Authentication.ensureIsCandidate,
    HTTPValidation.CandidateController.removeWish,
    CandidateController.removeWish
  )
  .put('/wish/:id',
    Authentication.ensureIsCandidate,
    CandidateController.editWish
  );


module.exports = router;