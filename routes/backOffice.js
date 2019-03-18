const { Authentication } = require('../middlewares/index');
const BackOfficeController = require('../controllers/backOffice');
const express = require('express');
const router = express.Router();

/**
 * @Route('/back-office/') GET;
 * Show Back Office Index page
 */
router.get('/', Authentication.ensureIsAdmin, BackOfficeController.index);

/**
 * @Route('/back-office/stats') GET;
 * Show Back Office Stats page
 */
router.get('/stats', Authentication.ensureIsAdmin, BackOfficeController.stats);

/**
 * @Route('/back-office/users/') GET;
 * Show Users List page
 */
router.get(
  '/users',
  Authentication.ensureIsAdmin,
  BackOfficeController.BackOffice.User.getAll);

/**
 * @Route('/back-office/users/candidates') GET;
 * Show Users (candidates type) List page
 */
router.get(
  '/users/:type',
  Authentication.ensureIsAdmin,
  BackOfficeController.BackOffice.User.getList);

/**
 * @Route('/back-office/user/:id/') GET;
 * Show User data
 */
router.get(
  '/user/:id',
  Authentication.ensureIsAdmin,
  BackOfficeController.getUser
).post(
  '/user/:id',
  Authentication.ensureIsAdmin,
  BackOfficeController.editCandidate);

/**
 * @Route('/back-office/impersonate/user/:id/') GET;
 * Impersonate User Session
 */
router.get('/impersonate/user/:id', Authentication.ensureIsAdmin, BackOfficeController.impersonateUser);

/**
 * @Route('/back-office/removeImpersonation/') GET;
 * Remove Impersonation
 */
router.get('/removeImpersonation', Authentication.ensureIsAdmin, BackOfficeController.removeUserImpersonation);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/') GET;
 * Generate PinCode for Remove Read Only
 */
router.post('/impersonateRemoveReadOnly', Authentication.ensureIsAdmin, BackOfficeController.impersonateRemoveReadOnly);
router.get('/impersonatePutReadOnly', Authentication.ensureIsAdmin, BackOfficeController.impersonatePutReadOnly);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/validate/') GET;
 * Validation of removing read only
 */
router.post('/impersonateRemoveReadOnly/validate', Authentication.ensureIsAdmin, BackOfficeController.impersonateRemoveReadOnlyValidation);

/**
 * @Route('/back-office/establishments/') GET;
 * Show establishments referential
 */
router.get('/establishments', Authentication.ensureIsAdmin, BackOfficeController.getEstablishmentsRefList);

/**
 * @Route('/back-office/es/') GET;
 * Show ES List page
 */
router.get('/es', Authentication.ensureIsAdmin, BackOfficeController.getESList);

/**
 * @Route('/back-office/es/:id') GET;
 * Show ES page
 */
router.get('/es/:id', Authentication.ensureIsAdmin, BackOfficeController.getES);

/**
 * @Route('/back-office/formations/') GET;
 * Show formations data
 */
router.get('/formations', Authentication.ensureIsAdmin, BackOfficeController.getFormations);

/**
 * @Route('/back-office/formations/') GET;
 * Show skills data
 */
router.get('/skills', Authentication.ensureIsAdmin, BackOfficeController.getSkills);

/**
 * @Route('/back-office/formations/') GET;
 * Show equipments data
 */
router.get('/equipments', Authentication.ensureIsAdmin, BackOfficeController.getEquipments);

/**
 * @Route('/back-office/formations/') GET;
 * Show softwares data
 */
router.get('/softwares', Authentication.ensureIsAdmin, BackOfficeController.getSoftwares);

/**
 * @Route('/back-office/formations/') GET;
 * Show services data
 */
router.get('/services', Authentication.ensureIsAdmin, BackOfficeController.getServices);

/**
 * @Route('/back-office/formations/') GET;
 * Show services data
 */
router.get('/posts', Authentication.ensureIsAdmin, BackOfficeController.getPosts);

/**
 * @Route('/back-office/formations/') GET;
 * Show qualifications data
 */
router.get('/qualifications', Authentication.ensureIsAdmin, BackOfficeController.getQualifications);

/**
 * @Route('/back-office/users/groups/') GET;
 * Show services data
 */
router.get('/users/groups', Authentication.ensureIsAdmin, BackOfficeController.getGroups);

/**
 * @Route('/back-office/users/super-groups/') GET;
 * Show services data
 */
router.get('/users/super-groups', Authentication.ensureIsAdmin, BackOfficeController.getSuperGroups);

/**
 * @Route('/back-office/formations/') GET;
 * Show qualifications data
 */
module.exports = router;
