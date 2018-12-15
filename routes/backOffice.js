const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const BackOfficeController = require('../controllers/backOffice');

/**
 * @Route('/back-office/') GET;
 * Show Back Office Index page
 */
router.get('/', UserController.ensureIsAdmin, BackOfficeController.index);

module.exports = router;
