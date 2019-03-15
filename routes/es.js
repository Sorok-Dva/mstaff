const { Authentication } = require('../middlewares/index');
const EstablishmentController = require('../controllers/establishment');
const express = require('express');
const router = express.Router();

/**
 * @Route('/select/es') GET;
 * Show Select Establishments Page
 */
router.get('/select/es', Authentication.ensureIsEs, EstablishmentController.getSelectEs);

router.get('/select/es/:currentEsId', Authentication.ensureIsEs, EstablishmentController.APISelectEs);

/**
 * @Route('/candidates') GET;
 * Show Candidates Index page
 */
router.get('/candidates', Authentication.ensureIsEs, EstablishmentController.addNeed);

/**
 * @Route('/needs') GET;
 * Show Needs Index page
 */
router.get('/needs', Authentication.ensureIsEs, EstablishmentController.getNeeds);

/**
 * @Route('/need/:id') GET;
 * Show Specific Need Page
 */
router.get('/need/:id', Authentication.ensureIsEs, EstablishmentController.showNeed);

module.exports = router;
