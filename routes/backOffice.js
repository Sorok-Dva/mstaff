const { Authentication } = require('../middlewares/index');
const Controller = require('../controllers/backOffice');//.BackOffice;
const express = require('express');
const router = express.Router();

/**
 * @Route('/back-office/') GET;
 * Show Back Office Index page
 */
router.get('/',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Main.viewIndex);

/**
 * @Route('/back-office/stats') GET;
 * Show Back Office Stats page
 */
router.get('/stats',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Main.ViewStats);

/**
 * @Route('/back-office/users/') GET;
 * Show Users List page
 */
router.get(
  '/users',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.User.getAll);

/**
 * @Route('/back-office/users/candidates') GET;
 * Show Users (candidates type) List page
 */
router.get(
  '/users/:type',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.User.getList);

/**
 * @Route('/back-office/user/:id/') GET;
 * Show User data
 */
router.get(
  '/user/:id',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.User.findOne
).post(
  '/user/:id',
  Authentication.ensureIsAdmin,
  Controller.editCandidate);

/**
 * @Route('/back-office/impersonate/user/:id/') GET;
 * Impersonate User Session
 */
router.get('/impersonate/user/:id', Authentication.ensureIsAdmin, Controller.impersonateUser);

/**
 * @Route('/back-office/removeImpersonation/') GET;
 * Remove Impersonation
 */
router.get('/removeImpersonation', Authentication.ensureIsAdmin, Controller.removeUserImpersonation);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/') GET;
 * Generate PinCode for Remove Read Only
 */
router.post('/impersonateRemoveReadOnly', Authentication.ensureIsAdmin, Controller.impersonateRemoveReadOnly);
router.get('/impersonatePutReadOnly', Authentication.ensureIsAdmin, Controller.impersonatePutReadOnly);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/validate/') GET;
 * Validation of removing read only
 */
router.post('/impersonateRemoveReadOnly/validate', Authentication.ensureIsAdmin, Controller.impersonateRemoveReadOnlyValidation);

/**
 * @Route('/back-office/establishments/') GET;
 * Show establishments referential
 */
router.get('/establishments',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Establishment.ViewRefList);

/**
 * @Route('/back-office/es/') GET;
 * Show ES List page
 */
router.get('/es',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Establishment.ViewList);

/**
 * @Route('/back-office/es/:id') GET;
 * Show ES page
 */
router.get('/es/:id',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Establishment.View);

/**
 * @Route('/back-office/references/:type') GET;
 * Show Reference Model data
 */
router.get('/references/:type',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Reference.View);

/**
 * @Route('/back-office/users/groups/') GET;
 * Show services data
 */
router.get('/users/groups', Authentication.ensureIsAdmin, Controller.getGroups);

/**
 * @Route('/back-office/users/super-groups/') GET;
 * Show services data
 */
router.get('/users/super-groups', Authentication.ensureIsAdmin, Controller.getSuperGroups);

module.exports = router;
