const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const EstablishmentController = require('../controllers/establishment');

/**
 * @Route('/select/es') GET;
 * Show Select Establishments Page
 */
router.get('/select/es', UserController.ensureIsEs, EstablishmentController.getSelectEs);

/**
 * @Route('/candidates') GET;
 * Show Candidates Index page
 */
router.get('/candidates', UserController.ensureIsEs, EstablishmentController.addNeed);

/**
 * @Route('/needs') GET;
 * Show Needs Index page
 */
router.get('/needs', UserController.ensureIsEs, EstablishmentController.getNeeds);

/**
 * @Route('/need/:id') GET;
 * Show Specific Need Page
 */
router.get('/need/:id', UserController.ensureIsEs, EstablishmentController.showNeed);

module.exports = router;
