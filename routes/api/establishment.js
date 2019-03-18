const { Authentication } = require('../../middlewares/index');
const Controller = require('../../controllers/establishment');
const express = require('express');
const router = express.Router();

router.post('/:esId/search/candidates',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.Establishment.Application.getCandidates
);

router.post('/:esId/get/candidate/:userId',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.apiGetCandidate
);

router.post('/:esId/addNeed',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.Establishment.Need.Create);

router.post('/:esId/need/:id/:action/candidate/:candidateId',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.apiNeedCandidate
);

router.post('/:esId/candidate/:candidateId/:action',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  Controller.apiFavCandidate
);

module.exports = router;