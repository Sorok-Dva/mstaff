const { Authentication } = require('../../middlewares/index');
const Controller = require('../../controllers/establishment');
const express = require('express');
const router = express.Router();

router.post('/:esId(\\d+)/search/candidates',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.Establishment.Application.getCandidates
);

router.post('/:esId(\\d+)/get/user/:userId',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.apiGetCandidate
);

router.post('/:esId(\\d+)/addNeed',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.Establishment.Need.Create);

router.post('/:esId(\\d+)/need/:id(\\d+)/:action/user/:candidateId',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.apiNeedCandidate
);

router.post('/:esId(\\d+)/user/:candidateId/:action',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.apiFavCandidate
);

module.exports = router;