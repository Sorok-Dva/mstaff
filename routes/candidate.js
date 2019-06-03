const { Authentication, HTTPValidation } = require('../middlewares/index');
const { BackError } = require('../helpers/back.error');
const { User } = require('../components');
const mkdirp = require('mkdirp');
const multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdirp(`./public/uploads/avatars`, err => cb(err, './public/uploads/avatars/'));
  },
  filename: function (req, file, cb) {
    req.body.filename = Date.now() + '.png';
    cb(null, req.body.filename)
  }
});
const upload = multer({ storage: storage,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new BackError('Seul les formats .png, .jpg et .jpeg sont autorisés.', 403))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024
  }
});
const express = require('express');
const router = express.Router();

/**
 * @Route('/profile') GET;
 * Show user profile.
 */
router.get('/profile',
  Authentication.ensureIsCandidate,
  User.Candidate.viewProfile);

/**
 * @Route('/welcome') GET;
 * Show upload page.
 */
router.get('/welcome',
  Authentication.ensureIsCandidate,
  User.Candidate.viewUpload);

/**
 * @Route('/profile/edit') GET | POST;
 * Form for edit user profile.
 */
router.get(
  '/profile/edit', Authentication.ensureIsCandidate,
  User.Candidate.ViewEditProfile
).post(
  '/profile/edit',
  Authentication.ensureIsCandidate,
  HTTPValidation.UserController.normalizeEmail,
  User.Candidate.EditProfile);

/**
 * @Route('/profile/upload') POST;
 * Form for edit user avatar.
 */
router.post(
  '/profile/upload', Authentication.ensureIsCandidate,
  upload.single('avatar'),
  User.Candidate.UploadImageProfile);

/**
 * @Route('/formations') GET;
 * Show Formations and Experiences user page
 */
router.get('/formations',
  Authentication.ensureIsCandidate,
  User.Candidate.getFormationsAndXP);

/**
 * @Route('/knowledges') GET;
 * Show knowledges user page
 */
router.get('/knowledges',
  Authentication.ensureIsCandidate,
  User.Candidate.getKnowledge);

/**
 * @Route('/documents') GET;
 * Show documents user page
 */
router.get('/documents',
  Authentication.ensureIsCandidate,
  User.Candidate.getDocuments);

/**
 * @Route('/applications') GET;
 * Show applications user page
 */
router.get('/applications',
  Authentication.ensureIsCandidate,
  User.Candidate.getWishes);

/**
 * @Route('/applications/new') GET;
 * Show new application form page
 */
router.get('/applications/new',
  Authentication.ensureIsCandidate,
  User.Candidate.addApplication);

/**
 * @Route('/add/Experience') POST;
 * add Candidate Experience.
 */
router.post('/add/experience',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddExperience,
  User.Candidate.AddExperience
);

/**
 * @Route('/add/Formation') POST;
 * add Candidate Formation.
 */
router.post('/add/formation',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddFormation,
  User.Candidate.AddFormation
);

/**
 * @Route('/add/Diploma') POST;
 * add Candidate Diploma.
 */
router.post('/add/diploma',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.postAddDiploma,
  User.Candidate.AddDiploma
);

router.get('/wish/edit/:id(\\d+)',
  Authentication.ensureIsCandidate,
  HTTPValidation.CandidateController.getEditWish,
  User.Candidate.getEditWish);

router.post('/profile/passwordReset',
  Authentication.ensureAuthenticated,
  //HTTPValidation.CandidateController.checkPassEdit,
  User.Main.changePassword);
/**
 * @Route('/conferences') GET;
 * Show Calendar page.
 */
router.get('/conferences',
  Authentication.ensureIsCandidate,
  User.Candidate.viewConferences);

router.get('/pools',
  Authentication.ensureIsCandidate,
  User.Candidate.viewPools);

router.get('/my-pools',
  Authentication.ensureIsCandidate,
  User.Candidate.viewMyPools
).post('/my-pools',
  Authentication.ensureAuthenticated,
  User.Candidate.addPoolServices
);

module.exports = router;
