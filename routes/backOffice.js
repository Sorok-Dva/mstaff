const { Authentication } = require('../middlewares/index');
const { BackOffice } = require('../components');
const express = require('express');
const router = express.Router();

/**
 * @Route('/back-office/') GET;
 * Show Back Office Index page
 */
router.get('/',
  Authentication.ensureIsAdmin,
  BackOffice.Main.viewIndex);

/**
 * @Route('/back-office/stats') GET;
 * Show Back Office Stats page
 */
router.get('/stats',
  Authentication.ensureIsAdmin,
  BackOffice.Main.ViewStats);

/**
 * @Route('/back-office/users/') GET;
 * Show Users List page
 */
router.get(
  '/users',
  Authentication.ensureIsAdmin,
  BackOffice.User.getAll);

/**
 * @Route('/back-office/users/candidates') GET;
 * Show Users (candidates type) List page
 */
router.get(
  '/users/:type',
  Authentication.ensureIsAdmin,
  BackOffice.User.getList);

/**
 * @Route('/back-office/user/:id(\\d+)/') GET;
 * Show User data
 */
router.get(
  '/user/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.User.findOne
).post(
  '/user/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.User.edit);

/**
 * @Route('/back-office/impersonate/user/:id(\\d+)/') GET;
 * Impersonate User Session
 */
router.get('/impersonate/user/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.User);

/**
 * @Route('/back-office/removeImpersonation/') GET;
 * Remove Impersonation
 */
router.get('/removeImpersonation',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.Remove);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/') GET;
 * Generate PinCode for Remove Read Only
 */
router.post('/impersonateRemoveReadOnly',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.removeReadOnly);

router.get('/impersonatePutReadOnly',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.PutReadOnly);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/validate/') GET;
 * Validation of removing read only
 */
router.post('/impersonateRemoveReadOnly/validate',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.RemoveReadOnlyValidation);

/**
 * @Route('/back-office/establishments/') GET;
 * Show establishments referential
 */
router.get('/establishments',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.ViewRefList);

/**
 * @Route('/back-office/es/') GET;
 * Show ES List page
 */
router.get('/es',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.ViewList);

/**
 * @Route('/back-office/es/:id(\\d+)') GET;
 * Show ES page
 */
router.get('/es/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.View
).post(
  '/es/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.Edit);

/**
 * @Route('/back-office/references/:type') GET;
 * Show Reference Model data
 */
router.get('/references/:type',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.View);

/**
 * @Route('/back-office/users/groups/') GET;
 * Show services data
 */
router.get('/groups', Authentication.ensureIsAdmin, BackOffice.Group.ViewGroups);

/**
 * @Route('/back-office/users/super-groups/') GET;
 * Show services data
 */
router.get('/super-groups', Authentication.ensureIsAdmin, BackOffice.Group.ViewSuperGroups);

/**
 * @Route('/back-office/settings/') GET;
 * Show app settings page
 */
router.get('/settings',
  Authentication.ensureIsAdmin,
  BackOffice.Main.ViewSettings);

module.exports = router;
