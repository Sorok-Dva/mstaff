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

module.exports = router;