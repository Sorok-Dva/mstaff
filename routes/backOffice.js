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

/**
 * @Route('/back-office/users/candidates') GET;
 * Show Users (candidates type) List page
 */
router.get('/users/candidates', UserController.ensureIsAdmin, BackOfficeController.getCandidates);

/**
 * @Route('/back-office/users/es') GET;
 * Show Users (es type) List page
 */
router.get('/users/es', UserController.ensureIsAdmin, BackOfficeController.getESUsers);

/**
 * @Route('/back-office/user/:id/') GET;
 * Show User data
 */
router.get('/user/:id', UserController.ensureIsAdmin, BackOfficeController.getUser);

/**
 * @Route('/back-office/impersonate/user/:id/') GET;
 * Impersonate User Session
 */
router.get('/impersonate/user/:id', UserController.ensureIsAdmin, BackOfficeController.impersonateUser);

/**
 * @Route('/back-office/removeImpersonation/') GET;
 * Remove Impersonation
 */
router.get('/removeImpersonation', UserController.ensureIsAdmin, BackOfficeController.removeUserImpersonation);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/') GET;
 * Generate PinCode for Remove Read Only
 */
router.post('/impersonateRemoveReadOnly', UserController.ensureIsAdmin, BackOfficeController.impersonateRemoveReadOnly);
router.get('/impersonatePutReadOnly', UserController.ensureIsAdmin, BackOfficeController.impersonatePutReadOnly);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/validate/') GET;
 * Validation of removing read only
 */
router.post('/impersonateRemoveReadOnly/validate', UserController.ensureIsAdmin, BackOfficeController.impersonateRemoveReadOnlyValidation);

/**
 * @Route('/back-office/es/') GET;
 * Show ES List page
 */
router.get('/es', UserController.ensureIsAdmin, BackOfficeController.getESList);

/**
 * @Route('/back-office/es/:id') GET;
 * Show ES page
 */
router.get('/es/:id', UserController.ensureIsAdmin, BackOfficeController.getES);

module.exports = router;
