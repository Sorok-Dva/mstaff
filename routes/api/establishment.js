const { Authentication } = require('../../middlewares/index');
const EstablishmentController = require('../../controllers/establishment');
const express = require('express');
const router = express.Router();

router.post('/:esId/search/candidates',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  EstablishmentController.apiSearchCandidates
);

router.post('/:esId/get/candidate/:userId',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  EstablishmentController.apiGetCandidate
);

router.post('/:esId/addNeed', Authentication.ensureIsEs && Authentication.verifyEsAccess, EstablishmentController.apiAddNeed);

router.post('/:esId/need/:id/:action/candidate/:candidateId',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  EstablishmentController.apiNeedCandidate
);

router.post('/:esId/candidate/:candidateId/:action',
  Authentication.ensureIsEs && Authentication.verifyEsAccess,
  EstablishmentController.apiFavCandidate
);

router.get('/')

module.exports = router;