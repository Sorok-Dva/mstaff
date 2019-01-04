const express = require('express');
const router = express.Router();

const EstablishmentController = require('../controllers/establishment');

/**
 * @Route('/') GET;
 * Show Index page
 */
router.get('/', EstablishmentController.getIndex);

module.exports = router;
