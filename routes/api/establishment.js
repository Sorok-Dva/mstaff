const { Authentication } = require('../../middlewares/index');
const { Conference, Establishment, User } = require('../../components');
const mkdirp = require('mkdirp');
const multer = require('multer');
const express = require('express');

const router = express.Router();

const storage = (path, type) => multer.diskStorage({
  destination: (req, file, cb) => mkdirp(`./public/uploads/${path}`, err => cb(err, `./public/uploads/${path}`)),
  filename: (req, file, cb) => {
    let filename = `${req.user.id}${Date.now()}_${file.fieldname}`;
    cb(null, `${filename}.${file.mimetype.split('/')[1]}`)
  }
});

const logoUpload = multer({ storage: storage('es/offers/', 'photo') }).single('logo');

router.post('/:esId(\\d+)/search/candidates',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Application.getCandidates
);

router.post('/:esId(\\d+)/paginate/candidates/:page(\\d+)/:size(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Application.CVsPaginationQuery
);

router.post('/:esId(\\d+)/candidates/:type',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Application.CVsMyCandidatesQuery
);

router.post('/:esId(\\d+)/get/candidate/:userId(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  User.Candidate.getProfile
);

router.post('/:esId(\\d+)/get/candidate/:userId(\\d+)/applications',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  User.Candidate.getApplicationsInEs
);

router.post('/:esId(\\d+)/addNeed',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.Create);

router.get('/:esId(\\d+)/need/:id(\\d+)/newCandidates',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.getNewCandidates
);

router.post('/:esId(\\d+)/need/:id(\\d+)/:action/candidate/:candidateId(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.CandidateAction
);

router.post('/:esId(\\d+)/need/:id(\\d+)/candidate/:candidateId(\\d+)/conference',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Conference.Main.create
);

router.post('/:esId(\\d+)/candidate/:candidateId(\\d+)/:action',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.favCandidate
);

router.post('/:esId(\\d+)/feedback',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.Feedback);

router.get('/:esId(\\d+)/conference/:id(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Conference.Main.viewConference_ES);

router.post('/conference/:id(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Conference.Main.edit);

router.post('/conference/:id(\\d+)/changeDate',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Conference.Main.changeDate);

/**
 * @Route('/need/:id(\\d+)/edit') POST;
 * Post edit need
 */
router.post('/need/:editNeedId(\\d+)/edit',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.edit);

/**
 * @Route('/need/:id(\\d+)/') DELETE;
 * DELETE need
 */
router.delete('/need/:id(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.delete);

/**
 * @Route('/:esId(\d+)/create/offer/fromNeed/:needId(\\d+)/') POST;
 * Create Offer from Need
 */
router.post('/:esId(\\d+)/create/offer/fromNeed/:needId(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Offer.Create);

/**
 * @Route('/conference/:id(\\d+)') DELETE;
 * Delete conference
 */
router.delete('/conference/:id(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Conference.Main.delete);

/**
 * @Route('/job_board/offer/:id(\\d+)/:action/logo') POST;
 * Upload / Remove logo for offer
 */
router.post('/job_board/offer/:id(\\d+)/:action/logo',
  Authentication.ensureIsEs,
  logoUpload,
  Establishment.Offer.UploadLogo)
;
module.exports = router;