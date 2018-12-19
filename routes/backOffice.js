const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const BackOfficeController = require('../controllers/backOffice');

/**
 * @Route('/back-office/') GET;
 * Show Back Office Index page
 */
router.get('/', UserController.ensureIsAdmin, BackOfficeController.index);

/**
 * @Route('/back-office/stats') GET;
 * Show Back Office Stats page
 */
router.get('/stats', UserController.ensureIsAdmin, BackOfficeController.stats);

/**
 * @Route('/back-office/users/') GET;
 * Show Users List page
 */
router.get('/users', UserController.ensureIsAdmin, BackOfficeController.getUsers);

module.exports = router;
