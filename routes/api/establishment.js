const { Authentication } = require('../../middlewares/index');
const Controller = require('../../controllers/establishment');
const { Conference, Establishment, User } = require('../../components');
const express = require('express');
const router = express.Router();

router.post('/:esId(\\d+)/search/candidates',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Application.getCandidates
);

router.post('/:esId(\\d+)/get/candidate/:userId(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  User.Candidate.getProfile
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
  Controller.apiNeedCandidate
);

router.post('/:esId(\\d+)/need/:id(\\d+)/candidate/:candidateId(\\d+)/conference',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Conference.Main.create
);

router.post('/:esId(\\d+)/candidate/:candidateId(\\d+)/:action',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.apiFavCandidate
);

router.post('/:esId(\\d+)/feedback',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Establishment.Need.Feedback);

router.get('/:esId(\\d+)/conference/:id(\\d+)',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Conference.Main.viewConference_ES);

module.exports = router;