const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user');
const EstablishmentController = require('../../controllers/establishment');

router.post('/:id/search/candidates', UserController.ensureIsEs, EstablishmentController.apiSearchCandidates);

module.exports = router;