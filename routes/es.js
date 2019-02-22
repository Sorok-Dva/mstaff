const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const EstablishmentController = require('../controllers/establishment');

/**
 * @Route('/needs') GET;
 * Show Index page
 */
router.get('/needs', UserController.ensureIsEs, EstablishmentController.getNeeds);

/**
 * @Route('/need/add') GET;
 * Show Add Need page
 */
router.get('/need/add', UserController.ensureIsEs, EstablishmentController.addNeed);

/**
 * @Route('/need/:id') GET;
 * Show Specific Need Page
 */
router.get('/need/:id', UserController.ensureIsEs, EstablishmentController.showNeed);

module.exports = router;
