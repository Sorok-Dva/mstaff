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
 * Show Index page
 */
router.get('/need/add', UserController.ensureIsEs, EstablishmentController.addNeed);

module.exports = router;
