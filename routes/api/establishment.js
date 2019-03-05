const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user');
const EstablishmentController = require('../../controllers/establishment');

router.post('/:esId/search/candidates',
  UserController.ensureIsEs && EstablishmentController.verifyEsAccess,
  EstablishmentController.apiSearchCandidates
);

router.post('/:esId/get/candidate/:userId',
  UserController.ensureIsEs && EstablishmentController.verifyEsAccess,
  EstablishmentController.apiGetCandidate
);

router.post('/:esId/addNeed', UserController.ensureIsEs && EstablishmentController.verifyEsAccess, EstablishmentController.apiAddNeed);

router.post('/:esId/need/:id/:action/candidate/:candidateId',
  UserController.ensureIsEs && EstablishmentController.verifyEsAccess,
  EstablishmentController.apiNeedCandidate
);

router.post('/:esId/candidate/:candidateId/:action',
  UserController.ensureIsEs && EstablishmentController.verifyEsAccess,
  EstablishmentController.apiFavCandidate
);

module.exports = router;