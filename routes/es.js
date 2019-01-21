const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const EstablishmentController = require('../controllers/establishment');

/**
 * @Route('/index') GET;
 * Show Index page
 */
router.get('/index', UserController.ensureIsEs, EstablishmentController.getIndex);

module.exports = router;
